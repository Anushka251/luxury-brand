import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      product,
      fullName,
      email,
      instagram,
      phone,
      fitPreference,
      standardSize,
      occasion,
      notes,
    } = body;

    /*
     * ==========================================
     * VALIDATION
     * ==========================================
     */

    if (
      !product ||
      typeof product !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Product is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !fullName ||
      typeof fullName !== "string" ||
      !email ||
      typeof email !== "string" ||
      !phone ||
      typeof phone !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email and phone are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      fitPreference !== "custom" &&
      fitPreference !== "standard"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid fit preference.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      fitPreference === "standard" &&
      !standardSize
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a standard size.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * NORMALIZE CUSTOMER DATA
     * ==========================================
     */

    const customerEmail =
      email.trim().toLowerCase();

    const customerName =
      fullName.trim();

    const customerPhone =
      phone.trim();

    /*
     * ==========================================
     * RESERVATION AMOUNT
     * ==========================================
     *
     * TEST MODE:
     *
     * AVENOR_RESERVATION_TEST_MODE=true
     *     → ₹1
     *
     * PRODUCTION:
     *
     * AVENOR_RESERVATION_TEST_MODE=false
     *     → ₹2,000
     */

    const isTestMode =
      process.env
        .AVENOR_RESERVATION_TEST_MODE ===
      "true";

    const amount =
      isTestMode ? 1 : 2000;

    /*
     * ==========================================
     * CREATE UNIQUE AVENOR ORDER ID
     * ==========================================
     */

    const orderId =
      `AVENOR_RES_${Date.now()}`;

    /*
     * ==========================================
     * CREATE CASHFREE ORDER
     * ==========================================
     */

    const cashfreeResponse =
      await fetch(
        "https://api.cashfree.com/pg/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

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

          body: JSON.stringify({
            order_id: orderId,

            order_amount: amount,

            order_currency: "INR",

            order_note:
              `AVENOR Studio Reservation - ${product}`,

            order_meta: {
              return_url:
                `https://avenorcollection.com/reserve/payment-success?order_id={order_id}`,

              notify_url:
                "https://avenorcollection.com/api/cashfree/webhook",
            },

            customer_details: {
              customer_id:
                `CUST_${Date.now()}`,

              customer_name:
                customerName,

              customer_email:
                customerEmail,

              customer_phone:
                customerPhone,
            },
          }),
        }
      );

    const data =
      await cashfreeResponse.json();

    console.log(
      "Cashfree Status:",
      cashfreeResponse.status
    );

    console.log(
      "Cashfree Response:",
      data
    );

    /*
     * ==========================================
     * CASHFREE ERROR
     * ==========================================
     */

    if (!cashfreeResponse.ok) {
      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.error ||
            "Cashfree API Error",

          details: data,
        },
        {
          status:
            cashfreeResponse.status,
        }
      );
    }

    /*
     * ==========================================
     * VERIFY PAYMENT SESSION
     * ==========================================
     */

    if (
      !data?.payment_session_id
    ) {
      return NextResponse.json(
        {
          error:
            "Cashfree payment session was not created.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================
     * SAVE PENDING RESERVATION
     * ==========================================
     *
     * IMPORTANT:
     *
     * This creates the reservation BEFORE
     * the customer completes payment.
     *
     * /api/reserve/confirm later changes
     * paymentStatus from "pending"
     * to "success".
     */

    await connectDB();

    const reservation =
      await Reservation.create({
        product,

        fullName:
          customerName,

        email:
          customerEmail,

        instagram:
          instagram?.trim() || "",

        phone:
          customerPhone,

        fitPreference,

        standardSize:
          standardSize || "",

        occasion:
          occasion?.trim() || "",

        notes:
          notes?.trim() || "",

        cashfreeOrderId:
          data.order_id,

        reservationFee:
          amount,

        paymentStatus:
          "pending",

        status:
          "pending",
      });

    console.log(
      "AVENOR reservation created:",
      reservation._id.toString()
    );

    console.log(
      "AVENOR reservation order:",
      data.order_id
    );

    /*
     * ==========================================
     * RETURN PAYMENT SESSION
     * ==========================================
     */

    return NextResponse.json({
      success: true,

      order_id:
        data.order_id,

      cf_order_id:
        data.cf_order_id,

      payment_session_id:
        data.payment_session_id,

      reservation_id:
        reservation._id.toString(),

      amount,

      testMode:
        isTestMode,
    });
  } catch (error) {
    console.error(
      "Cashfree reservation order error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create payment order.",
      },
      {
        status: 500,
      }
    );
  }
}
