import mongoose from "mongoose";

const bookFlightModel = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  adult: { type: Number, required: true },
  child: { type: Number, required: true },
  FlightBooked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "flight",
  },
  BookingStatus: { type: Boolean, required: true },
});

const bookFlight = mongoose.model("flight bookings", bookFlightModel);

export { bookFlight };
