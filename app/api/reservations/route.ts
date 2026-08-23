import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

export async function GET(req: Request) {
  try {
    const { searchParams } =
      new URL(req.url);

    const email =
      searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const reservations =
      await Reservation.find({
        email: email.toLowerCase(),
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.error(
      "Reservations API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load reservations.",
      },
      {
        status: 500,
      }
    );
  }
}
