import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const order = await Order.create({
      orderNumber: body.orderNumber,
      cashfreeOrderId: body.cashfreeOrderId,

      customerEmail: body.customerEmail,
      customerName: body.customerName,
      customerPhone: body.customerPhone,

      shippingAddress: body.shippingAddress,

      items: body.items,

      total: body.total,

      paymentStatus: "PAID",
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}