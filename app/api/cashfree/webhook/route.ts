import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

/*
 * =========================================================
 * AVENOR — CASHFREE WEBHOOK
 * =========================================================
 *
 * This webhook handles ONLY reservation payments.
 *
 * Flow:
 *
 * Customer pays ₹2,000
 *        ↓
 * Cashfree sends webhook
 *        ↓
 * Verify webhook signature
 *        ↓
 * Find Reservation
 *        ↓
 * Verify payment amount
 *        ↓
 * paymentStatus = confirmed
 * status = confirmed
 *        ↓
 * PRIVATE ACCESS GRANTED
 *
 * Actual product purchases are handled separately
 * through the normal Order system.
 */


/*
 * =========================================================
 * GET — HEALTH CHECK
 * =========================================================
 */

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "AVENOR Cashfree Reservation Webhook",
  });
}


/*
 * =========================================================
 * POST — CASHFREE WEBHOOK
 * =========================================================
 */

export async function POST(req: Request) {
  try {
    /*
     * =======================================================
     * 1. GET CASHFREE SIGNATURE HEADERS
     * =======================================================
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
          received: false,
          error:
            "Missing webhook signature.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * =======================================================
     * 2. READ RAW BODY
     * =======================================================
     *
     * IMPORTANT:
     *
     * Do NOT use req.json() before verifying
     * the signature.
     *
     * Cashfree signs:
     *
     * timestamp + rawBody
     */

    const rawBody =
      await req.text();


    /*
     * =======================================================
     * 3. CREATE EXPECTED SIGNATURE
     * =======================================================
     */

    const clientSecret =
      process.env
        .CASHFREE_CLIENT_SECRET;

    if (!clientSecret) {
      console.error(
        "CASHFREE_CLIENT_SECRET is missing."
      );

      return NextResponse.json(
        {
          received: false,
          error:
            "Cashfree configuration is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const signedPayload =
      timestamp + rawBody;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          clientSecret
        )
        .update(signedPayload)
        .digest("base64");


    /*
     * =======================================================
     * 4. SAFELY COMPARE SIGNATURES
     * =======================================================
     */

    const signatureBuffer =
      Buffer.from(signature);

    const expectedBuffer =
      Buffer.from(
        expectedSignature
      );

    if (
      signatureBuffer.length !==
      expectedBuffer.length
    ) {
      console.error(
        "Invalid Cashfree webhook signature."
      );

      return NextResponse.json(
        {
          received: false,
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
          received: false,
          error:
            "Invalid webhook signature.",
        },
        {
          status: 401,
        }
      );
    }


    /*
     * =======================================================
     * 5. PARSE WEBHOOK
     * =======================================================
     */

    let payload: any;

    try {
      payload =
        JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          received: false,
          error:
            "Invalid webhook payload.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "AVENOR Cashfree webhook:",
      JSON.stringify(
        payload,
        null,
        2
      )
    );


    /*
     * =======================================================
     * 6. EXTRACT PAYMENT INFORMATION
     * =======================================================
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
     * =======================================================
     * 7. VALIDATE ORDER ID
     * =======================================================
     */

    if (
      !orderId ||
      typeof orderId !== "string"
    ) {
      return NextResponse.json(
        {
          received: false,
          error:
            "Order ID missing.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * =======================================================
     * 8. ONLY PROCESS AVENOR RESERVATIONS
     * =======================================================
     *
     * Reservation orders always begin with:
     *
     * AVENOR_RES_
     *
     * Normal product purchases are NOT handled here.
     */

    if (
      !orderId.startsWith(
        "AVENOR_RES_"
      )
    ) {
      console.log(
        `Ignoring non-reservation order: ${orderId}`
      );

      return NextResponse.json({
        received: true,
        processed: false,
        reason:
          "Not an AVENOR reservation order.",
      });
    }


    /*
     * =======================================================
     * 9. CONNECT DATABASE
     * =======================================================
     */

    await connectDB();


    /*
     * =======================================================
     * 10. FIND RESERVATION
     * =======================================================
     */

    const reservation =
      await Reservation.findOne({
        cashfreeOrderId:
          orderId,
      });

    /*
     * NEVER create a reservation from
     * an unknown webhook.
     */

    if (!reservation) {
      console.warn(
        `Reservation not found for ${orderId}`
      );

      return NextResponse.json({
        received: true,
        processed: false,
        reason:
          "Reservation not found.",
      });
    }


    /*
     * =======================================================
     * 11. GET EXPECTED AMOUNT FROM DATABASE
     * =======================================================
     *
     * NEVER trust the amount sent by the browser.
     *
     * MongoDB contains the amount that was
     * actually assigned to this reservation.
     *
     * Test:
     * ₹1
     *
     * Production:
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
        {
          orderId,
          reservationFee:
            reservation.reservationFee,
        }
      );

      return NextResponse.json(
        {
          received: false,
          error:
            "Invalid reservation amount.",
        },
        {
          status: 500,
        }
      );
    }


    /*
     * =======================================================
     * 12. SUCCESSFUL PAYMENT
     * =======================================================
     *
     * Cashfree:
     *
     * SUCCESS
     *
     * AND
     *
     * payment amount === reservation fee
     *
     * Then:
     *
     * paymentStatus = confirmed
     * status = confirmed
     *
     * This grants PRIVATE ACCESS.
     */

    if (
      paymentStatus ===
      "SUCCESS"
    ) {

      /*
       * Verify amount.
       */

      if (
        Number(paymentAmount) !==
        expectedAmount
      ) {
        console.error(
          "Reservation payment amount mismatch:",
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
            received: false,
            error:
              "Invalid payment amount.",
          },
          {
            status: 400,
          }
        );
      }


      /*
       * =====================================================
       * IDEMPOTENCY
       * =====================================================
       *
       * Cashfree may send the same webhook
       * more than once.
       *
       * If already confirmed, do nothing.
       */

      if (
        reservation.paymentStatus ===
          "confirmed" &&
        reservation.status ===
          "confirmed"
      ) {
        console.log(
          `Reservation already confirmed: ${orderId}`
        );

        return NextResponse.json({
          received: true,
          processed: true,
          alreadyProcessed: true,
          paymentStatus:
            "confirmed",
          reservationStatus:
            "confirmed",
          privateAccess: true,
          orderId,
        });
      }


      /*
       * =====================================================
       * GRANT PRIVATE ACCESS
       * =====================================================
       */

      reservation.paymentStatus =
        "confirmed";

      reservation.status =
        "confirmed";

      await reservation.save();


      console.log(
        `AVENOR PRIVATE ACCESS CONFIRMED: ${orderId}`
      );


      /*
       * IMPORTANT:
       *
       * Do NOT:
       *
       * - create an Order
       * - mark product as purchased
       * - change collectionPhase
       * - mark sold out
       * - refund anything
       *
       * Those belong to other parts
       * of the application.
       */

      return NextResponse.json({
        received: true,
        processed: true,

        paymentStatus:
          "confirmed",

        reservationStatus:
          "confirmed",

        privateAccess: true,

        orderId,
      });
    }


    /*
     * =======================================================
     * 13. PENDING PAYMENT
     * =======================================================
     */

    if (
      paymentStatus ===
      "PENDING"
    ) {

      /*
       * Do not grant private access.
       */

      reservation.paymentStatus =
        "pending";

      reservation.status =
        "pending";

      await reservation.save();

      console.log(
        `AVENOR reservation payment pending: ${orderId}`
      );

      return NextResponse.json({
        received: true,
        processed: true,

        paymentStatus:
          "pending",

        reservationStatus:
          "pending",

        privateAccess: false,

        orderId,
      });
    }


    /*
     * =======================================================
     * 14. FAILED PAYMENT
     * =======================================================
     *
     * The reservation remains pending.
     *
     * The customer has NOT received
     * private access.
     *
     * They may attempt payment again.
     */

    if (
      paymentStatus ===
      "FAILED"
    ) {

      reservation.paymentStatus =
        "pending";

      reservation.status =
        "pending";

      await reservation.save();

      console.log(
        `AVENOR reservation payment failed: ${orderId}`
      );

      return NextResponse.json({
        received: true,
        processed: true,

        paymentStatus:
          "pending",

        reservationStatus:
          "pending",

        privateAccess: false,

        orderId,
      });
    }


    /*
     * =======================================================
     * 15. UNKNOWN STATUS
     * =======================================================
     *
     * Never assume an unfamiliar Cashfree
     * status means failure.
     */

    console.log(
      `AVENOR reservation ${orderId} received status: ${paymentStatus}`
    );

    return NextResponse.json({
      received: true,
      processed: false,

      paymentStatus:
        paymentStatus ||
        "unknown",

      orderId,
    });

  } catch (error) {

    console.error(
      "AVENOR Cashfree webhook error:",
      error
    );

    /*
     * Returning 500 allows Cashfree to retry
     * the webhook if appropriate.
     */

    return NextResponse.json(
      {
        received: false,
        error:
          "Webhook processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}
