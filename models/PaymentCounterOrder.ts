
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
    linkId: {
      type: String,
      required: true,
      unique: true,
    },
    cashfreeLinkId: {
      type: String,
      default: "",
    },
    paymentUrl: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "EXPIRED"],
      default: "PENDING",
    },
    emailStatus: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
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
