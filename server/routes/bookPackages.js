import { Router } from "express";
import { body } from "express-validator";
import { handleBookPackage } from "../controller/bookPackages.js";
import { bookPackageValidation } from "../validators/bookPackages.js";
import { AuthMiddleware } from "../controller/authorization.js";
import {
  paymentForPackage,
  paymentSuccess,
} from "../controller/packagePayment.js";

const router = Router();

router.post("/book-package/:id", [
  AuthMiddleware,
  bookPackageValidation,
  handleBookPackage,
  paymentForPackage,
]);

router.get("/success", [paymentSuccess]);

export { router };
