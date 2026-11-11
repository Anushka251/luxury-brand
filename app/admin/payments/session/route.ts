
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { products } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Verify admin
    const session = await getServerSession(authOptions);

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const loggedInEmail = session?.user?.email?.trim().toLowerCase();

    if (!adminEmail || loggedInEmail !== adminEmail) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Cashfree credentials are missing." },
        { status: 500 }
      );
    }

    const mode = (
      process.env.CASHFREE_MODE ||
      process.env.NEXT_PUBLIC_CASHFREE_MODE ||
      "production"
    ).toLowerCase();

    const sandbox = mode === "sandbox" || mode === "test";

    const baseUrl = sandbox
      ? "https://sandbox.cashfree.com/pg"
      : "https://api.cashfree.com/pg";

    const body = await req.json();

    const customerName = String(body.customerName || "").trim();
    const customerPhone = String(body.customerPhone || "").trim();

    if (!customerName || customerName.length > 100) {
      return NextResponse.json(
        { error: "Enter a valid customer name." },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(customerPhone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      body.items.length > products.length
    ) {
      return NextResponse.json(
        { error: "Select at least one valid product." },
        { status: 400 }
      );
    }

    // Calculate amount using trusted server-side prices
    let amount = 0;
    const seen = new Set<string>();

    for (const item of body.items) {
      const productId = String(item.productId || "");
      const quantity = Number(item.quantity);

      if (
        seen.has(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
      ) {
        return NextResponse.json(
          { error: "Invalid product quantity." },
          { status: 400 }
        );
      }

      seen.add(productId);

      const product = products.find((p) => p.id === productId);

      if (!product) {
        return NextResponse.json(
          { error: "Invalid product selected." },
          { status: 400 }
        );
      }

      amount += product.price * quantity;
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const orderId =
      `AVENOR_EXH_${Date.now()}_${randomUUID().replace(/-/g, "").slice(0, 8)}`;

    const siteUrl = "https://avenorcollection.com";

    // Create Cashfree order
    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": "2023-08-01",
        "x-idempotency-key": randomUUID(),
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: `AVENOR_${customerPhone}`,
          customer_name: customerName,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${siteUrl}/admin/payments?order_id=${orderId}`,
        },
        order_note: "AVENOR Exhibition Purchase",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      console.error("Exhibition Cashfree error:", data);

      return NextResponse.json(
        {
          error:
            data.message ||
            data.type ||
            "Cashfree could not create the payment session.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: orderId,
      payment_session_id: data.payment_session_id,
      amount,
    });
  } catch (error) {
    console.error("Exhibition payment API error:", error);

    return NextResponse.json(
      { error: "Unable to create payment session." },
      { status: 500 }
    );
  }
}
