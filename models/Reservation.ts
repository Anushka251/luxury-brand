import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const ReservationSchema = new Schema(
  {
    /*
     * ==========================================
     * PRODUCT
     * ==========================================
     */

    product: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * ==========================================
     * CUSTOMER
     * ==========================================
     */

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
      index: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * ==========================================
     * FIT INFORMATION
     * ==========================================
     */

    fitPreference: {
      type: String,
      enum: ["custom", "standard"],
      required: true,
    },

    standardSize: {
      type: String,
      enum: [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "",
      ],
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

    /*
     * ==========================================
     * CASHFREE
     * ==========================================
     */

    cashfreeOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    /*
     * ==========================================
     * RESERVATION FEE
     * ==========================================
     *
     * Production:
     * ₹2,000
     *
     * Test mode:
     * ₹1
     *
     * The actual amount paid is stored here.
     */

    reservationFee: {
      type: Number,
      required: true,
      default: 2000,
    },

    /*
     * ==========================================
     * PAYMENT STATUS
     * ==========================================
     */

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "success",
        "failed",
      ],
      default: "pending",
      index: true,
    },

    /*
     * ==========================================
     * RESERVATION STATUS
     * ==========================================
     *
     * pending
     * → Reservation/payment has not yet
     *   been successfully completed.
     *
     * confirmed
     * → Customer successfully paid the
     *   reservation fee.
     * → Customer has PRIVATE ACCESS.
     *
     * purchased
     * → Customer used their private access
     *   and purchased the piece.
     *
     * refunded
     * → Customer's private opportunity ended
     *   without purchase and the reservation
     *   fee is being/has been returned.
     */

    status: {
      type: String,

      enum: [
        "pending",
        "confirmed",
        "purchased",
        "refunded",
      ],

      default: "pending",

      index: true,
    },

    /*
     * ==========================================
     * OPTIONAL PURCHASE INFORMATION
     * ==========================================
     *
     * When the customer eventually purchases
     * the piece, we can store the normal
     * order number here.
     *
     * This makes it easy to connect:
     *
     * Reservation → Order
     */

    orderNumber: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    /*
     * ==========================================
     * REFUND INFORMATION
     * ==========================================
     *
     * We will use these later when implementing
     * the private-window refund logic.
     */

    refundStatus: {
      type: String,

      enum: [
        "not_required",
        "pending",
        "processed",
        "failed",
      ],

      default: "not_required",
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Reservation ||
  model(
    "Reservation",
    ReservationSchema
  );
