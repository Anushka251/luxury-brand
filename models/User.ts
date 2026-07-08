import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
  },

  resetToken: {
    type: String,
  },

  resetTokenExpiry: {
    type: Date,
  },
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
