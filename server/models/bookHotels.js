import mongoose from "mongoose";

const bookHotelModel = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  adult: { type: Number, required: true },
  child: { type: Number, required: true },
  phone: { type: Number, required: true },
  rooms: { type: Number, required: true },
  HotelBooked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "hotel",
  },
  BookingStatus: { type: Boolean, required: true },
});

const bookHotel = mongoose.model("hotel bookings", bookHotelModel);

export { bookHotel };
