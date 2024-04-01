import { Hotel } from "../models/hotels.js";

export const AllHotelsFilter = async (req, res) => {
  let { city, country, minRating, startingFrom, lowToHigh, highToLow } =
    req?.query;

  try {
    const pipeline = [];
    const limit = 5;
    const page = parseInt(req?.query?.page);

    const offset = (page - 1) * limit;

    const hotelsCollectionCount = await Hotel.countDocuments();

    const totalPages = Math.ceil(hotelsCollectionCount / limit);
    // Match stage to filter documents based on criteria
    const matchStage = {};

    if (city) {
      matchStage["city"] = city;
    }
    if (country) {
      matchStage["country"] = country;
    }
    if (minRating) {
      matchStage["rating"] = { $gte: parseInt(minRating) };
    }
    if (startingFrom) {
      matchStage["price"] = { $gte: parseInt(startingFrom) };
    }

    // console.log(typeof high);
    pipeline.push({ $match: matchStage });

    // Sort stage based on lowToHigh or highToHigh flag
    if (lowToHigh === "true") {
      pipeline.push({ $sort: { price: 1 } });
    } else if (highToLow === "true") {
      pipeline.push({ $sort: { price: -1 } });
    }
    let allHotels;
    // Execute aggregation pipeline
    if (page) {
      allHotels = await Hotel.aggregate(pipeline).skip(offset).limit(limit);
    } else {
      allHotels = await Hotel.aggregate(pipeline).skip(offset);
    }

    if (allHotels.length === 0) {
      return res.status(200).send({
        status: true,
        data: allHotels,
        message: "No Data Found",
      });
    }

    return res.status(200).send({
      status: true,
      data: allHotels,
      message: "Hotels fetched successfully",
      paging: {
        total: hotelsCollectionCount,
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

export const HotelByID = async (req, res) => {
  // console.log(req.params.id);

  const hotelId = req.params.id;
  // console.log(hotelId);
  if (!hotelId) {
    return res.status(400).send({
      status: false,
      message: "Please Provide Id",
    });
  }

  try {
    const HotelData = await Hotel.findOne({
      _id: hotelId,
    });

    return res.status(200).send({
      status: true,
      data: HotelData,
      message: "Hotels fetched Successfuly",
    });
  } catch (error) {
    console.log("err", error);
    return res.status(400).send({
      status: false,
      message: error,
    });
  }
};
