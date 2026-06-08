import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing order_id",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `https://api.cashfree.com/pg/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          "x-client-id":
            process.env.CASHFREE_CLIENT_ID!,
          "x-client-secret":
            process.env.CASHFREE_CLIENT_SECRET!,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            data.message ||
            "Unable to verify order",
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json({
      success: true,
      order_status: data.order_status,
      order_id: data.order_id,
      cf_order_id: data.cf_order_id,
      order_amount: data.order_amount,
    });
  } catch (error) {
    console.error(
      "Verify order error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
      },
      {
        status: 500,
      }
    );
  }
}