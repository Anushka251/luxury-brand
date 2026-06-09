import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },

    cashfreeOrderId: String,

    customerEmail: String,
    customerName: String,
    customerPhone: String,

    shippingAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },

    items: [
      {
        id: String,
        slug: String,
        name: String,
        image: String,
        size: String,
        quantity: Number,
        price: Number,
      },
    ],

    total: Number,

    paymentStatus: {
      type: String,
      default: "PAID",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
