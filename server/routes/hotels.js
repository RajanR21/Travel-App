import { Router } from "express";
import { AllHotelsFilter, HotelByID } from "../controller/hotels.js";
import { body } from "express-validator";
const router = Router();

router.get("/all-hotels", AllHotelsFilter);

router.get("/:id", HotelByID);

export { router };
