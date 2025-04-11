import stripe from "stripe";
import { bookHotel } from "../models/bookHotels.js";
import { Hotel } from "../models/hotels.js";

const stripeInstance = stripe(
  "sk_test_51OrzjZSJ1RIygg5qYNJBUxVy9gkZ4SbMNEmD3tNPlciIH2kjaNxOtwWxqGuUR6HdLUBIA0st7Wkv732DJpJCNUjI00cPQk9Q3q"
);

export const paymentForHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;

    if (!hotelId) {
      return res.status(400).send({
        status: false,
        message: "Please Select a Hotel",
      });
    }

    const hotelData = await Hotel.findOne({ _id: hotelId }).lean();
    const bookedData = await bookHotel.findOne({ HotelBooked: hotelId }).lean();

    console.log("payment", hotelData, hotelId);

    if (!hotelData) {
      return res.status(404).send({
        status: false,
        message: "Hotel not found",
      });
    }

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: hotelData.name,
            description: hotelData.directions,
          },
          unit_amount: hotelData.price, // Converting price to cents
        },
        quantity: bookedData.rooms,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `http://localhost:3000/hotels/${hotelId}?session_id={CHECKOUT_SESSION_ID}&hotelId=${hotelId}`,
      cancel_url: `http://localhost:3000/hotels/${hotelId}?session_id={CHECKOUT_SESSION_ID}&hotelId=${hotelId}`,
    });

    // console.log("session", session);

    res
      .status(200)
      .json({ url: session.url, message: "Complete The Payment " });
  } catch (e) {
    // console.error("Error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const paymentSuccess = async (req, res) => {
  console.log(req.query.session_id, req.query.hotelId);

  try {
    const session = await stripeInstance.checkout.sessions.retrieve(
      req.query.session_id
    );

    if (!session) {
      return res.status(400).send({
        status: false,
        message: "Session Not Found",
      });
    }
    console.log("success", session.payment_status);
    const hotelId = req.query.hotelId;

    if (!hotelId) {
      return res.status(400).send({
        status: false,
        message: "Provide Valide hotelId",
      });
    }

    const hotelData = await Hotel.findOne({
      _id: hotelId,
    }).lean();

    if (!hotelData) {
      return res.status(404).send({
        status: false,
        message: "Hotel not found",
      });
    }

    if (session.payment_status == "paid") {
      await bookHotel.updateOne(
        { HotelBooked: req.query.hotelId },
        {
          BookingStatus: true,
        }
      );
    } else {
      return res.status(404).send({
        status: false,
        message: "Payment Has Not Done",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Payment has been done  Successfuly",
    });
  } catch (error) {
    console.log("error in success", error);
    return res.status(404).send({
      status: false,
      message: "Payment Not Successed",
      error,
    });
  }
};
