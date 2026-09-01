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
     * The actual reservation fee is
     * stored here.
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
        "confirmed",
        "purchased",
        "refunded",
        "closed",
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
     * → Payment/reservation not completed.
     *
     * confirmed
     * → Reservation fee successfully paid.
     * → Customer receives PRIVATE ACCESS.
     *
     * purchased
     * → Customer used private access
     *   and purchased the piece.
     *
     * refunded
     * → Reservation opportunity ended
     *   and the fee was refunded.
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
     * AVENOR CONFIRMATION EMAIL
     * ==========================================
     *
     * Prevents duplicate reservation
     * confirmation emails if the payment
     * confirmation endpoint is called more
     * than once.
     */

    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },

    confirmationEmailSentAt: {
      type: Date,
      default: null,
    },

    /*
     * ==========================================
     * PURCHASE INFORMATION
     * ==========================================
     *
     * When the customer eventually purchases
     * the piece, store the normal order number.
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
