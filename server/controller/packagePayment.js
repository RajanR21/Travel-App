import stripe from "stripe";
import { PackageModel } from "../models/packageList.js";
import { bookPackage } from "../models/bookPackages.js";

const stripeInstance = stripe(
  "sk_test_51OrzjZSJ1RIygg5qYNJBUxVy9gkZ4SbMNEmD3tNPlciIH2kjaNxOtwWxqGuUR6HdLUBIA0st7Wkv732DJpJCNUjI00cPQk9Q3q"
);

export const paymentForPackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    if (!packageId) {
      return res.status(400).send({
        status: false,
        message: "Please Select a Package",
      });
    }

    const packageData = await PackageModel.findOne({ _id: packageId }).lean();

    if (!packageData) {
      return res.status(404).send({
        status: false,
        message: "Package not found",
      });
    }

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: packageData.name,
            description: `Package in ${packageData.city}, ${packageData.country}`,
          },
          unit_amount: packageData.price, // Converting price to cents
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `http://localhost:3000/packages/${packageId}?session_id={CHECKOUT_SESSION_ID}&packageId=${packageId}`,
      cancel_url: `http://localhost:3000/packages/${packageId}?session_id={CHECKOUT_SESSION_ID}&packageId=${packageId}`,
    });

    // console.log("session", session);

    res.status(200).json({ url: session.url, message: "Comlete The Payment " });
  } catch (e) {
    // console.error("Error:", e);
    res.status(500).json({ error: e.message });
  }
};

export const paymentSuccess = async (req, res) => {
  console.log(req.query.session_id, req.query.packageId);
  const session = await stripeInstance.checkout.sessions.retrieve(
    req.query.session_id
  );
  console.log("success", session.payment_status);
  const packageId = req.query.packageId;

  if (!packageId) {
    return res.status(400).send({
      status: false,
      message: "Provide Valide PackageId",
    });
  }

  const packageData = await PackageModel.findOne({
    _id: packageId,
  }).lean();

  if (!packageData) {
    return res.status(404).send({
      status: false,
      message: "Package not found",
    });
  }

  if (session.payment_status == "paid") {
    await bookPackage.updateOne(
      { PackageBooked: req.query.packageId },
      {
        BookingStatus: true,
      }
    );
  } else {
    return res.status(404).send({
      status: false,
      message: "Payment Failed",
    });
  }

  return res.status(200).send({
    status: true,
    message: "Payment has been done  Successfuly",
  });
};
