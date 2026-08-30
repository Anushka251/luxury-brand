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

    if (!orderId.startsWith("AVENOR_RES_")) {
      return NextResponse.json(
        {
          error: "Invalid reservation order.",
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

    /*
     * =========================================================
     * FIND RESERVATION
     * =========================================================
     */

    const reservation =
      await Reservation.findOne({
        cashfreeOrderId: orderId,
      });

    if (!reservation) {
      return NextResponse.json(
        {
          error: "Reservation not found.",
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
     * confirmed + confirmed = PRIVATE ACCESS
     *
     * Do not verify again and do not send
     * another confirmation email.
     */

    if (
      reservation.paymentStatus === "confirmed" &&
      reservation.status === "confirmed"
    ) {
      return NextResponse.json({
        success: true,
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
        success: true,
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
        success: true,
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
     * Do NOT trust an amount sent from
     * the browser.
     */

    const expectedAmount =
      Number(
        reservation.reservationFee
      );

    if (
      !Number.isFinite(expectedAmount) ||
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
     * VERIFY PAYMENT WITH CASHFREE
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
            Accept: "application/json",

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
     * NORMALIZE CASHFREE RESPONSE
     * =========================================================
     *
     * Cashfree normally returns an array
     * of payment transactions.
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
     * payment amount = reservation fee
     *
     * THEN:
     *
     * paymentStatus = confirmed
     * status = confirmed
     *
     * PRIVATE ACCESS = TRUE
     */

    const successfulPayment =
      payments.find(
        (payment) =>
          String(
            payment.payment_status
          ).toUpperCase() === "SUCCESS" &&
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
       * Email failure must NOT undo
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
        success: true,

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
          ).toUpperCase() === "PENDING"
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
        success: true,

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
     * OTHER / FAILED PAYMENT
     * =========================================================
     *
     * Do NOT mark the reservation as
     * confirmed.
     *
     * Keep the reservation available
     * for another payment attempt.
     */

    if (payments.length > 0) {
      reservation.paymentStatus =
        "pending";

      reservation.status =
        "pending";

      await reservation.save();

      console.log(
        `AVENOR reservation payment not successful: ${orderId}`
      );

      return NextResponse.json({
        success: true,

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
     * NO PAYMENT TRANSACTION
     * =========================================================
     *
     * Cashfree may still be processing.
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
      success: true,

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
