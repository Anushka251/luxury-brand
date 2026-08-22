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
     * Validate required information
     */

    if (!product) {
      return NextResponse.json(
        {
          error: "Product is required.",
        },
        { status: 400 }
      );
    }

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        {
          error:
            "Name, email and phone are required.",
        },
        { status: 400 }
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
        { status: 400 }
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
        { status: 400 }
      );
    }

    /*
     * IMPORTANT:
     *
     * Never trust the amount sent by the browser.
     *
     * The AVENOR reservation fee is fixed
     * on the server at ₹2,000.
     */

    const amount = 2000;

    /*
     * Create a unique Cashfree order ID.
     */

    const orderId =
      `AVENOR_RES_${Date.now()}`;

    /*
     * Create Cashfree order.
     */

    const response = await fetch(
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
              fullName,

            customer_email:
              email,

            customer_phone:
              phone,
          },
        }),
      }
    );

    const data =
      await response.json();

    console.log(
      "Cashfree Status:",
      response.status
    );

    console.log(
      "Cashfree Response:",
      data
    );

    /*
     * If Cashfree failed to create
     * the order, do NOT create a
     * MongoDB reservation.
     */

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.message ||
            data.error ||
            "Cashfree API Error",

          details: data,
        },
        {
          status:
            response.status,
        }
      );
    }

    /*
     * Make sure Cashfree actually
     * returned a payment session.
     */

    if (!data.payment_session_id) {
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
     * Connect to MongoDB.
     */

    await connectDB();

    /*
     * Create a PENDING reservation.
     *
     * The reservation is NOT considered
     * paid yet.
     *
     * The webhook will later change:
     *
     * paymentStatus: "pending"
     *
     * to:
     *
     * paymentStatus: "success"
     */

    await Reservation.create({
      product,

      fullName,

      email,

      instagram:
        instagram || "",

      phone,

      fitPreference,

      standardSize:
        standardSize || "",

      occasion:
        occasion || "",

      notes:
        notes || "",

      cashfreeOrderId:
        data.order_id,

      reservationFee:
        amount,

      paymentStatus:
        "pending",

      status:
        "pending",
    });

    /*
     * Send the Cashfree session
     * back to the browser.
     */

    return NextResponse.json({
      order_id:
        data.order_id,

      cf_order_id:
        data.cf_order_id,

      payment_session_id:
        data.payment_session_id,
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
