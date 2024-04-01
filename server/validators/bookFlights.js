import { body } from "express-validator";

export const bookFlightValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),

  body("adult")
    .notEmpty()
    .withMessage("Adult is required")
    .isNumeric()
    .withMessage("It can be number only"),
  body("child")
    .notEmpty()
    .withMessage("Child is required")
    .isNumeric()
    .withMessage("It can be number only"),
];
