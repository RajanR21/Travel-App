import { router as packageRouter } from "./packages.js";
import { router as hotelRouter } from "./hotels.js";
import { router as bookPackageRouter } from "./bookPackages.js";
import { router as bookHotelRouter } from "./bookHotels.js";
import { router as flightRouter } from "./flights.js";
import { router as trainRouter } from "./trains.js";
import { router as userRouter } from "./authusers.js";
import { router as bookFlightRouter } from "./bookFlights.js";
import express from "express";

const router = express();

router.use("/holidays", packageRouter);
router.use("/hotels", hotelRouter);
router.use("/bookpackages", bookPackageRouter);
router.use("/bookhotels", bookHotelRouter);
router.use("/bookflights", bookFlightRouter);
router.use("/flights", flightRouter);
router.use("/trains", trainRouter);
router.use("/user", userRouter);

export { router };
