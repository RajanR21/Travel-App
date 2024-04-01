import { Train } from "../models/Trains.js";

export const AllTrainsFilter = async (req, res) => {
  let {
    source,
    destination,
    price,
    duration,
    name,
    firstAc,
    secondAc,
    thirdAc,
    sleeper,
    chaircar,
    distance,
  } = req.query;

  console.log(req.query);
  console.log("auth", req.headers["authorization"]);

  if ((!source && destination) || (source && !destination)) {
    return res.status(400).send({
      status: true,
      message: "Source And Destination Both Are Required",
    });
  }
  try {
    const pipeline = [];

    // Match stage to filter documents based on criteria
    const matchStage = {};

    if (source) {
      matchStage["from_station_code"] = source;
    }
    if (destination) {
      matchStage["to_station_code"] = destination;
    }
    if (name) {
      matchStage["name"] = name;
    }
    if (firstAc === "true") {
      matchStage["first_ac"] = { $gte: parseInt(1) };
    }
    if (secondAc === "true") {
      matchStage["second_ac"] = { $gte: parseInt(1) };
    }
    if (thirdAc === "true") {
      matchStage["third_ac"] = { $gte: parseInt(1) };
    }
    if (sleeper === "true") {
      matchStage["sleeper"] = { $gte: parseInt(1) };
    }
    if (chaircar === "true") {
      matchStage["chair_car"] = { $gte: parseInt(1) };
    }

    pipeline.push({ $match: matchStage });

    // Sort stage based on lowToHigh or highToHigh flag
    if (price === "true") {
      pipeline.push({ $sort: { price: 1 } });
    }
    if (duration === "true") {
      pipeline.push({ $sort: { duration_m: 1 } });
    }
    if (distance === "true") {
      pipeline.push({ $sort: { distance: 1 } });
    }

    // Execute aggregation pipeline
    const allTrains = await Train.aggregate(pipeline);

    if (allTrains.length === 0) {
      return res.status(200).send({
        status: true,
        data: allTrains,
        message: "No Data Found",
      });
    }

    return res.status(200).send({
      status: true,
      data: allTrains,
      message: "Trains fetched successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const TrainByID = async (req, res) => {
  // console.log(req.params.id);

  const hotelId = req.params.id;
  console.log(hotelId);
  if (!hotelId) {
    return res.status(400).send({
      status: false,
      message: "Please Provide Id",
    });
  }

  try {
    const TrainData = await Train.findOne({
      _id: hotelId,
    });

    return res.status(200).send({
      status: true,
      data: TrainData,
      message: "Trains fetched Successfuly",
    });
  } catch (error) {
    console.log("err", err);
    return res.status(400).send({
      status: false,
      message: error,
    });
  }
};
