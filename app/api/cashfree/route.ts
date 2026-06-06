import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const response = await fetch(
      "https://api.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_CLIENT_ID!,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify({
          order_id: `ORDER_${Date.now()}`,
          order_amount: amount,
          order_currency: "INR",
          customer_details: {
            customer_id: `CUST_${Date.now()}`,
            customer_name: "Avenor Customer",
            customer_email: "customer@example.com",
            customer_phone: "9999999999",
          },
        }),
      }
    );

    const data = await response.json();

    console.log("Cashfree Status:", response.status);
    console.log("Cashfree Response:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || "Cashfree API Error",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      cf_order_id: data.cf_order_id,
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
    });
  } catch (err) {
    console.error("Cashfree order error:", err);

    return NextResponse.json(
      {
        error: "Order creation failed",
      },
      {
        status: 500,
      }
    );
  }
}