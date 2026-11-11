
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import PaymentCounterOrder from "@/models/PaymentCounterOrder";
import { products } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // ADMIN AUTHENTICATION
    const session = await getServerSession(authOptions);

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const loggedInEmail = session?.user?.email?.trim().toLowerCase();

    if (!adminEmail || loggedInEmail !== adminEmail) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    // CUSTOMER DETAILS AND ITEMS
    const body = await req.json();
    const customerName =
      typeof body.customerName === "string"
        ? body.customerName.trim()
        : "";

    const customerPhone =
      typeof body.customerPhone === "string"
        ? body.customerPhone.trim()
        : "";

    const requestedItems = body.items;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, error: "Customer name and phone are required." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(requestedItems) ||
      requestedItems.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Please select at least one product." },
        { status: 400 }
      );
    }

    // CALCULATE TOTAL USING SERVER-SIDE PRODUCT PRICES
    const items = [];

    for (const item of requestedItems) {
      const product = products.find(
        (p) => p.id === item.productId
      );

      const quantity = Number(item.quantity);

      if (
        !product ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid product or quantity." },
          { status: 400 }
        );
      }

      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
      });
    }

    const amount = items.reduce(
      (total, item) =>
        total + item.quantity * item.unitPrice,
      0
    );

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    // CASHFREE CONFIGURATION
    const cashfreeMode =
      process.env.CASHFREE_MODE === "sandbox"
        ? "sandbox"
        : "production";

    const cashfreeBaseUrl =
      cashfreeMode === "sandbox"
        ? "https://sandbox.cashfree.com/pg"
        : "https://api.cashfree.com/pg";

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, error: "Cashfree configuration is incomplete." },
        { status: 500 }
      );
    }

    // UNIQUE ORDER ID
    const orderId =
      `AVENOR_EXH_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    // SAVE PENDING ORDER BEFORE CREATING PAYMENT SESSION
    await connectDB();

    await PaymentCounterOrder.create({
      customerName,
      customerPhone,
      items,
      amount,
      cashfreeOrderId: orderId,
      paymentStatus: "PENDING",
      emailStatus: "PENDING",
    });

    // CREATE CASHFREE PAYMENT SESSION
    const cashfreeResponse = await fetch(
      `${cashfreeBaseUrl}/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-client-id": clientId,
          "x-client-secret": clientSecret,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: amount,
          order_currency: "INR",
          order_note: `AVENOR Exhibition Purchase - ${customerName}`,
          order_meta: {
            return_url:
              `https://avenorcollection.com/admin/payments?order_id=${orderId}`,
          },
          customer_details: {
            customer_id: `AVENOR_${Date.now()}`,
            customer_name: customerName,
            customer_phone: customerPhone,
          },
        }),
      }
    );

    const cashfreeData = await cashfreeResponse.json();

    if (
      !cashfreeResponse.ok ||
      !cashfreeData?.payment_session_id
    ) {
      console.error("Cashfree session creation failed:", cashfreeData);

      await PaymentCounterOrder.updateOne(
        { cashfreeOrderId: orderId },
        { $set: { paymentStatus: "FAILED" } }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            cashfreeData?.message ||
            cashfreeData?.error ||
            "Unable to create Cashfree payment session.",
        },
        { status: 502 }
      );
    }

    await PaymentCounterOrder.updateOne(
      { cashfreeOrderId: orderId },
      { $set: { cfOrderId: String(cashfreeData.cf_order_id || "") } }
    );

    return NextResponse.json({
      success: true,
      order_id: orderId,
      payment_session_id: cashfreeData.payment_session_id,
      amount,
      cashfreeMode,
    });
  } catch (error) {
    console.error("Exhibition payment session error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to create exhibition payment." },
      { status: 500 }
    );
  }
}
