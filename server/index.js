import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { router as packageApi } from "./routes/api.js";
import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import cors from "cors";
// Mongoose connection
// const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

mongoose
  .connect("mongodb://127.0.0.1:27017/travel", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })  
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api", packageApi);
app.listen(5000, (err) => {
  console.log("Server listening on port", 5000);
});
