import { Router } from "express";
import { PackageModel } from "../models/packageList.js";
import { Hotel } from "../models/hotels.js";
import { AllPackagesFilter, GetPakcageByiD } from "../controller/packages.js";
const router = Router();

router.get("/test", async (req, res) => {
  await Hotel.create({
    id: "024fcdba-27e4-11e6-af44-cd4c8e537e9c",
    type: "hotel",
    name: "Sheraton Seattle Hotel",
    address1: "1400 6th Ave",
    airportCode: "SEA",
    city: "Seattle",
    countryCode: "US",
    deepLink:
      "http://www.travelnow.com/templates/55505/hotels/164116/overview?lang=en&amp;currency=USD&amp;standardCheckin=null/null/null&amp;standardCheckout=null/null/null",
    hotelRating: 4,
    location: {
      latitude: 47.61017,
      longitude: -122.33357,
    },
    locationDescription: "Near Pike Place Market",
    lowRate: 205,
    shortDescription:
      "With a stay at Sheraton Seattle Hotel, you'll be centrally located in Seattle, steps from 5th Avenue Theater and Washington State Convention Center. This 4-star",
  });
  res.send("hii");
});

router.get("/all-packages", AllPackagesFilter);

router.get("/packages/:id", GetPakcageByiD);

export { router };
