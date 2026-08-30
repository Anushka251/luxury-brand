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
     * A successful reservation payment gives
     * this customer permanent private access
     * to this product.
     *
     * Do not verify the payment again or send
     * another confirmation email.
     */

    if (
      reservation.paymentStatus ===
      "success"
    ) {
      return NextResponse.json({
        paymentStatus: "success",

        reservationStatus:
          reservation.status,

        privateAccess:
          reservation.privateAccess === true,

        orderId,
      });
    }

    /*
     * ==========================================
     * EXPECTED PAYMENT AMOUNT
     * ==========================================
     *
     * The amount comes from the database.
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
     * SUCCESSFUL PAYMENT
     * ==========================================
     *
     * IMPORTANT:
     *
     * paymentStatus:
     * pending → success
     *
     * privateAccess:
     * false → true
     *
     * status remains:
     * pending
     *
     * "privateAccess" is what permanently
     * identifies this customer as someone
     * allowed to purchase during the private
     * purchase window.
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

      /*
       * Permanently grant private access.
       */

      reservation.privateAccess =
        true;

      /*
       * Keep the reservation workflow
       * status separate from payment/access.
       *
       * It can later become:
       *
       * pending
       * contacted
       * allocated
       * closed
       */

      reservation.status =
        "pending";

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
          reservation.status,

        privateAccess: true,

        orderId,
      });
    }

    /*
     * ==========================================
     * PENDING PAYMENT
     * ==========================================
     *
     * Payment is not complete.
     *
     * privateAccess remains false.
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

      reservation.privateAccess =
        false;

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
     * FAILED PAYMENT
     * ==========================================
     *
     * The payment failed.
     *
     * Do NOT give private access.
     *
     * The reservation itself remains available
     * so the customer can try payment again.
     */

    if (payments.length > 0) {
      reservation.paymentStatus =
        "failed";

      reservation.privateAccess =
        false;

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
     * Do not mark the reservation failed.
     */

    reservation.paymentStatus =
      "pending";

    reservation.privateAccess =
      false;

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
