import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

export async function POST(
  req: Request
) {
  try {
    /*
     * Cashfree sends these headers
     * with the webhook.
     */

    const signature =
      req.headers.get(
        "x-webhook-signature"
      );

    const timestamp =
      req.headers.get(
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
     *
     * We need the RAW request body
     * for signature verification.
     *
     * Do NOT use req.json() first.
     */

    const rawBody =
      await req.text();

    /*
     * Cashfree webhook signature:
     *
     * HMAC-SHA256(
     *   timestamp + rawBody,
     *   CASHFREE_CLIENT_SECRET
     * )
     */

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

    /*
     * Prevent timing attacks.
     */

    const signaturesMatch =
      crypto.timingSafeEqual(
        Buffer.from(
          signature
        ),
        Buffer.from(
          expectedSignature
        )
      );

    if (!signaturesMatch) {
      console.error(
        "Invalid Cashfree webhook signature."
      );

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

    /*
     * Signature is valid.
     * Now we can safely parse the body.
     */

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

    /*
     * Cashfree payment webhook data.
     */

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
     * Only process successful payments.
     */

    if (
      paymentStatus !==
      "SUCCESS"
    ) {
      console.log(
        `Cashfree payment for ${orderId}: ${paymentStatus}`
      );

      return NextResponse.json(
        {
          received: true,
          processed: false,
          status: paymentStatus,
        },
        {
          status: 200,
        }
      );
    }

    /*
     * IMPORTANT:
     *
     * Make sure this really was
     * the ₹2,000 reservation payment.
     */

    if (
      Number(paymentAmount) !==
      2000
    ) {
      console.error(
        "Incorrect reservation payment amount:",
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

    /*
     * Connect to MongoDB.
     */

    await connectDB();

    /*
     * Find the reservation using
     * the Cashfree order ID.
     */

    const reservation =
      await Reservation.findOne({
        cashfreeOrderId:
          orderId,
      });

    /*
     * If no reservation exists yet,
     * don't blindly create one from
     * webhook data.
     *
     * Your confirmation route should
     * normally create the reservation
     * after verifying payment.
     */

    if (!reservation) {
      console.warn(
        `No reservation found for Cashfree order ${orderId}`
      );

      return NextResponse.json(
        {
          received: true,
          processed: false,
          reason:
            "Reservation not found.",
        },
        {
          status: 200,
        }
      );
    }

    /*
     * Idempotency:
     *
     * If Cashfree sends the same webhook
     * more than once, don't process it again.
     */

    if (
      reservation.paymentStatus ===
      "success"
    ) {
      return NextResponse.json(
        {
          received: true,
          processed: true,
          alreadyProcessed: true,
        },
        {
          status: 200,
        }
      );
    }

    /*
     * Mark payment as successful.
     */

    reservation.paymentStatus =
      "success";

    await reservation.save();

    console.log(
      `Reservation payment confirmed: ${orderId}`
    );

    return NextResponse.json(
      {
        received: true,
        processed: true,
      },
      {
        status: 200,
      }
    );
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
