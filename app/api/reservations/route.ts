import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

export async function GET(req: Request) {
  try {
    const { searchParams } =
      new URL(req.url);

    const email =
      searchParams.get("email");

    /*
     * =========================================================
     * VALIDATE EMAIL
     * =========================================================
     */

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

    const normalizedEmail =
      email.trim().toLowerCase();

    /*
     * =========================================================
     * CONNECT DATABASE
     * =========================================================
     */

    await connectDB();

    /*
     * =========================================================
     * GET RESERVATIONS
     * =========================================================
     *
     * The complete reservation document is returned.
     *
     * This includes:
     *
     * paymentStatus
     * status
     * product
     * reservationFee
     * cashfreeOrderId
     * email
     * fullName
     * etc.
     */

    const reservations =
      await Reservation.find({
        email: normalizedEmail,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    /*
     * =========================================================
     * RESPONSE
     * =========================================================
     */

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
