import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

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
          error:
            "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Only allow AVENOR reservation
     * orders to be checked through
     * this endpoint.
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
     * Find the reservation created
     * when the Cashfree order was made.
     */

    const reservation =
      await Reservation.findOne({
        cashfreeOrderId:
          orderId,
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
     * If the webhook has already confirmed
     * the payment, don't needlessly call
     * Cashfree again.
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
     * Cashfree API URL.
     *
     * This matches the production API used
     * by your existing /api/cashfree route.
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

    const payments =
      await cashfreeResponse.json();

    console.log(
      "Cashfree payment verification:",
      JSON.stringify(
        payments,
        null,
        2
      )
    );

    if (!cashfreeResponse.ok) {
      console.error(
        "Cashfree verification failed:",
        payments
      );

      return NextResponse.json(
        {
          error:
            payments.message ||
            payments.error ||
            "Unable to verify payment with Cashfree.",
        },
        {
          status:
            cashfreeResponse.status,
        }
      );
    }

    /*
     * Cashfree returns payment transactions
     * for the order.
     */

    const transactions =
      Array.isArray(payments)
        ? payments
        : [];

    /*
     * Look for a successful ₹2,000 payment.
     */

    const successfulPayment =
      transactions.find(
        (payment: any) =>
          payment?.payment_status ===
            "SUCCESS" &&
          Number(
            payment?.payment_amount
          ) === 2000
      );

    /*
     * SUCCESS
     */

    if (successfulPayment) {
      reservation.paymentStatus =
        "success";

      reservation.reservationFee =
        2000;

      await reservation.save();

      console.log(
        `AVENOR reservation confirmed: ${orderId}`
      );

      return NextResponse.json({
        paymentStatus: "success",
        orderId,
      });
    }

    /*
     * Check whether there is a pending
     * payment attempt.
     */

    const pendingPayment =
      transactions.find(
        (payment: any) =>
          payment?.payment_status ===
          "PENDING"
      );

    if (pendingPayment) {
      reservation.paymentStatus =
        "pending";

      await reservation.save();

      return NextResponse.json({
        paymentStatus: "pending",
        orderId,
      });
    }

    /*
     * If Cashfree has returned payment
     * transactions but none succeeded
     * or remain pending, mark it failed.
     */

    if (transactions.length > 0) {
      reservation.paymentStatus =
        "failed";

      await reservation.save();

      return NextResponse.json({
        paymentStatus: "failed",
        orderId,
      });
    }

    /*
     * No payment transaction yet.
     *
     * Keep the reservation pending because
     * the payment may still be processing
     * or the webhook may arrive shortly.
     */

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
