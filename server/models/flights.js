import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  flight_number: {
    type: String,
    required: true,
  },
  airline_name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  noofstops: {
    type: Number,
    required: true,
  },
  fromCity: {
    type: String,
    required: true,
  },
  toCity: {
    type: String,
    required: true,
  },
  travelDate: {
    type: Date,
    required: true,
  },
});

// Create Flight model{

const Flight = mongoose.model("flight", flightSchema);

export { Flight };
