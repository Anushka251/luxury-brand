import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.orderNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Order number is required",
        },
        {
          status: 400,
        }
      );
    }

    const order = await Order.create({
      orderNumber: body.orderNumber,
      cashfreeOrderId: body.cashfreeOrderId,

      customerEmail: body.customerEmail,
      customerName: body.customerName,
      customerPhone: body.customerPhone,

      shippingAddress: body.shippingAddress,

      items: body.items,

      total: body.total,

      paymentStatus: body.paymentStatus || "PAID",
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order save error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save order",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    const orders = await Order.find({
      customerEmail: email,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}
