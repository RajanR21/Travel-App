import { Link } from "react-router-dom";
import "./searchItem.css";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Reserve from "./Reserve";
import { useState } from "react";
const SingleFlight = ({ item }) => {
  // console.log("result", session_id, flightId == item._id);

  return (
    <div className="searchItem">
      <div className="siDesc">
        <h1 className="siTitle">{item?.airline_name}</h1>
        <span className="siDistance">{item?.duration * 100} km of journey</span>
        <span className="siSubtitle">{item?.flight_number} Air Craft</span>
        <span className="siFeatures">Number Of Stops : {item?.noofstops}</span>
        <span className="siCancelOp">
          {item?.fromCity} {<FontAwesomeIcon icon={faArrowAltCircleRight} />}{" "}
          {item?.toCity}
        </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        {
          <div className="siRating">
            <span></span>
            <button>{item.travelDate}</button>
          </div>
        }
        <div className="siDetailTexts">
          <span className="siPrice">${item?.price}</span>
          <span className="siTaxOp">Includes taxes and fees</span>

          <Link to={`/flights/${item._id}`} className="siCheckButton">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleFlight;
