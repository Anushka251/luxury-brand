import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const reservation = await Reservation.create({
      product: body.product,
      fullName: body.fullName,
      email: body.email,
      instagram: body.instagram,
      phone: body.phone,
      fitPreference: body.fitPreference,
      standardSize: body.standardSize || "",
      occasion: body.occasion || "",
      notes: body.notes || "",
    });

    return NextResponse.json(
      {
        success: true,
        reservation,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create reservation.",
      },
      {
        status: 500,
      }
    );
  }
}
