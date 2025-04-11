import bcrypt from "bcrypt";
import { Otp, User } from "../models/authusers.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { getCaptcha } from "../helpers/getCaptcha.js";

export const handleLogin = async function (req, res) {
  console.log("agaya", req.body);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }

  try {
    const { email, password } = req.body;

    let userExist = await User.findOne({ email });
    console.log("andr", userExist);

    if (!userExist)
      return res.status(401).send({
        status: false,
        message: "Unauthorised , Register First",
      });

    // let OtpData = await Otp.findOne({ createdBy: userExist._id });
    // if (!OtpData.isverified) {
    //   return res.status(402).send({
    //     status: false,
    //     message: "Please Verify Otp First",
    //   });
    // }

    let isSamePass = await bcrypt.compare(password, userExist.password);

    if (!isSamePass) {
      return res.status(403).send({
        status: false,
        message: "Passsword Is Incorrect",
      });
    } else {
      const token = jwt.sign({ email: email }, process.env.SECERATE, {
        expiresIn: "1h",
      });
      console.log("token generated", token);

      await User.updateOne({ email: email }, { isverified: true });

      return res.status(200).send({
        status: true,
        message: "Login Successfuly",
        token: token,
      });
    }
  } catch (err) {
    return res.status(400).send({
      status: false,
      message: err.message,
    });
  }
};

export const handleRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }

  try {
    console.log(req.body);
    const { name, email, password, confirmPassword } = req.body;
    let userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(201).send({
        status: false,
        message: "User Already Exist",
      });
    }

    // const captcha = getCaptcha();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        isverified: false,
      });

      // console.log(process.env.EMAIL, process.env.PASSWORD);
      // const captchaDataURL = generateCaptcha();
      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.EMAIL,
      //     pass: process.env.PASSWORD,
      //   },
      // });

      // const mailOption = {
      //   from: process.env.EMAIL,
      //   to: email,
      //   subject: "Authentication successfuly done ",
      //   html: `
      //           <h1>Congratulations! You've received an email: ${captcha}</h1>
      //               <p>Please find the captcha</p>
      //              `,
      // };

      // transporter.sendMail(mailOption, (error, info) => {
      //   if (error) console.log("Error", error);
      //   else {
      //     console.log("Email sent" + info.response);
      //   }
      // });
    } catch (error) {
      return res.status(401).json({
        status: 401,
        error,
      });
    }

    // let userId = await User.findOne({ email });
    // await Otp.create({
    //   otp: captcha,
    //   createdBy: userId._id,
    // });

    return res.status(201).send({
      status: true,
      messsage: "Register Successfuly And Otp Send To Your E-Mail",
      token: token,
    });
  } catch (err) {
    console.log("errrr", err);
    return res.status(400).send({
      status: false,
      message: err.message,
    });
  }
};

export const handleForgotPasswordGet = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send({
      status: false,
      message: "No Token Found",
    });
  }
  console.log("token hai", token);
  try {
    console.log(req.body);

    return res.status(200).send({
      status: false,
      message: "Enter Change Password",
    });
  } catch (err) {
    console.log("errrr", err);
    return res.status(400).send({
      status: false,
      message: err.message,
    });
  }
};

export const handleResetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }

  try {
    console.log(req.body);
    const { password, token } = req.body;

    // let userExist = await User.findOne({ email });

    if (!token) {
      return res.status(400).send({
        status: false,
        message: "Token not Found , Login First",
      });
    }

    const email = jwt.verify(token, "vuydwvysdvqvwwdvs");
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).send({
      status: true,
      message: "Password Changed Successfuly",
    });
  } catch (err) {
    console.log("errrr", err);
    return res.status(400).send({
      status: false,
      message: err.message,
    });
  }
};

export const handleVerifyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }

  try {
    console.log(req.body);
    const { otp, token } = req.body;
    const { email } = jwt.verify(token, "vuydwvysdvqvwwdvs");
    let userExist = await User.findOne({ email });
    let storedOtp = await Otp.findOne({ createdBy: userExist._id });
    if (!userExist) {
      return res.status(400).send({
        status: false,
        message: "Register First",
      });
    }

    if (!storedOtp) {
      return res.status(400).send({
        status: false,
        message: "OTP Expired , Resend OTP",
      });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).send({
        status: false,
        message: "OTP Does Not Matched",
      });
    }

    const user = await Otp.updateOne(
      { createdBy: userExist._id },
      { isverified: true }
    );
    console.log("suer", user);

    return res.status(200).send({
      status: true,
      message: "OTP Verified Successfuly",
    });
  } catch (err) {
    console.log("errrr", err);
    return res.status(400).send({
      status: false,
      message: err.message,
    });
  }
};

export const handleResendOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }
  const { email } = req.body;
  console.log("email", email);

  let userExist = await User.findOne({ email });

  if (!userExist) {
    return res.status(400).send({
      status: false,
      message: "User Not Exist",
    });
  }
  const captcha = getCaptcha();
  console.log(captcha);

  try {
    // console.log(process.env.EMAIL, process.env.PASSWORD);
    // const captchaDataURL = generateCaptcha();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.EMAIL,
      to: email,
      subject: "Authentication successfuly done ",
      html: `
            <h1>Congratulations! You've received an email: ${captcha}</h1>
                <p>Please find the captcha</p>
                
               `,
    };

    transporter.sendMail(mailOption, async (error, info) => {
      if (error) console.log("Error", error);
      else {
        console.log("Email sent" + info.response);

        await Otp.create({
          otp: captcha,
          createdBy: userExist._id,
        });
        return res.status(201).json({
          status: 201,
          message: "Otp Sent To Your Email",
        });
      }
    });
  } catch (error) {
    return res.status(401).json({
      status: 401,
      error,
    });
  }
};

export const handleForgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }
  const { email } = req.body;
  console.log("email", email);

  let userExist = await User.findOne({ email });

  if (!userExist) {
    return res.status(400).send({
      status: false,
      message: "User Not Exist",
    });
  }

  try {
    // console.log(process.env.EMAIL, process.env.PASSWORD);
    // const captchaDataURL = generateCaptcha();
    const token = jwt.sign(email, "vuydwvysdvqvwwdvs");
    console.log("cookie", token);

    if (!token) {
      res.status(400).send({
        status: false,
        message: "Please Login First",
      });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.EMAIL,
      to: email,
      subject: "Authentication successfuly done ",
      html: `
            <h1>Congratulations! You've received an email</h1>
                <p>Please find the Link : {http://localhost:5000/user/reset-password?token=${token}}</p>
               `,
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) console.log("Error", error);
      else {
        console.log("Email sent" + info.response);
        res.status(201).json({
          status: 201,
          message: "Link To Reset Password Has Been Sent To Your Email",
        });
      }
    });
  } catch (error) {
    res.status(401).json({
      status: 401,
      error,
    });
  }
};

export const handleChangePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }

  const { oldpassword, newpassword, email } = req.body;
  console.log("change pass body", req.body);

  let userExist = await User.findOne({ email });

  if (!userExist) {
    return res.status(400).send({
      status: false,
      message: "User Not Exist",
    });
  }

  let isSamePass = await bcrypt.compare(oldpassword, userExist.password);

  if (!isSamePass) {
    return res.status(400).send({
      status: false,
      messsage: "Passsword Is Incorrect",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).send({
      status: true,
      message: "Password Changed Successfuly",
    });
  } catch (error) {
    res.status(401).json({
      status: 401,
      error,
    });
  }
};
