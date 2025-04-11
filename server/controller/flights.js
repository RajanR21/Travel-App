import { Flight } from "../models/flights.js";

export const AllFlightsFilter = async (req, res) => {
  let { source, destination, cheapest, fastest, noOfStops } = req?.query;
  // console.log(req.query);

  if ((!source && destination) || (source && !destination)) {
    return res.status(400).send({
      status: true,
      message: "Source And Destination Both Are Required",
    });
  }
  try {
    const pipeline = [];

    const limit = 5;
    const page = parseInt(req?.query?.page);

    const offset = (page - 1) * limit;

    const flightsCollectionCount = await Flight.countDocuments();

    const totalPages = Math.ceil(flightsCollectionCount / limit);

    // Match stage to filter documents based on criteria
    const matchStage = {};

    if (source) {
      matchStage["fromCity"] = { $regex: new RegExp(source, "i") };
    }
    if (destination) {
      matchStage["toCity"] = { $regex: new RegExp(destination, "i") };
    }

    if (noOfStops) {
      matchStage["noofstops"] = { $lte: parseInt(noOfStops) };
    }

    pipeline.push({ $match: matchStage });

    // Sort stage based on lowToHigh or highToHigh flag
    if (cheapest === "true") {
      pipeline.push({ $sort: { price: 1 } });
    } else if (fastest === "true") {
      pipeline.push({ $sort: { duration: 1 } });
    } else if (fastest === "true" && cheapest === "true") {
      pipeline.push({ $sort: { duration: 1, price: 1 } });
    }

    // Execute aggregation pipeline
    const allFlights = await Flight.aggregate(pipeline)
      .skip(offset)
      .limit(limit);

    if (allFlights.length === 0) {
      return res.status(200).send({
        status: true,
        data: allFlights,
        message: "No Data Found",
      });
    }

    return res.status(200).send({
      status: true,
      data: allFlights,
      message: "Flights fetched successfully",
      paging: {
        total: flightsCollectionCount,
        page: page,
        pages: totalPages,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const FlightByID = async (req, res) => {
  // console.log(req.params.id);

  const flightId = req.params.id;
  console.log("flight id", flightId);
  if (!flightId) {
    return res.status(400).send({
      status: false,
      message: "Please Provide Id",
    });
  }

  try {
    const FlightData = await Flight.findOne({
      _id: flightId,
    });

    return res.status(200).send({
      status: true,
      data: FlightData,
      message: "Flights fetched Successfuly",
    });
  } catch (error) {
    // console.log("err", error);
    return res.status(400).send({
      status: false,
      message: error,
    });
  }
};
