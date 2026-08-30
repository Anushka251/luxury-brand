import { NextResponse } from "next/server";

/*
 * =========================================================
 * VERIFY ACTUAL PRODUCT PAYMENT
 * =========================================================
 *
 * This endpoint verifies an ACTUAL GARMENT PURCHASE
 * with Cashfree.
 *
 * It is NOT used for the ₹2,000 reservation.
 *
 * Reservation payment:
 *
 * /api/reserve/confirm
 *
 * Product payment:
 *
 * /api/verify-order
 */

export async function GET(req: Request) {
  try {
    /*
     * =======================================================
     * GET ORDER ID
     * =======================================================
     */

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
     * =======================================================
     * PREVENT RESERVATION ORDER FROM BEING VERIFIED HERE
     * =======================================================
     *
     * Reservation orders look like:
     *
     * AVENOR_RES_xxxxx
     *
     * They must be verified by:
     *
     * /api/reserve/confirm
     *
     * This endpoint is for actual garment orders.
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
            "Reservation orders must be verified through /api/reserve/confirm.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * CASHFREE CONFIGURATION
     * =======================================================
     */

    const clientId =
      process.env
        .CASHFREE_CLIENT_ID;

    const clientSecret =
      process.env
        .CASHFREE_CLIENT_SECRET;

    if (
      !clientId ||
      !clientSecret
    ) {
      console.error(
        "Cashfree environment variables are missing."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment gateway configuration is missing.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =======================================================
     * ASK CASHFREE FOR ORDER DETAILS
     * =======================================================
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

    /*
     * =======================================================
     * READ CASHFREE RESPONSE
     * =======================================================
     */

    const data =
      await response.json();

    console.log(
      "Cashfree product order verification:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    /*
     * =======================================================
     * CASHFREE ERROR
     * =======================================================
     */

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,

          error:
            data?.message ||
            data?.error ||
            "Unable to verify order.",

          order_id:
            orderId,
        },
        {
          status:
            response.status,
        }
      );
    }

    /*
     * =======================================================
     * RETURN VERIFIED ORDER INFORMATION
     * =======================================================
     */

    return NextResponse.json({
      success: true,

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

      order_meta:
        data?.order_meta,
    });
  } catch (error) {
    console.error(
      "Verify product order error:",
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
