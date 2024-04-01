import { Router } from "express";

import { handleBookHotel } from "../controller/BookHotelsController.js";
import { AuthMiddleware } from "../controller/authorization.js";
import { bookHotelValidation } from "../validators/bookHotels.js";
import { paymentForHotel, paymentSuccess } from "../controller/hotelPayment.js";

const router = Router();

router.post(
  "/book-hotel/:id",
  AuthMiddleware,
  bookHotelValidation,
  handleBookHotel,
  paymentForHotel
);

router.get("/success", [paymentSuccess]);
export { router };
