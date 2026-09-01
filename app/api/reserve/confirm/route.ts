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
     * ALREADY REFUNDED
     * =========================================================
     */

    if (
      reservation.status === "refunded"
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
     * ALREADY PURCHASED
     * =========================================================
     */

    if (
      reservation.status === "purchased"
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
     * EXPECTED PAYMENT AMOUNT
     * =========================================================
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
     * VERIFY PAYMENT WITH CASHFREE
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

      /*
       * =======================================================
       * CONFIRM RESERVATION
       * =======================================================
       */

      reservation.paymentStatus =
        "confirmed";

      reservation.status =
        "confirmed";

      await reservation.save();

      /*
       * =======================================================
       * SEND AVENOR EMAIL
       * =======================================================
       *
       * Only send once.
       */

      if (
        reservation.confirmationEmailSent !==
        true
      ) {
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

          reservation.confirmationEmailSent =
            true;

          reservation.confirmationEmailSentAt =
            new Date();

          await reservation.save();

          console.log(
            `AVENOR reservation confirmation email sent: ${orderId}`
          );

        } catch (emailError) {

          /*
           * Email failure does NOT
           * cancel the successful payment.
           */

          console.error(
            "AVENOR reservation email failed:",
            emailError
          );

        }
      } else {
        console.log(
          `AVENOR reservation email already sent: ${orderId}`
        );
      }

      /*
       * =======================================================
       * PRIVATE ACCESS
       * =======================================================
       */

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
     * FAILED / OTHER PAYMENT
     * =========================================================
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
     * NO PAYMENT YET
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
