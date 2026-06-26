import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const AddressSchema = new Schema(
  {
    customerEmail: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    landmark: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Address ||
  model("Address", AddressSchema);
