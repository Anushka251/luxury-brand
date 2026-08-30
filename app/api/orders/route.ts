import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  sendOrderConfirmationEmail,
} from "@/lib/mailer";

/*
 * =========================================================
 * CREATE ACTUAL PRODUCT ORDER
 * =========================================================
 *
 * This is for the ACTUAL GARMENT PURCHASE.
 *
 * It is separate from:
 *
 * /api/reserve/confirm
 *
 * which handles the ₹2,000 reservation.
 *
 * IMPORTANT:
 *
 * The frontend must NOT be trusted to say:
 *
 * paymentStatus: "PAID"
 *
 * The Cashfree order must first be verified
 * through /api/verify-order.
 */

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    /*
     * =======================================================
     * REQUIRED FIELDS
     * =======================================================
     */

    if (
      !body.orderNumber ||
      typeof body.orderNumber !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order number is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body.cashfreeOrderId ||
      typeof body.cashfreeOrderId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cashfree order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body.customerEmail ||
      typeof body.customerEmail !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer email is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order items are required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * RESERVATION ORDERS ARE NOT PRODUCT ORDERS
     * =======================================================
     */

    if (
      body.cashfreeOrderId.startsWith(
        "AVENOR_RES_"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reservation payments cannot be saved as product orders.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * NORMALIZE CUSTOMER DATA
     * =======================================================
     */

    const customerEmail =
      body.customerEmail
        .trim()
        .toLowerCase();

    const customerName =
      typeof body.customerName === "string"
        ? body.customerName.trim()
        : "Customer";

    const customerPhone =
      typeof body.customerPhone === "string"
        ? body.customerPhone.trim()
        : "";

    /*
     * =======================================================
     * VERIFY CASHFREE PAYMENT
     * =======================================================
     *
     * IMPORTANT:
     *
     * We do NOT trust:
     *
     * body.paymentStatus
     *
     * Instead we ask Cashfree directly.
     */

    const clientId =
      process.env.CASHFREE_CLIENT_ID;

    const clientSecret =
      process.env.CASHFREE_CLIENT_SECRET;

    if (
      !clientId ||
      !clientSecret
    ) {
      console.error(
        "Cashfree credentials are missing."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment gateway configuration is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const cashfreeResponse =
      await fetch(
        `https://api.cashfree.com/pg/orders/${encodeURIComponent(
          body.cashfreeOrderId
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

    const cashfreeData =
      await cashfreeResponse.json();

    console.log(
      "Cashfree product order verification:",
      JSON.stringify(
        cashfreeData,
        null,
        2
      )
    );

    /*
     * =======================================================
     * CASHFREE VERIFICATION FAILED
     * =======================================================
     */

    if (!cashfreeResponse.ok) {
      console.error(
        "Cashfree order verification failed:",
        cashfreeData
      );

      return NextResponse.json(
        {
          success: false,
          message:
            cashfreeData?.message ||
            cashfreeData?.error ||
            "Unable to verify payment.",
        },
        {
          status:
            cashfreeResponse.status,
        }
      );
    }

    /*
     * =======================================================
     * PAYMENT MUST BE PAID
     * =======================================================
     *
     * Cashfree order_status must be PAID.
     */

    if (
      cashfreeData?.order_status !==
      "PAID"
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Payment has not been successfully completed.",

          paymentStatus:
            cashfreeData?.order_status ||
            "UNKNOWN",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * VERIFY ORDER AMOUNT
     * =======================================================
     *
     * Never blindly trust the amount sent
     * from the browser.
     *
     * Cashfree's amount is the trusted value.
     */

    const paidAmount =
      Number(
        cashfreeData?.order_amount
      );

    const requestedTotal =
      Number(body.total);

    if (
      !Number.isFinite(
        paidAmount
      ) ||
      !Number.isFinite(
        requestedTotal
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment amount.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      paidAmount !==
      requestedTotal
    ) {
      console.error(
        "Order amount mismatch:",
        {
          orderId:
            body.cashfreeOrderId,

          cashfreeAmount:
            paidAmount,

          requestedAmount:
            requestedTotal,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment amount does not match order amount.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * PREVENT DUPLICATE ORDER
     * =======================================================
     */

    const existingOrder =
      await Order.findOne({
        cashfreeOrderId:
          body.cashfreeOrderId,
      });

    if (existingOrder) {
      return NextResponse.json({
        success: true,

        order:
          existingOrder,

        alreadyExists:
          true,

        paymentStatus:
          "PAID",
      });
    }

    /*
     * =======================================================
     * CREATE ACTUAL ORDER
     * =======================================================
     *
     * At this point:
     *
     * Cashfree says PAID
     * +
     * amount matches
     * +
     * order doesn't already exist
     *
     * Therefore we can create the order.
     */

    const order =
      await Order.create({
        orderNumber:
          body.orderNumber.trim(),

        cashfreeOrderId:
          body.cashfreeOrderId,

        customerEmail,

        customerName,

        customerPhone,

        shippingAddress:
          body.shippingAddress,

        items:
          body.items,

        total:
          paidAmount,

        /*
         * IMPORTANT:
         *
         * This value is determined
         * by the server.
         *
         * The browser cannot change it.
         */

        paymentStatus:
          "PAID",
      });

    console.log(
      `AVENOR product order created: ${order.orderNumber}`
    );

    /*
     * =======================================================
     * SEND ORDER CONFIRMATION EMAIL
     * =======================================================
     *
     * Email failure does NOT undo
     * the successful purchase.
     */

    try {
      await sendOrderConfirmationEmail({
        customerEmail,

        customerName,

        orderNumber:
          order.orderNumber,

        items:
          body.items,

        total:
          paidAmount,
      });

      console.log(
        `Order confirmation email sent: ${order.orderNumber}`
      );
    } catch (emailError) {
      console.error(
        "Order confirmation email failed:",
        emailError
      );
    }

    /*
     * =======================================================
     * RETURN SUCCESS
     * =======================================================
     */

    return NextResponse.json(
      {
        success: true,

        order,

        paymentStatus:
          "PAID",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Order creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create order.",
      },
      {
        status: 500,
      }
    );
  }
}


/*
 * =========================================================
 * GET CUSTOMER ORDERS
 * =========================================================
 *
 * Used by:
 *
 * /account/orders
 */

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const email =
      searchParams.get("email");

    if (
      !email ||
      typeof email !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email is required.",
        },
        {
          status: 400,
        }
      );
    }

    const customerEmail =
      email
        .trim()
        .toLowerCase();

    const orders =
      await Order.find({
        customerEmail,
      }).sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Fetch orders error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch orders.",
      },
      {
        status: 500,
      }
    );
  }
}
