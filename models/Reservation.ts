import mongoose, { Schema, models, model } from "mongoose";

const ReservationSchema = new Schema(
  {
    product: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    instagram: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    fitPreference: {
      type: String,
      enum: ["custom", "standard"],
      required: true,
    },

    standardSize: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", ""],
      default: "",
    },

    occasion: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "contacted", "allocated", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Reservation ||
  model("Reservation", ReservationSchema);
