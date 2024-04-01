import { Router } from "express";
import { AllFlightsFilter, FlightByID } from "../controller/flights.js";
const router = Router();

router.get("/all-flights", AllFlightsFilter);

router.get("/:id", FlightByID);

export { router };
