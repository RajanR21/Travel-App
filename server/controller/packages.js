import { PackageModel } from "../models/packageList.js";

export const AllPackagesFilter = async (req, res) => {
  let { city, minPrice, minDay, lowToHigh, highToLow, country } = req.query;

  try {
    const pipeline = [];
    const limit = 5;
    const page = parseInt(req?.query?.page);

    const offset = (page - 1) * limit;

    const packagesCollectionCount = await PackageModel.countDocuments();

    const totalPages = Math.ceil(packagesCollectionCount / limit);
    // Match stage to filter documents based on criteria
    const matchStage = {};

    if (city) {
      matchStage["city"] = city;
    }
    if (minPrice) {
      matchStage["price"] = { $gte: parseInt(minPrice) };
    }
    if (minDay) {
      matchStage["days"] = { $gte: parseInt(minDay) };
    }
    if (country) {
      matchStage["country"] = country;
    }

    pipeline.push({ $match: matchStage });

    // Sort stage based on lowToHigh or highToLow flag
    if (lowToHigh === "true") {
      pipeline.push({ $sort: { price: 1 } });
    } else if (highToLow === "true") {
      pipeline.push({ $sort: { price: -1 } });
    }

    // Execute aggregation pipeline
    let allPackages;
    if (page) {
      allPackages = await PackageModel.aggregate(pipeline)
        .skip(offset)
        .limit(limit);
    } else {
      allPackages = await PackageModel.aggregate(pipeline);
    }

    if (allPackages.length === 0) {
      return res.status(200).send({
        status: true,
        data: [],
        message: "No Data Found",
      });
    }

    return res.status(200).send({
      status: true,
      data: allPackages,
      message: "Packages fetched successfully",
      paging: {
        total: packagesCollectionCount,
        page: page,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const GetPakcageByiD = async (req, res) => {
  // console.log(req.params.id);

  const cityId = req.params.id;
  console.log(cityId);
  if (!cityId) {
    return res.status(400).send({
      status: false,
      message: "Please Provide Id",
    });
  }

  try {
    const allPackages = await PackageModel.findById(cityId);

    if (allPackages.length == 0) {
      return res.status(200).send({
        status: true,
        data: [],
        message: "No Data Found",
      });
    }
    return res.status(200).send({
      status: true,
      data: allPackages,
      message: "Packages fetched Successfuly",
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error,
    });
  }
};
