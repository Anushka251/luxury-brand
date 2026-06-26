import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Address from "@/models/Address";

// GET
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const email =
      req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email is required.",
      });
    }

    const addresses = await Address.find({
      email,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Failed to load addresses.",
    });
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    await Address.create(body);

    const addresses = await Address.find({
      email: body.email,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Failed to save address.",
    });
  }
}

// DELETE
export async function DELETE(
  req: NextRequest
) {
  try {
    await connectDB();

    const { id } = await req.json();

    const address =
      await Address.findById(id);

    if (!address) {
      return NextResponse.json({
        success: false,
        message: "Address not found.",
      });
    }

    const email = address.email;

    await Address.findByIdAndDelete(id);

    const addresses = await Address.find({
      email,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Failed to delete address.",
    });
  }
}
