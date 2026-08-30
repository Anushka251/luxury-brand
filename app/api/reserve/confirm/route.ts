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
          error:
            "Order ID is required.",
        },
        { status: 400 }
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
        { status: 400 }
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
     * EXPECTED AMOUNT
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

    const isTestMode =
      process.env.AVENOR_RESERVATION_TEST_MODE ===
      "true";

    const cashfreeBaseUrl =
      isTestMode
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
        },
        {
          status:
            cashfreeResponse.status,
        }
      );
    }

    /*
     * =========================================================
     * PAYMENTS
     * =========================================================
     */

    const payments:
      CashfreePayment[] =
      Array.isArray(cashfreeData)
        ? cashfreeData
        : [];

    /*
     * =========================================================
     * SUCCESS
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
      reservation.paymentStatus =
        "confirmed";

      reservation.status =
        "confirmed";

      await reservation.save();

      /*
       * EMAIL
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
     * PENDING
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
     * NO TRANSACTION YET
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
