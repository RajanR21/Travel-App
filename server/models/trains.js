import mongoose from "mongoose";

const trainSchema = new mongoose.Schema({});

// Create Flight model
const Train = mongoose.model("train", trainSchema);

export { Train };
