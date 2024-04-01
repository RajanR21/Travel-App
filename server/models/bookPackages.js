import mongoose from "mongoose";

const bookPackageModel = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  adult: { type: Number, required: true },
  child: { type: Number, required: true },
  phone: { type: Number, required: true },
  PackageBooked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
  },
  BookingStatus: { type: Boolean, required: true },
});

const bookPackage = mongoose.model("package bookings", bookPackageModel);

export { bookPackage };
