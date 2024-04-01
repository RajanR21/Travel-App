import { body } from "express-validator";

export const bookPackageValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("phone")
    .notEmpty()
    .withMessage("phone is Required")
    .isLength(10)
    .withMessage("Password Should Be Minimum Of 10 Length"),
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
