import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      product,
      fullName,
      email,
      instagram,
      phone,
      fitPreference,
      standardSize,
      occasion,
      notes,
    } = body;

    /*
     * =========================================================
     * VALIDATION
     * =========================================================
     */

    if (
      !product ||
      typeof product !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Product is required.",
        },
        { status: 400 }
      );
    }

    if (
      !fullName ||
      typeof fullName !== "string" ||
      !email ||
      typeof email !== "string" ||
      !phone ||
      typeof phone !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, email and phone are required.",
        },
        { status: 400 }
      );
    }

    if (
      fitPreference !== "custom" &&
      fitPreference !== "standard"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid fit preference.",
        },
        { status: 400 }
      );
    }

    if (
      fitPreference === "standard" &&
      !standardSize
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select a standard size.",
        },
        { status: 400 }
      );
    }

    /*
     * =========================================================
     * CUSTOMER INFORMATION
     * =========================================================
     */

    const customerName =
      fullName.trim();

    const customerEmail =
      email.trim().toLowerCase();

    const customerPhone =
      phone.trim();

    /*
     * =========================================================
     * CASHFREE MODE
     * =========================================================
     */

    const cashfreeMode =
      process.env.CASHFREE_MODE ===
      "sandbox"
        ? "sandbox"
        : "production";

    const cashfreeBaseUrl =
      cashfreeMode === "sandbox"
        ? "https://sandbox.cashfree.com/pg"
        : "https://api.cashfree.com/pg";

    /*
     * =========================================================
     * CASHFREE CREDENTIAL CHECK
     * =========================================================
     */

    if (
      !process.env.CASHFREE_CLIENT_ID ||
      !process.env.CASHFREE_CLIENT_SECRET
    ) {
      console.error(
        "Cashfree credentials are missing."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Cashfree configuration is incomplete.",
        },
        { status: 500 }
      );
    }

    /*
     * =========================================================
     * RESERVATION FEE
     * =========================================================
     */

    const reservationFee = 500;

    /*
     * =========================================================
     * UNIQUE ORDER ID
     * =========================================================
     */

    const orderId =
      `AVENOR_RES_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    /*
     * =========================================================
     * CREATE CASHFREE ORDER
     * =========================================================
     */

    const cashfreeResponse =
      await fetch(
        `${cashfreeBaseUrl}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            "x-client-id":
              process.env
                .CASHFREE_CLIENT_ID,

            "x-client-secret":
              process.env
                .CASHFREE_CLIENT_SECRET,

            "x-api-version":
              "2023-08-01",
          },

          body: JSON.stringify({
            order_id: orderId,

            order_amount:
              reservationFee,

            order_currency:
              "INR",

            order_note:
              `AVENOR Private Access Reservation - ${product}`,

            order_meta: {
              return_url:
                `https://avenorcollection.com/reserve/payment-success?order_id={order_id}`,

              notify_url:
                "https://avenorcollection.com/api/cashfree/webhook",
            },

            customer_details: {
              customer_id:
                `CUST_${Date.now()}`,

              customer_name:
                customerName,

              customer_email:
                customerEmail,

              customer_phone:
                customerPhone,
            },
          }),
        }
      );

    const cashfreeData =
      await cashfreeResponse.json();

    console.log(
      "Cashfree order response:",
      cashfreeData
    );

    /*
     * =========================================================
     * CASHFREE ERROR
     * =========================================================
     */

    if (!cashfreeResponse.ok) {
      console.error(
        "Cashfree order creation failed:",
        cashfreeData
      );

      return NextResponse.json(
        {
          success: false,

          error:
            cashfreeData?.message ||
            cashfreeData?.error ||
            "Unable to create Cashfree payment.",

          details:
            cashfreeData,
        },
        {
          status:
            cashfreeResponse.status,
        }
      );
    }

    /*
     * =========================================================
     * PAYMENT SESSION CHECK
     * =========================================================
     */

    if (
      !cashfreeData?.payment_session_id
    ) {
      console.error(
        "Cashfree response missing payment_session_id:",
        cashfreeData
      );

      return NextResponse.json(
        {
          success: false,

          error:
            "Cashfree payment session was not created.",

          details:
            cashfreeData,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =========================================================
     * DATABASE
     * =========================================================
     */

    await connectDB();

    /*
     * =========================================================
     * CREATE PENDING RESERVATION
     * =========================================================
     */

    const reservation =
      await Reservation.create({

        product:
          product.trim(),

        fullName:
          customerName,

        email:
          customerEmail,

        instagram:
          instagram?.trim() || "",

        phone:
          customerPhone,

        fitPreference,

        standardSize:
          standardSize || "",

        occasion:
          occasion?.trim() || "",

        notes:
          notes?.trim() || "",

        cashfreeOrderId:
          cashfreeData.order_id,

        reservationFee,

        paymentStatus:
          "pending",

        status:
          "pending",

        orderNumber:
          "",

        refundStatus:
          "not_required",

        refundAmount:
          0,

        refundedAt:
          null,

        confirmationEmailSent:
          false,

        confirmationEmailSentAt:
          null,
      });

    console.log(
      "AVENOR reservation created:",
      reservation._id.toString()
    );

    /*
     * =========================================================
     * RETURN PAYMENT INFORMATION
     * =========================================================
     */

    return NextResponse.json({

      success: true,

      order_id:
        cashfreeData.order_id,

      cf_order_id:
        cashfreeData.cf_order_id,

      payment_session_id:
        cashfreeData.payment_session_id,

      reservation_id:
        reservation._id.toString(),

      amount:
        reservationFee,

      cashfreeMode,
    });

  } catch (error) {

    console.error(
      "Reservation creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Unable to create reservation.",
      },
      {
        status: 500,
      }
    );
  }
}
