
import mongoose, { Schema, models, model } from "mongoose";

const PaymentCounterOrderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    cashfreeOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    cfOrderId: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    emailStatus: {
      type: String,
      enum: ["PENDING", "SENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default models.PaymentCounterOrder ||
  model("PaymentCounterOrder", PaymentCounterOrderSchema);
