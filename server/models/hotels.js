import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  address1: { type: String, required: true },
  airportCode: { type: String, required: true },
  city: { type: String, required: true },
  countryCode: { type: String, required: true },
  deepLink: { type: String, required: true },
  hotelRating: { type: Number, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  locationDescription: { type: String, required: true },
  lowRate: { type: Number, required: true },
  shortDescription: { type: String, required: true },
});

// Create Hotel model
const Hotel = mongoose.model("hotel", hotelSchema);

export { Hotel };



