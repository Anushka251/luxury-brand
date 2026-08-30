import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  sendOrderConfirmationEmail,
} from "@/lib/mailer";

/*
 * =========================================================
 * CREATE / SAVE ORDER
 * =========================================================
 *
 * This endpoint saves the ACTUAL GARMENT PURCHASE
 * in MongoDB.
 *
 * It is NOT the ₹2,000 reservation.
 *
 * Reservation:
 *   Reservation model
 *
 * Actual garment purchase:
 *   Order model
 *
 * IMPORTANT:
 * The payment should already have been verified
 * before creating the order.
 */

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    /*
     * =======================================================
     * VALIDATE REQUIRED INFORMATION
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
        : "";

    const customerPhone =
      typeof body.customerPhone === "string"
        ? body.customerPhone.trim()
        : "";

    /*
     * =======================================================
     * PREVENT DUPLICATE ORDERS
     * =======================================================
     *
     * If the same Cashfree order has already been
     * successfully saved, return the existing order.
     */

    if (
      body.cashfreeOrderId &&
      typeof body.cashfreeOrderId === "string"
    ) {
      const existingOrder =
        await Order.findOne({
          cashfreeOrderId:
            body.cashfreeOrderId,
        });

      if (existingOrder) {
        return NextResponse.json({
          success: true,
          order: existingOrder,
          alreadyExists: true,
          message:
            "Order already exists.",
        });
      }
    }

    /*
     * =======================================================
     * CREATE ORDER
     * =======================================================
     *
     * This represents the ACTUAL PRODUCT PURCHASE.
     */

    const order =
      await Order.create({
        orderNumber:
          body.orderNumber.trim(),

        /*
         * Cashfree ID is optional because
         * the database should not crash if
         * an order was created through another
         * payment method in the future.
         */

        cashfreeOrderId:
          body.cashfreeOrderId || "",

        customerEmail,

        customerName,

        customerPhone,

        shippingAddress:
          body.shippingAddress,

        items:
          body.items,

        total:
          Number(body.total) || 0,

        /*
         * IMPORTANT:
         *
         * This endpoint should normally only be
         * called AFTER payment has been verified.
         *
         * Defaulting to PAID keeps compatibility
         * with your existing checkout flow.
         */

        paymentStatus:
          body.paymentStatus ||
          "PAID",
      });

    /*
     * =======================================================
     * SEND ORDER CONFIRMATION EMAIL
     * =======================================================
     *
     * Email failure must NOT delete the order.
     */

    try {
      await sendOrderConfirmationEmail({
        customerEmail,

        customerName:
          customerName ||
          "Customer",

        orderNumber:
          order.orderNumber,

        items:
          body.items || [],

        total:
          Number(body.total) || 0,
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
     * RETURN CREATED ORDER
     * =======================================================
     */

    return NextResponse.json(
      {
        success: true,
        order,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Order save error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to save order.",
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
 *
 * to retrieve the customer's actual purchases.
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
