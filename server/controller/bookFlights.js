import { validationResult } from "express-validator";
import { bookFlight } from "../models/bookFlights.js";

export const handleBookFlight = async (req, res, next) => {
  console.log("coming in book flight", req?.params?.id);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }

  const { name, adult, child, email } = req.body;
  const flightId = req?.params?.id;
  console.log(req.body);

  if (!flightId) {
    console.log("undefined haiiii");
    return res.status(400).send({
      status: false,
      message: "Please Select a Flight",
    });
  }

  try {
    const FlightData = await bookFlight.findOne({
      FlightBooked: flightId,
    });

    // console.log("andrrrr", FlightData.BookingStatus == "true");
    if (FlightData && FlightData.BookingStatus == true) {
      return res.status(200).send({
        status: true,
        message: "You Have Already Booked This Flight",
      });
    }

    if (!FlightData) {
      await bookFlight.create({
        name,
        email,
        adult,
        child,
        FlightBooked: flightId,
        BookingStatus: false,
      });
    }
  } catch (err) {
    // console.log("err", err);
    return res.status(400).send({
      status: false,
      message: err,
    });
  }

  next();
};
