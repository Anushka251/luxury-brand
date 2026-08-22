import { NextResponse } from "next/server";

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
     * NEVER take the reservation fee
     * from the browser.
     *
     * The server fixes it at ₹2,000.
     */

    const amount = 2000;

    const orderId =
      `AVENOR_RES_${Date.now()}`;

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
     * We return the payment session
     * to the browser.
     *
     * MongoDB reservation is NOT created yet.
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
      "Cashfree order error:",
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
