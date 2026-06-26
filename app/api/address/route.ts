import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Address from "@/models/Address";

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

    const addresses = await Address.find({
      customerEmail: email,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error(
      "Fetch addresses error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch addresses",
      },
      {
        status: 500,
      }
    );
  }
}
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.customerEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer email is required",
        },
        {
          status: 400,
        }
      );
    }

    const address = await Address.create({
      customerEmail: body.customerEmail,

      name: body.name,
      phone: body.phone,
      address: body.address,
      landmark: body.landmark || "",
      city: body.city,
      state: body.state,
      pincode: body.pincode,
    });

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error(
      "Save address error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save address",
      },
      {
        status: 500,
      }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Address ID is required",
        },
        {
          status: 400,
        }
      );
    }

    await Address.findByIdAndDelete(body.id);

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete address error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete address",
      },
      {
        status: 500,
      }
    );
  }
}
