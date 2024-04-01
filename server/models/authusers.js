import mongoose, { model } from "mongoose";
import { boolean } from "yup";

const otpSchema = new mongoose.Schema({
  otp: String,
  isverified: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  createdAt: { type: Date, default: Date.now, expire: 5 },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isverified: Boolean,
});

const User = model("user", userSchema);
const Otp = model("otp", otpSchema);
export { User, Otp };
