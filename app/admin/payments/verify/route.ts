
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import PaymentCounterOrder from "@/models/PaymentCounterOrder";
import { sendPaymentCounterEmail } from "@/lib/mailer";

export const runtime = "nodejs";

export async function GET(req: Request) {
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

    // GET ORDER ID
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId || !orderId.startsWith("AVENOR_EXH_")) {
      return NextResponse.json(
        { success: false, error: "Invalid exhibition order reference." },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await PaymentCounterOrder.findOne({
      cashfreeOrderId: orderId,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Exhibition order not found." },
        { status: 404 }
      );
    }

    // CASHFREE CONFIGURATION
    const mode =
      process.env.CASHFREE_MODE === "sandbox"
        ? "sandbox"
        : "production";

    const baseUrl =
      mode === "sandbox"
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

    // VERIFY PAYMENT DIRECTLY WITH CASHFREE
    const cashfreeResponse = await fetch(
      `${baseUrl}/orders/${encodeURIComponent(orderId)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-client-id": clientId,
          "x-client-secret": clientSecret,
          "x-api-version": "2023-08-01",
        },
        cache: "no-store",
      }
    );

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error("Cashfree verification failed:", cashfreeData);

      return NextResponse.json(
        { success: false, error: "Unable to verify payment with Cashfree." },
        { status: 502 }
      );
    }

    const cashfreeAmount = Number(cashfreeData.order_amount);
    const expectedAmount = Number(order.amount);

    // VERIFY AMOUNT AS WELL AS PAYMENT STATUS
    if (
      cashfreeData.order_status !== "PAID" ||
      !Number.isFinite(cashfreeAmount) ||
      cashfreeAmount !== expectedAmount
    ) {
      return NextResponse.json({
        success: true,
        paid: false,
        paymentStatus: cashfreeData.order_status || "PENDING",
        message: "Cashfree has not confirmed the expected payment amount.",
      });
    }

    // MARK THE ORDER AS PAID
    await PaymentCounterOrder.updateOne(
      {
        _id: order._id,
        paymentStatus: { $ne: "PAID" },
      },
      {
        $set: {
          paymentStatus: "PAID",
          paidAt: new Date(),
        },
      }
    );

    // CLAIM THE EMAIL NOTIFICATION
    // Only one request can change PENDING/FAILED to SENDING.
    const emailClaim = await PaymentCounterOrder.findOneAndUpdate(
      {
        _id: order._id,
        emailStatus: { $in: ["PENDING", "FAILED"] },
      },
      {
        $set: { emailStatus: "SENDING" },
      },
      { new: true }
    );

    if (emailClaim) {
      try {
        if (!process.env.ADMIN_EMAIL) {
          throw new Error("ADMIN_EMAIL is not configured.");
        }

        await sendPaymentCounterEmail({
          customerName: emailClaim.customerName,
          customerPhone: emailClaim.customerPhone,
          items: emailClaim.items.map((item: {
            productName: string;
            quantity: number;
            unitPrice: number;
          }) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          total: emailClaim.amount,
          paymentReference: orderId,
        });

        await PaymentCounterOrder.updateOne(
          { _id: order._id, emailStatus: "SENDING" },
          { $set: { emailStatus: "SENT" } }
        );
      } catch (emailError) {
        console.error("Exhibition notification email failed:", emailError);

        await PaymentCounterOrder.updateOne(
          { _id: order._id, emailStatus: "SENDING" },
          { $set: { emailStatus: "FAILED" } }
        );
      }
    }

    const updatedOrder = await PaymentCounterOrder.findById(order._id)
      .select("cashfreeOrderId amount paymentStatus emailStatus paidAt")
      .lean();

    return NextResponse.json({
      success: true,
      paid: true,
      order: updatedOrder,
      message:
        updatedOrder?.emailStatus === "SENT"
          ? "Payment verified. Admin notification sent."
          : "Payment verified. Email notification is pending or needs retry.",
    });
  } catch (error) {
    console.error("Exhibition payment verification error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to verify exhibition payment." },
      { status: 500 }
    );
  }
}
