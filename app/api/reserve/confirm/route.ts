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
        { status: 400 }
      );
    }

    if (
      !orderId.startsWith("AVENOR_RES_")
    ) {
      return NextResponse.json(
        {
          error: "Invalid reservation order.",
        },
        { status: 400 }
      );
    }

    /*
     * =========================================================
     * DATABASE
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
          error: "Reservation not found.",
        },
        { status: 404 }
      );
    }

    /*
     * =========================================================
     * ALREADY CONFIRMED
     * =========================================================
     */

    if (
      reservation.paymentStatus ===
        "confirmed" &&
      reservation.status ===
        "confirmed"
    ) {
      return NextResponse.json({
        paymentStatus: "confirmed",
        reservationStatus: "confirmed",
        privateAccess: true,
        orderId,
      });
    }

    /*
     * =========================================================
     * ALREADY PURCHASED
     * =========================================================
     */

    if (
      reservation.status === "purchased"
    ) {
      return NextResponse.json({
        paymentStatus:
          reservation.paymentStatus,
        reservationStatus: "purchased",
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
      reservation.status === "refunded"
    ) {
      return NextResponse.json({
        paymentStatus:
          reservation.paymentStatus,
        reservationStatus: "refunded",
        privateAccess: false,
        orderId,
      });
    }

    /*
     * =========================================================
     * EXPECTED PAYMENT AMOUNT
     * =========================================================
     *
     * The amount comes from MongoDB.
     *
     * Current reservation fee:
     *
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
        { status: 500 }
      );
    }

    /*
     * =========================================================
     * CASHFREE ENVIRONMENT
     * =========================================================
     *
     * IMPORTANT:
     *
     * This MUST match app/api/reserve/route.ts
     *
     * CASHFREE_MODE=sandbox
     *     → Sandbox
     *
     * CASHFREE_MODE=production
     *     → Production
     */

    const cashfreeMode =
      process.env.CASHFREE_MODE ===
      "sandbox"
        ? "sandbox"
        : "production";

    const cashfreeBaseUrl =
      cashfreeMode === "sandbox"
        ? "https://sandbox.cashfree.com/pg"
        : "https://api.cashfree.com/pg";

    /*
     * =========================================================
     * CASHFREE CREDENTIAL CHECK
     * =========================================================
     */

    if (
      !process.env.CASHFREE_CLIENT_ID ||
      !process.env.CASHFREE_CLIENT_SECRET
    ) {
      console.error(
        "Cashfree credentials are missing."
      );

      return NextResponse.json(
        {
          error:
            "Cashfree configuration is incomplete.",
        },
        { status: 500 }
      );
    }

    /*
     * =========================================================
     * GET CASHFREE PAYMENTS
     * =========================================================
     */

    const cashfreeResponse =
      await fetch(
        `${cashfreeBaseUrl}/orders/${encodeURIComponent(
          orderId
        )}/payments`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            "x-client-id":
              process.env
                .CASHFREE_CLIENT_ID,

            "x-client-secret":
              process.env
                .CASHFREE_CLIENT_SECRET,

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

          details:
            cashfreeData,
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

    const payments:
      CashfreePayment[] =
      Array.isArray(cashfreeData)
        ? cashfreeData
        : [];

    /*
     * =========================================================
     * SUCCESSFUL PAYMENT
     * =========================================================
     *
     * Cashfree must report:
     *
     * payment_status = SUCCESS
     *
     * AND
     *
     * payment_amount = ₹2,000
     *
     * Only then is private access granted.
     */

    const successfulPayment =
      payments.find(
        (payment) =>
          String(
            payment.payment_status
          ).toUpperCase() ===
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
       * CONFIRMATION EMAIL
       * =======================================================
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
          `AVENOR confirmation email sent: ${orderId}`
        );
      } catch (emailError) {
        /*
         * Email failure must NOT
         * cancel successful access.
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
     */

    const pendingPayment =
      payments.find(
        (payment) =>
          String(
            payment.payment_status
          ).toUpperCase() ===
          "PENDING"
      );

    if (pendingPayment) {
      reservation.paymentStatus =
        "pending";

      reservation.status =
        "pending";

      await reservation.save();

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
     * FAILED / OTHER TRANSACTION
     * =========================================================
     *
     * Do NOT grant private access.
     *
     * Keep the reservation pending so
     * the customer can retry.
     */

    if (payments.length > 0) {
      reservation.paymentStatus =
        "pending";

      reservation.status =
        "pending";

      await reservation.save();

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
     */

    reservation.paymentStatus =
      "pending";

    reservation.status =
      "pending";

    await reservation.save();

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
      { status: 500 }
    );
  }
}
