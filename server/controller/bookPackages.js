import { validationResult } from "express-validator";
import { bookPackage } from "../models/bookPackages.js";

export const handleBookPackage = async (req, res, next) => {
  // console.log(req.params.id);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array();
    return res.status(400).send({
      status: false,
      message: err,
    });
  }
  const { name, phone, adult, child, email } = req.body;
  const packageId = req.params.id;
  console.log(req.body);
  if (!packageId) {
    return res.status(400).send({
      status: false,
      message: "Please Select a Package",
    });
  }

  try {
    const PackageData = await bookPackage.findOne({
      PackageBooked: packageId,
    });

    // const obj = { ...PackageData };
    // console.log("book ", PackageData.BookingStatus);
    if (PackageData && PackageData.BookingStatus == "true") {
      return res.status(200).send({
        status: true,
        message: "You Have Already Booked This Package",
      });
    }

    if (PackageData && PackageData.BookingStatus == "false") {
      return res.status(408).send({
        status: true,
        message: "Payment Is Not Done Yet",
      });
    }
    if (!PackageData) {
      await bookPackage.create({
        name,
        email,
        adult,
        child,
        phone,
        PackageBooked: packageId,
        BookingStatus: false,
      });
    }
    next();
  } catch (err) {
    console.log("err", err);
    return res.status(400).send({
      status: false,
      message: err,
    });
  }
};
