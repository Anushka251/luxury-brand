import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import {
  sendReservationConfirmationEmail,
} from "@/lib/mailer";

type CashfreePayment = {
  payment_status?: string;
  payment_amount?: number | string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { orderId } = body;

    /*
     * ==========================================
     * VALIDATE ORDER ID
     * ==========================================
     */

    if (
      !orderId ||
      typeof orderId !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !orderId.startsWith(
        "AVENOR_RES_"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid reservation order.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * DATABASE
     * ==========================================
     */

    await connectDB();

    const reservation =
      await Reservation.findOne({
        cashfreeOrderId: orderId,
      });

    if (!reservation) {
      return NextResponse.json(
        {
          error:
            "Reservation not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ==========================================
     * ALREADY CONFIRMED
     * ==========================================
     *
     * Do not send another email if the
     * reservation has already been confirmed.
     */

    if (
      reservation.paymentStatus ===
      "success"
    ) {
      return NextResponse.json({
        paymentStatus: "success",
        orderId,
      });
    }

    /*
     * ==========================================
     * EXPECTED PAYMENT AMOUNT
     * ==========================================
     *
     * This comes directly from the reservation.
     *
     * Test mode:
     * ₹1
     *
     * Production:
     * ₹2,000
     */

    const expectedAmount =
      Number(
        reservation.reservationFee
      );

    if (
      !Number.isFinite(
        expectedAmount
      ) ||
      expectedAmount <= 0
    ) {
      console.error(
        "Invalid reservation fee:",
        reservation.reservationFee
      );

      return NextResponse.json(
        {
          error:
            "Invalid reservation payment amount.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================
     * ASK CASHFREE FOR PAYMENT STATUS
     * ==========================================
     */

    const cashfreeResponse =
      await fetch(
        `https://api.cashfree.com/pg/orders/${encodeURIComponent(
          orderId
        )}/payments`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            "x-client-id":
              process.env
                .CASHFREE_CLIENT_ID!,

            "x-client-secret":
              process.env
                .CASHFREE_CLIENT_SECRET!,

            "x-api-version":
              "2023-08-01",
          },

          cache: "no-store",
        }
      );

    const cashfreeData =
      await cashfreeResponse.json();

    console.log(
      "Cashfree payment verification:",
      JSON.stringify(
        cashfreeData,
        null,
        2
      )
    );

    /*
     * ==========================================
     * CASHFREE API ERROR
     * ==========================================
     */

    if (!cashfreeResponse.ok) {
      console.error(
        "Cashfree verification failed:",
        cashfreeData
      );

      return NextResponse.json(
        {
          error:
            cashfreeData?.message ||
            cashfreeData?.error ||
            "Unable to verify payment with Cashfree.",
        },
        {
          status:
            cashfreeResponse.status,
        }
      );
    }

    /*
     * ==========================================
     * PAYMENT TRANSACTIONS
     * ==========================================
     */

    const payments: CashfreePayment[] =
      Array.isArray(cashfreeData)
        ? cashfreeData
        : [];

    /*
     * ==========================================
     * SUCCESS
     * ==========================================
     */

    const successfulPayment =
      payments.find(
        (payment) =>
          payment.payment_status ===
            "SUCCESS" &&
          Number(
            payment.payment_amount
          ) === expectedAmount
      );

    if (successfulPayment) {
      reservation.paymentStatus =
        "success";

      reservation.status =
        "confirmed";

      await reservation.save();

      /*
       * ========================================
       * SEND CONFIRMATION EMAIL
       * ========================================
       */

      try {
        await sendReservationConfirmationEmail(
          {
            customerEmail:
              reservation.email,

            customerName:
              reservation.fullName,

            product:
              reservation.product,

            orderId,

            reservationFee:
              expectedAmount,
          }
        );

        console.log(
          `AVENOR reservation email sent: ${orderId}`
        );
      } catch (emailError) {
        /*
         * Do NOT turn a successful payment
         * into a failed payment just because
         * the email failed.
         */

        console.error(
          "Reservation confirmation email failed:",
          emailError
        );
      }

      console.log(
        `AVENOR reservation payment SUCCESS: ${orderId}`
      );

      return NextResponse.json({
        paymentStatus: "success",
        orderId,
      });
    }

    /*
     * ==========================================
     * PENDING
     * ==========================================
     */

    const pendingPayment =
      payments.find(
        (payment) =>
          payment.payment_status ===
          "PENDING"
      );

    if (pendingPayment) {
      reservation.paymentStatus =
        "pending";

      reservation.status =
        "pending";

      await reservation.save();

      console.log(
        `AVENOR reservation payment PENDING: ${orderId}`
      );

      return NextResponse.json({
        paymentStatus: "pending",
        orderId,
      });
    }

    /*
     * ==========================================
     * FAILED
     * ==========================================
     *
     * A transaction exists, but there is
     * no successful or pending payment.
     */

    if (payments.length > 0) {
      reservation.paymentStatus =
        "failed";

      reservation.status =
        "failed";

      await reservation.save();

      console.log(
        `AVENOR reservation payment FAILED: ${orderId}`
      );

      return NextResponse.json({
        paymentStatus: "failed",
        orderId,
      });
    }

    /*
     * ==========================================
     * NO PAYMENT TRANSACTION YET
     * ==========================================
     *
     * Do not mark this failed.
     *
     * Cashfree may still be processing it,
     * or the webhook may arrive shortly.
     */

    reservation.paymentStatus =
      "pending";

    reservation.status =
      "pending";

    await reservation.save();

    console.log(
      `AVENOR reservation has no payment transaction yet: ${orderId}`
    );

    return NextResponse.json({
      paymentStatus: "pending",
      orderId,
    });
  } catch (error) {
    console.error(
      "Reservation payment confirmation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to verify reservation payment.",
      },
      {
        status: 500,
      }
    );
  }
}
