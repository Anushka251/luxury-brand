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
     * Once payment has successfully been
     * confirmed, the customer permanently
     * has private access.
     *
     * Do not send the confirmation email again.
     */

    if (
      reservation.paymentStatus ===
      "success"
    ) {
      return NextResponse.json({
        paymentStatus: "success",
        reservationStatus:
          reservation.status,
        orderId,
      });
    }

    /*
     * ==========================================
     * EXPECTED PAYMENT AMOUNT
     * ==========================================
     *
     * This is taken from the reservation
     * itself rather than trusting the client.
     *
     * Test:
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
     *
     * This is the important transition:
     *
     * paymentStatus:
     * pending → success
     *
     * status:
     * pending → confirmed
     *
     * "confirmed" means the customer now
     * permanently has PRIVATE ACCESS for
     * this product.
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
          `AVENOR reservation confirmation email sent: ${orderId}`
        );
      } catch (emailError) {
        /*
         * Email failure must NOT undo
         * the successful payment.
         */

        console.error(
          "Reservation confirmation email failed:",
          emailError
        );
      }

      console.log(
        `AVENOR PRIVATE ACCESS CONFIRMED: ${orderId}`
      );

      return NextResponse.json({
        paymentStatus: "success",

        reservationStatus:
          "confirmed",

        privateAccess: true,

        orderId,
      });
    }

    /*
     * ==========================================
     * PENDING
     * ==========================================
     *
     * Payment has not completed yet.
     *
     * The customer does NOT have private
     * access yet.
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

        reservationStatus:
          "pending",

        privateAccess: false,

        orderId,
      });
    }

    /*
     * ==========================================
     * FAILED
     * ==========================================
     *
     * IMPORTANT:
     *
     * We only change paymentStatus here.
     *
     * We DO NOT set:
     *
     * reservation.status = "failed"
     *
     * because "failed" is not a valid
     * reservation status in the new schema.
     */

    if (payments.length > 0) {
      reservation.paymentStatus =
        "failed";

      /*
       * Keep reservation.status as pending.
       *
       * This means:
       *
       * payment failed
       * ↓
       * private access NOT granted
       * ↓
       * customer can try again
       */

      reservation.status =
        "pending";

      await reservation.save();

      console.log(
        `AVENOR reservation payment FAILED: ${orderId}`
      );

      return NextResponse.json({
        paymentStatus: "failed",

        reservationStatus:
          "pending",

        privateAccess: false,

        orderId,
      });
    }

    /*
     * ==========================================
     * NO PAYMENT TRANSACTION YET
     * ==========================================
     *
     * Cashfree may still be processing the
     * payment.
     *
     * Never mark this as failed simply because
     * there is no transaction yet.
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

      reservationStatus:
        "pending",

      privateAccess: false,

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
