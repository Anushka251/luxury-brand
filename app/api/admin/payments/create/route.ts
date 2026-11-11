
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { products } from "@/lib/products";
import PaymentCounterOrder from "@/models/PaymentCounterOrder";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1. Verify admin session
    const session = await getServerSession(authOptions);

    const adminEmail = process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

    const loggedInEmail = session?.user?.email
      ?.trim()
      .toLowerCase();

    if (
      !adminEmail ||
      !loggedInEmail ||
      loggedInEmail !== adminEmail
    ) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    // 2. Check Cashfree credentials
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

    const baseUrl =
      mode === "sandbox" || mode === "test"
        ? "https://sandbox.cashfree.com/pg"
        : "https://api.cashfree.com/pg";

    // 3. Read request
    const body = await req.json();

    const customerName = String(
      body.customerName || ""
    ).trim();

    const customerPhone = String(
      body.customerPhone || ""
    ).trim();

    const requestedItems = body.items;

    if (!customerName || customerName.length > 100) {
      return NextResponse.json(
        { error: "Enter a valid customer name." },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(customerPhone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(requestedItems) ||
      requestedItems.length === 0 ||
      requestedItems.length > products.length
    ) {
      return NextResponse.json(
        { error: "Select valid products." },
        { status: 400 }
      );
    }

    // 4. Calculate amount using server-side catalogue prices
    const items = [];
    let amount = 0;

    const seen = new Set<string>();

    for (const item of requestedItems) {
      const productId = String(item.productId || "");
      const quantity = Number(item.quantity);

      if (
        seen.has(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
      ) {
        return NextResponse.json(
          { error: "Invalid product or quantity." },
          { status: 400 }
        );
      }

      seen.add(productId);

      const product = products.find(
        (p) => p.id === productId
      );

      if (!product) {
        return NextResponse.json(
          { error: "Unknown product selected." },
          { status: 400 }
        );
      }

      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
      });

      amount += product.price * quantity;
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    // 5. Generate unique payment link ID
    const linkId =
      `AVENOR-${Date.now()}-${randomUUID()
        .replace(/-/g, "")
        .slice(0, 8)}`;

    // 6. Create Cashfree Payment Link
    const cashfreeResponse = await fetch(
      `${baseUrl}/links`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": clientId,
          "x-client-secret": clientSecret,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify({
          link_id: linkId,
          link_amount: amount,
          link_currency: "INR",
          link_purpose: `AVENOR Exhibition - ${customerName}`,
          customer_details: {
            customer_name: customerName,
            customer_phone: customerPhone,
          },
          link_notify: {
            send_sms: false,
            send_email: false,
          },
        }),
      }
    );

    const cashfreeData = await cashfreeResponse.json();

    if (
      !cashfreeResponse.ok ||
      !cashfreeData.link_url ||
      !cashfreeData.link_id
    ) {
      console.error(
        "Cashfree link creation failed:",
        cashfreeData
      );

      return NextResponse.json(
        {
          error:
            cashfreeData.message ||
            cashfreeData.type ||
            "Cashfree could not create the payment link.",
        },
        { status: 502 }
      );
    }

    // 7. Save payment record
    await connectDB();

    await PaymentCounterOrder.create({
      customerName,
      customerPhone,
      items,
      amount,
      linkId,
      cashfreeLinkId: String(
        cashfreeData.cf_link_id || ""
      ),
      paymentUrl: cashfreeData.link_url,
      paymentStatus: "PENDING",
      emailStatus: "PENDING",
    });

    // 8. Return QR link to frontend
    return NextResponse.json({
      success: true,
      payment_link_url: cashfreeData.link_url,
      payment_link_id: cashfreeData.link_id,
      amount,
    });

  } catch (error) {
    console.error(
      "AVENOR payment creation error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to generate payment link." },
      { status: 500 }
    );
  }
}
