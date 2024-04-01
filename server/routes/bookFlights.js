import { Router } from "express";

import { AuthMiddleware } from "../controller/authorization.js";
import { bookFlightValidation } from "../validators/bookFlights.js";
import { handleBookFlight } from "../controller/bookFlights.js";
import {
  paymentForFlight,
  paymentSuccess,
} from "../controller/flightPayment.js";

const router = Router();

router.post(
  "/book-flight/:id",
  AuthMiddleware,
  bookFlightValidation,
  handleBookFlight,
  paymentForFlight
);

router.get("/success", [paymentSuccess]);
export { router };
