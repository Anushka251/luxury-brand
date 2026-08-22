import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

/*
 * Health check.
 *
 * This allows you to open:
 *
 * https://avenorcollection.com/api/cashfree/webhook
 *
 * in Safari and confirm that the route exists.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "AVENOR Cashfree Webhook",
  });
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get(
      "x-webhook-signature"
    );

    const timestamp = req.headers.get(
      "x-webhook-timestamp"
    );

    if (!signature || !timestamp) {
      return NextResponse.json(
        {
          error:
            "Missing webhook signature.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * IMPORTANT:
     * Read the RAW body before parsing JSON.
     */
    const rawBody = await req.text();

    const signedPayload =
      timestamp + rawBody;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .CASHFREE_CLIENT_SECRET!
        )
        .update(signedPayload)
        .digest("base64");

    const signatureBuffer =
      Buffer.from(signature);

    const expectedBuffer =
      Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !==
      expectedBuffer.length
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid webhook signature.",
        },
        {
          status: 401,
        }
      );
    }

    const signaturesMatch =
      crypto.timingSafeEqual(
        signatureBuffer,
        expectedBuffer
      );

    if (!signaturesMatch) {
      return NextResponse.json(
        {
          error:
            "Invalid webhook signature.",
        },
        {
          status: 401,
        }
      );
    }

    const payload =
      JSON.parse(rawBody);

    console.log(
      "Cashfree webhook:",
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    const orderId =
      payload?.data?.order?.order_id;

    const paymentStatus =
      payload?.data?.payment
        ?.payment_status;

    const paymentAmount =
      payload?.data?.payment
        ?.payment_amount;

    if (!orderId) {
      return NextResponse.json(
        {
          error:
            "Order ID missing.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Only successful payments
     * confirm the reservation.
     */
    if (
      paymentStatus !==
      "SUCCESS"
    ) {
      console.log(
        `Cashfree payment ${orderId}: ${paymentStatus}`
      );

      return NextResponse.json({
        received: true,
        processed: false,
        status: paymentStatus,
      });
    }

    /*
     * Reservation fee must be ₹2,000.
     */
    if (
      Number(paymentAmount) !==
      2000
    ) {
      console.error(
        "Invalid reservation payment amount:",
        paymentAmount
      );

      return NextResponse.json(
        {
          error:
            "Invalid payment amount.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const reservation =
      await Reservation.findOne({
        cashfreeOrderId:
          orderId,
      });

    if (!reservation) {
      console.warn(
        `No reservation found for ${orderId}`
      );

      return NextResponse.json({
        received: true,
        processed: false,
        reason:
          "Reservation not found.",
      });
    }

    /*
     * Prevent duplicate processing.
     */
    if (
      reservation.paymentStatus ===
      "success"
    ) {
      return NextResponse.json({
        received: true,
        processed: true,
        alreadyProcessed: true,
      });
    }

    reservation.paymentStatus =
      "success";

    await reservation.save();

    console.log(
      `AVENOR reservation confirmed: ${orderId}`
    );

    return NextResponse.json({
      received: true,
      processed: true,
      orderId,
    });
  } catch (error) {
    console.error(
      "Cashfree webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}
