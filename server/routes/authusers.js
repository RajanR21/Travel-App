import { Router } from "express";
import { body } from "express-validator";
import {
  handleChangePassword,
  handleForgotPassword,
  handleForgotPasswordGet,
  handleLogin,
  handleRegister,
  handleResendOtp,
  handleResetPassword,
  handleVerifyOtp,
} from "../controller/authusers.js";
const router = Router();

router.get("/test", (req, res) => {
  res.send("hii");
});
router.post("/login", [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength(8)
    .withMessage("Password Should Be Minimum Of 8 Length"),

  handleLogin,
]);

router.post("/register", [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength(8)
    .withMessage("Password Should Be Minimum Of 8 Length"),
  body("confirmPassword").custom(async (confirmPassword, { req }) => {
    const password = req.body.password;

    if (password != confirmPassword) {
      throw new Error("Passwords must be same");
    }
  }),

  handleRegister,
]);

router.get("/reset-password", handleForgotPasswordGet);

router.post("/reset-password", [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength(8)
    .withMessage("Password Should Be Minimum Of 8 Length"),

  handleResetPassword,
]);

router.post("/verifyotp", [
  body("otp")
    .notEmpty()
    .withMessage("Otp is required")
    .isLength(6)
    .withMessage("Otp Should Be Minimum Of 6 Length"),
  body("token").notEmpty().withMessage("valid token required"),

  handleVerifyOtp,
]);

router.post("/resendotp", [
  body("email").isEmail().withMessage("Please enter a valid email"),

  handleResendOtp,
]);

router.post("/forgotpassword", [
  body("email").isEmail().withMessage("Please enter a valid email"),

  handleForgotPassword,
]);

router.post("/changepassword", [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("oldpassword")
    .notEmpty()
    .withMessage("Please enter a valid Password")
    .isLength(8)
    .withMessage("Old Password Should Be Minimum Of 8 Length"),
  body("newpassword")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength(8)
    .withMessage("New Password Should Be Minimum Of 8 Length"),
  body("confirmPassword")
    .custom(async (confirmPassword, { req }) => {
      const newpassword = req.body.newpassword;

      if (newpassword !== confirmPassword) {
        throw new Error("Passwords must be same");
      }
    })
    .isLength(8)
    .withMessage("Confirm Password Should Be Minimum Of 8 Length"),

  handleChangePassword,
]);

export { router };

// router.get("/login", (req, res) => {
//   console.log(req.user);
//   res.render("login");
// });

// router.get("/register", (req, res) => {
//   res.render("register");
// });

// router.get("/logout", (req, res) => {
//   res.cookie("token", null, {
//     httpOnly: true,
//     expires: new Date(Date.now()),
//   });
//   res.redirect("/");
// });
