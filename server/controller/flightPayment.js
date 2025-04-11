import stripe from "stripe";
import { Flight } from "../models/flights.js";
import { bookFlight } from "../models/bookFlights.js";

const stripeInstance = stripe(
  "sk_test_51OrzjZSJ1RIygg5qYNJBUxVy9gkZ4SbMNEmD3tNPlciIH2kjaNxOtwWxqGuUR6HdLUBIA0st7Wkv732DJpJCNUjI00cPQk9Q3q"
);

export const paymentForFlight = async (req, res) => {
  console.log("inside fligt payment");
  const flightId = req.params.id;
  try {
    if (!flightId) {
      return res.status(400).send({
        status: false,
        message: "Please Select a Flight",
        // url: `http://localhost:3000/flights/${flightId}`,
      });
    }

    const flightData = await Flight.findOne({ _id: flightId }).lean();
    const bookedData = await bookFlight
      .findOne({ FlightBooked: flightId })
      .lean();

    console.log("payment", flightData, flightId);

    if (!flightData) {
      return res.status(404).send({
        status: false,
        message: "Flight not found",
        // url: `http://localhost:3000/flights/${flightId}`,
      });
    }

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: flightData.airline_name,
            description: flightData.fromCity,
          },
          unit_amount: flightData.price, // Converting price to cents
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `http://localhost:3000/flights/${flightId}?session_id={CHECKOUT_SESSION_ID}&flightId=${flightId}`,
      cancel_url: `http://localhost:3000/flights/${flightId}?session_id={CHECKOUT_SESSION_ID}&flightId=${flightId}`,
    });

    console.log("session", session);

    res.json({ url: session.url, message: "Complete The Payment " });
  } catch (e) {
    // console.error("Error:", e);
    res.status(500).json({
      error: e.message,
      // url: `http://localhost:3000/flights/${flightId}`,
    });
  }
};

export const paymentSuccess = async (req, res) => {
  console.log(
    "payyy got flight success",
    req.query.session_id,
    req.query.flightId
  );
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
  const flightId = req.query.flightId;

  if (!flightId) {
    return res.status(400).send({
      status: false,
      message: "Provide Valide flightId",
    });
  }

  const flightData = await Flight.findOne({
    _id: flightId,
  }).lean();

  if (!flightData) {
    return res.status(404).send({
      status: false,
      message: "Flight not found",
    });
  }

  if (session.payment_status == "paid") {
    await bookFlight.updateOne(
      { FlightBooked: req.query.flightId },
      {
        BookingStatus: true,
      }
    );
  } else {
    return res.status(404).send({
      status: false,
      message: "Payment Has Not Done Yet",
    });
  }

  return res.status(200).send({
    status: true,
    message: "Payment has been done Successfuly",
  });
};
