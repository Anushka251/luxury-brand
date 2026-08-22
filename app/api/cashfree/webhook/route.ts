import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

export async function POST(req: Request) {
  try {
    /*
     * Cashfree webhook headers
     */
    const signature = req.headers.get(
      "x-webhook-signature"
    );

    const timestamp = req.headers.get(
      "x-webhook-timestamp"
    );

    if (!signature || !timestamp) {
      console.error(
        "Cashfree webhook: missing signature or timestamp."
      );

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
     * Cashfree signature verification requires
     * the RAW request body.
     *
     * Do NOT call req.json() before this.
     */
    const rawBody = await req.text();

    /*
     * Cashfree signature:
     *
     * HMAC-SHA256(
     *   timestamp + rawBody,
     *   CASHFREE_CLIENT_SECRET
     * )
     *
     * Encoded as Base64.
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
     * Safely compare signatures.
     *
     * timingSafeEqual requires buffers
     * of the same length.
     */
    const signatureBuffer =
      Buffer.from(signature);

    const expectedBuffer =
      Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !==
      expectedBuffer.length
    ) {
      console.error(
        "Cashfree webhook: invalid signature."
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

    const signaturesMatch =
      crypto.timingSafeEqual(
        signatureBuffer,
        expectedBuffer
      );

    if (!signaturesMatch) {
      console.error(
        "Cashfree webhook: signature verification failed."
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
     * Now it is safe to parse the body.
     */
    const payload =
      JSON.parse(rawBody);

    console.log(
      "Cashfree webhook received:",
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    /*
     * Extract payment information.
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
      console.error(
        "Cashfree webhook: order ID missing."
      );

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
     * We only confirm the reservation
     * when Cashfree reports SUCCESS.
     *
     * Other statuses can be acknowledged
     * without marking the reservation as paid.
     */
    if (
      paymentStatus !==
      "SUCCESS"
    ) {
      console.log(
        `Cashfree payment ${orderId}: ${paymentStatus}`
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
     * Reservation fee must be exactly ₹2,000.
     */
    if (
      Number(paymentAmount) !==
      2000
    ) {
      console.error(
        "Cashfree webhook: incorrect payment amount.",
        {
          orderId,
          paymentAmount,
        }
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
     * Find the pending reservation
     * created by /api/cashfree.
     */
    const reservation =
      await Reservation.findOne({
        cashfreeOrderId:
          orderId,
      });

    if (!reservation) {
      /*
       * We acknowledge the webhook rather
       * than repeatedly retrying forever.
       *
       * This should normally never happen
       * because /api/cashfree creates the
       * MongoDB reservation before checkout.
       */
      console.warn(
        `No reservation found for Cashfree order ${orderId}.`
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
     * Cashfree may send the same event more
     * than once. If we already processed it,
     * do nothing.
     */
    if (
      reservation.paymentStatus ===
      "success"
    ) {
      console.log(
        `Reservation ${orderId} already confirmed.`
      );

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
     * Confirm the reservation payment.
     */
    reservation.paymentStatus =
      "success";

    await reservation.save();

    console.log(
      `AVENOR reservation payment confirmed: ${orderId}`
    );

    return NextResponse.json(
      {
        received: true,
        processed: true,
        orderId,
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
