import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

type CashfreePayment = {
  payment_status?: string;
  payment_amount?: number | string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { orderId } = body;

    /*
     * Validate order ID
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

    /*
     * Only allow AVENOR reservation
     * orders.
     */

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
     * Connect to MongoDB.
     */

    await connectDB();

    /*
     * Find the reservation.
     */

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
     * If webhook already confirmed
     * the payment, return success.
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
     * Ask Cashfree directly for the
     * payment transactions belonging
     * to this order.
     *
     * IMPORTANT:
     * This is what tells us whether
     * the payment actually succeeded,
     * is pending, or failed.
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
     * Cashfree API error.
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
     * Cashfree returns an array of
     * payment transactions.
     */

    const payments: CashfreePayment[] =
      Array.isArray(cashfreeData)
        ? cashfreeData
        : [];

    /*
     * --------------------------------
     * SUCCESS
     * --------------------------------
     *
     * If ANY transaction is a
     * successful ₹2,000 payment,
     * the reservation is confirmed.
     */

    const successfulPayment =
      payments.find(
        (payment) =>
          payment.payment_status ===
            "SUCCESS" &&
          Number(
            payment.payment_amount
          ) === 2000
      );

    if (successfulPayment) {
      reservation.paymentStatus =
        "success";

      reservation.reservationFee =
        2000;

      await reservation.save();

      console.log(
        `AVENOR reservation payment SUCCESS: ${orderId}`
      );

      return NextResponse.json({
        paymentStatus: "success",
        orderId,
      });
    }

    /*
     * --------------------------------
     * PENDING
     * --------------------------------
     *
     * If there is a pending transaction,
     * keep the reservation pending.
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
     * --------------------------------
     * FAILED
     * --------------------------------
     *
     * Cashfree considers the payment
     * a failure when there are payment
     * transactions but none are
     * SUCCESS or PENDING.
     *
     * This includes cases such as
     * user-dropped payment or
     * transaction failure.
     */

    if (payments.length > 0) {
      reservation.paymentStatus =
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
     * --------------------------------
     * NO TRANSACTION YET
     * --------------------------------
     *
     * There is no payment transaction
     * recorded yet.
     *
     * Do NOT call this failed because
     * Cashfree may still be processing
     * the payment or the webhook may
     * arrive shortly.
     */

    reservation.paymentStatus =
      "pending";

    await reservation.save();

    console.log(
      `AVENOR reservation payment has no transaction yet: ${orderId}`
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
