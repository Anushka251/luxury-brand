import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const latestOrder = await Order.findOne({
      customerEmail: email,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      order: latestOrder,
    });
  } catch (error) {
    console.error(
      "Latest order error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch latest order",
      },
      { status: 500 }
    );
  }
}
