import { Router } from "express";
import { AllTrainsFilter, TrainByID } from "../controller/trains.js";
const router = Router();

router.get("/all-trains", AllTrainsFilter);

router.get("/:id", TrainByID);

export { router };
