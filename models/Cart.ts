import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userEmail: String,
  items: Array,
});

export default mongoose.models.Cart ||
  mongoose.model("Cart", CartSchema);