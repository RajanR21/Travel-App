import mongoose from "mongoose";

// Define the main schema
const packageListSchema = new mongoose.Schema({
  name: { type: String },
  totalCount: Number,
  ratings: Number,
  destinationCity: String,
  minPrice: Number,
  maxPrice: Number,
  minNight: Number,
  maxNight: Number,
  packageList: [
    {
      packageName: String,
      rating: Number,
      packageCategory: String,
      noOfDays: Number,
      noOfNights: Number,
      startCity: String,
      endCity: String,
      hotelStatus: String,
      flightStatus: String,
      trainStatus: String,
      busStatus: String,
      imageUrl: String,
      startDate: Date,
      endDate: Date,
    },
  ],
});

// Create model from the schema
const PackageModel = mongoose.model("Package", packageListSchema);

export { PackageModel };
