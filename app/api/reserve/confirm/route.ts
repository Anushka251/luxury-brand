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
     * =========================================================
     * VALIDATE ORDER ID
     * =========================================================
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
     * =========================================================
     * CONNECT DATABASE
     * =========================================================
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
     * =========================================================
     * ALREADY CONFIRMED
     * =========================================================
     *
     * A confirmed reservation means:
     *
     * paymentStatus = confirmed
     * status = confirmed
     *
     * Therefore the customer already has
     * permanent PRIVATE ACCESS.
     *
     * Do not send another confirmation email.
     */

    if (
      reservation.paymentStatus ===
        "confirmed" &&
      reservation.status ===
        "confirmed"
    ) {
      return NextResponse.json({
        paymentStatus:
          "confirmed",

        reservationStatus:
          "confirmed",

        privateAccess: true,

        orderId,
      });
    }

    /*
     * =========================================================
     * ALREADY PURCHASED
     * =========================================================
     *
     * If the reservation has already been
     * used for a purchase, do not allow the
     * payment-confirmation endpoint to change
     * its state again.
     */

    if (
      reservation.status ===
      "purchased"
    ) {
      return NextResponse.json({
        paymentStatus:
          reservation.paymentStatus,

        reservationStatus:
          "purchased",

        privateAccess: true,

        orderId,
      });
    }

    /*
     * =========================================================
     * ALREADY REFUNDED
     * =========================================================
     */

    if (
      reservation.status ===
      "refunded"
    ) {
      return NextResponse.json({
        paymentStatus:
          reservation.paymentStatus,

        reservationStatus:
          "refunded",

        privateAccess: false,

        orderId,
      });
    }

    /*
     * =========================================================
     * EXPECTED PAYMENT AMOUNT
     * =========================================================
     *
     * IMPORTANT:
     *
     * Never trust the amount sent by the browser.
     *
     * We use the amount stored in MongoDB.
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
     * =========================================================
     * ASK CASHFREE FOR PAYMENT STATUS
     * =========================================================
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
      "Cashfree reservation payment verification:",
      JSON.stringify(
        cashfreeData,
        null,
        2
      )
    );

    /*
     * =========================================================
     * CASHFREE API ERROR
     * =========================================================
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
     * =========================================================
     * PAYMENT TRANSACTIONS
     * =========================================================
     */

    const payments: CashfreePayment[] =
      Array.isArray(cashfreeData)
        ? cashfreeData
        : [];

    /*
     * =========================================================
     * SUCCESSFUL PAYMENT
     * =========================================================
     *
     * Cashfree:
     *
     * payment_status = SUCCESS
     *
     * AND
     *
     * payment amount = expected amount
     *
     * THEN:
     *
     * paymentStatus = confirmed
     * status = confirmed
     * privateAccess = true
     *
     * This is the moment the customer
     * receives PRIVATE ACCESS.
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
        "confirmed";

      reservation.status =
        "confirmed";

      await reservation.save();

      /*
       * =======================================================
       * SEND CONFIRMATION EMAIL
       * =======================================================
       *
       * Email failure must NOT undo the
       * successful payment.
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
        console.error(
          "Reservation confirmation email failed:",
          emailError
        );
      }

      console.log(
        `AVENOR PRIVATE ACCESS CONFIRMED: ${orderId}`
      );

      return NextResponse.json({
        paymentStatus:
          "confirmed",

        reservationStatus:
          "confirmed",

        privateAccess: true,

        orderId,
      });
    }

    /*
     * =========================================================
     * PENDING PAYMENT
     * =========================================================
     *
     * Payment is not complete yet.
     *
     * Therefore:
     *
     * paymentStatus = pending
     * status = pending
     * privateAccess = false
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
        paymentStatus:
          "pending",

        reservationStatus:
          "pending",

        privateAccess: false,

        orderId,
      });
    }

    /*
     * =========================================================
     * FAILED PAYMENT
     * =========================================================
     *
     * A transaction exists but there is
     * no successful or pending transaction.
     *
     * Keep the reservation itself pending.
     *
     * This means the customer does NOT
     * receive private access.
     *
     * They can try payment again.
     */

    if (payments.length > 0) {
      reservation.paymentStatus =
        "pending";

      reservation.status =
        "pending";

      await reservation.save();

      console.log(
        `AVENOR reservation payment FAILED: ${orderId}`
      );

      return NextResponse.json({
        paymentStatus:
          "failed",

        reservationStatus:
          "pending",

        privateAccess: false,

        orderId,
      });
    }

    /*
     * =========================================================
     * NO PAYMENT TRANSACTION YET
     * =========================================================
     *
     * Cashfree may still be processing
     * the payment.
     *
     * Never grant private access here.
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
      paymentStatus:
        "pending",

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
