import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

/*
 * GET health check
 *
 * Open this in Safari to confirm that
 * the webhook route exists:
 *
 * https://avenorcollection.com/api/cashfree/webhook
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "AVENOR Cashfree Webhook",
  });
}

/*
 * POST Cashfree webhook
 */
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
     * We MUST read the raw body before
     * parsing JSON because Cashfree's
     * signature is calculated using
     * the exact raw request body.
     */
    const rawBody = await req.text();

    /*
     * Cashfree signature:
     *
     * HMAC-SHA256(
     *   timestamp + rawBody,
     *   client secret
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
     * Safely compare signatures.
     */
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
     * Now parse the webhook.
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

    /*
     * Validate order ID.
     */
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
     * Only process AVENOR reservation
     * orders.
     */
    if (
      typeof orderId !== "string" ||
      !orderId.startsWith(
        "AVENOR_RES_"
      )
    ) {
      console.warn(
        `Ignoring non-AVENOR reservation order: ${orderId}`
      );

      return NextResponse.json({
        received: true,
        processed: false,
        reason:
          "Not an AVENOR reservation order.",
      });
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
     * If the reservation doesn't exist,
     * don't create one blindly from the
     * webhook.
     */
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
     * IMPORTANT:
     *
     * Use the amount stored in MongoDB.
     *
     * During testing:
     * reservationFee = 1
     *
     * During launch:
     * reservationFee = 2000
     *
     * Therefore you don't need to
     * change this webhook when switching
     * between testing and production.
     */
    const expectedAmount =
      Number(
        reservation.reservationFee
      );

    /*
     * --------------------------------
     * SUCCESSFUL PAYMENT
     * --------------------------------
     */
    if (
      paymentStatus === "SUCCESS"
    ) {
      /*
       * Verify the amount.
       */
      if (
        Number(paymentAmount) !==
        expectedAmount
      ) {
        console.error(
          "Invalid reservation payment amount:",
          {
            orderId,
            received:
              paymentAmount,
            expected:
              expectedAmount,
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
       * Idempotency:
       *
       * Cashfree can send the same
       * webhook more than once.
       */
      if (
        reservation.paymentStatus ===
        "success"
      ) {
        return NextResponse.json({
          received: true,
          processed: true,
          alreadyProcessed: true,
          orderId,
        });
      }

      /*
       * Mark reservation as paid.
       */
      reservation.paymentStatus =
        "success";

      await reservation.save();

      console.log(
        `AVENOR reservation confirmed: ${orderId}`
      );

      return NextResponse.json({
        received: true,
        processed: true,
        paymentStatus: "success",
        orderId,
      });
    }

    /*
     * --------------------------------
     * PENDING PAYMENT
     * --------------------------------
     */
    if (
      paymentStatus === "PENDING"
    ) {
      reservation.paymentStatus =
        "pending";

      await reservation.save();

      console.log(
        `AVENOR reservation payment pending: ${orderId}`
      );

      return NextResponse.json({
        received: true,
        processed: true,
        paymentStatus: "pending",
        orderId,
      });
    }

    /*
     * --------------------------------
     * FAILED PAYMENT
     * --------------------------------
     *
     * Cashfree may send other statuses
     * such as FAILED.
     */
    if (
      paymentStatus === "FAILED"
    ) {
      reservation.paymentStatus =
        "failed";

      await reservation.save();

      console.log(
        `AVENOR reservation payment failed: ${orderId}`
      );

      return NextResponse.json({
        received: true,
        processed: true,
        paymentStatus: "failed",
        orderId,
      });
    }

    /*
     * --------------------------------
     * OTHER / UNKNOWN STATUS
     * --------------------------------
     *
     * Don't incorrectly mark an
     * unfamiliar status as failed.
     */
    console.log(
      `Cashfree reservation ${orderId} status: ${paymentStatus}`
    );

    return NextResponse.json({
      received: true,
      processed: false,
      paymentStatus:
        paymentStatus || "unknown",
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
