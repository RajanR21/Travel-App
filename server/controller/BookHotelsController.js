import { validationResult } from "express-validator";
import { bookHotel } from "../models/bookHotels.js";

const handleBookHotel = async (req, res, next) => {
  console.log(req.params.id);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }
  const { name, phone, adult, child, email, rooms } = req.body;
  const hotelId = req.params.id;
  // console.log(req.body);

  if (!hotelId) {
    return res.status(400).send({
      status: false,
      message: "Please Select a Hotel",
    });
  }

  try {
    const HotelData = await bookHotel.findOne({
      HotelBooked: hotelId,
    });

    // console.log("andrrrr", HotelData.BookingStatus == "true");
    if (HotelData && HotelData.BookingStatus == true) {
      return res.status(200).send({
        status: true,
        message: "You Have Already Booked This Hotel",
      });
    }

    if (HotelData && HotelData.BookingStatus == false) {
      return res.status(200).send({
        status: true,
        message: "Please Complete Your Payment First ",
      });
    }

    if (!HotelData) {
      await bookHotel.create({
        name,
        email,
        adult,
        child,
        phone,
        rooms,
        HotelBooked: hotelId,
        BookingStatus: false,
      });
    }
  } catch (error) {
    console.log("err", error);
    return res.status(400).send({
      status: false,
      message: error,
    });
  }

  next();
};

export { handleBookHotel };
