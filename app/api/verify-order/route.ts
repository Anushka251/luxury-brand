import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } =
      new URL(req.url);

    const orderId =
      searchParams.get("order_id");

    if (
      !orderId ||
      typeof orderId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing order_id.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Reservation payments have their own
     * verification route.
     */

    if (
      orderId.startsWith(
        "AVENOR_RES_"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Reservation payments must be verified using /api/reserve/confirm.",
        },
        {
          status: 400,
        }
      );
    }

    const clientId =
      process.env.CASHFREE_CLIENT_ID;

    const clientSecret =
      process.env.CASHFREE_CLIENT_SECRET;

    if (
      !clientId ||
      !clientSecret
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cashfree configuration is missing.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Ask Cashfree for the actual
     * product order status.
     */

    const response =
      await fetch(
        `https://api.cashfree.com/pg/orders/${encodeURIComponent(
          orderId
        )}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            "x-client-id":
              clientId,

            "x-client-secret":
              clientSecret,

            "x-api-version":
              "2023-08-01",
          },

          cache: "no-store",
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "Cashfree verification error:",
        data
      );

      return NextResponse.json(
        {
          success: false,

          error:
            data?.message ||
            data?.error ||
            "Unable to verify order.",
        },
        {
          status:
            response.status,
        }
      );
    }

    /*
     * Only expose the information
     * required by your frontend.
     */

    return NextResponse.json({
      success: true,

      paid:
        data?.order_status ===
        "PAID",

      order_status:
        data?.order_status,

      order_id:
        data?.order_id,

      cf_order_id:
        data?.cf_order_id,

      order_amount:
        data?.order_amount,

      order_currency:
        data?.order_currency,

      customer_details:
        data?.customer_details,
    });
  } catch (error) {
    console.error(
      "Verify order error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Verification failed.",
      },
      {
        status: 500,
      }
    );
  }
}
