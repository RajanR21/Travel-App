import jwt from "jsonwebtoken";
import { Otp, User } from "../models/authusers.js";

export const AuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log("token", authHeader);
  console.log("middle waree");

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Authorization required , Please login first" });
  }

  const [bearer, token] = authHeader.split(" ");

  if (!token || token == "undefined") {
    return res
      .status(401)
      .json({ message: "Please Login First", status: false });
  }
  // console.log("token check", token == "undefined");
  // Check if the authorization header has the correct format

  if (bearer !== "Bearer" || !token) {
    // Handle case where authorization header has incorrect format
    return res
      .status(401)
      .json({ message: "Invalid authorization header format", status: false });
  }

  try {
    const { email } = jwt.verify(token, process.env.SECERATE);
    let userExist = await User.findOne({ email });
    if (!userExist)
      return res.status(400).send({
        status: false,
        messsage: "Register First",
      });

    if (!userExist.isverified) {
      return res.status(400).send({
        status: false,
        messsage: "Unauthorised , Please Login First",
      });
    }

    // let OtpData = await Otp.findOne({ createdBy: userExist._id });

    // if (!OtpData)
    //   return res.status(400).send({
    //     status: false,
    //     messsage: "Otp Expired , Please Verify Otp First",
    //   });
    // if (!OtpData.isverified) {
    //   return res.status(402).send({
    //     status: false,
    //     message: "Please Verify Otp First",
    //   });
    // }
  } catch (error) {
    // Handle any errors that occur during token verification or authentication
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
  next();
};
