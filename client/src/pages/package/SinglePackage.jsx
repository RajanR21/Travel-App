import { Link } from "react-router-dom";
import "./searchItem.css";

let images = [
  "https://cache.marriott.com/marriottassets/marriott/GVALC/gvalc-deluxe-7352-hor-clsc.jpg?interpolation=progressive-bilinear&",
  "https://tse4.mm.bing.net/th?id=OIP.Zis2cXdglxbZemS3QNsdZQHaE8&pid=Api&P=0&h=180",
  "https://tse2.mm.bing.net/th?id=OIP.E0tnPW81_JeMB35SPMCATwHaHc&pid=Api&P=0&h=180",
  "https://tse3.mm.bing.net/th?id=OIP.nWJ3eHHftJSG_Riz6PatSwHaFI&pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th?id=OIP.yrJhmX5_BJZCPIFs7zsgLAHaEo&pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th?id=OIP.XoPWAKPsQU1ib1_fKgKeDgHaE8&pid=Api&P=0&h=180",
  "https://tse4.mm.bing.net/th?id=OIP.-wcXcPg9mUaWmMJuoWXgHgAAAA&pid=Api&P=0&h=180",
  "https://tse2.mm.bing.net/th?id=OIP.tg5xKPOOv4fpR0oFu2mbBQHaE8&pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th?id=OIP.76RoYzPNLIIeS4BWo7NErwHaE8&pid=Api&P=0&h=180",
  "https://tse2.mm.bing.net/th?id=OIP.PzhhpovLnjpKkRrVN-zScAHaFM&pid=Api&P=0&h=180",
  "https://tse3.mm.bing.net/th?id=OIP.nd3uX9-pwTsiBF63a-8_4wHaD9&pid=Api&P=0&h=180",
  "https://tse2.mm.bing.net/th?id=OIP.Xp9nQEJ3SqXX3PH0Siw0UQHaE7&pid=Api&P=0&h=180",
  "https://tse3.mm.bing.net/th?id=OIP.EHkOkOQcMloWfrd2qDWn9wHaE8&pid=Api&P=0&h=180",
  "https://tse4.mm.bing.net/th?id=OIP.K9yEIjLue6BCJOZSsUTYAgHaEJ&pid=Api&P=0&h=180",
  "https://tse3.mm.bing.net/th?id=OIP.klLf61xk7WYKYvXZXkblmgHaEK&pid=Api&P=0&h=180",
  "https://tse2.mm.bing.net/th?id=OIP.jMF8QKeWNP9S-VJlhRFgvQHaFj&pid=Api&P=0&h=180",
  "https://tse3.mm.bing.net/th?id=OIP.kNGsy5Tfb94a_AiMMsjQTQHaEw&pid=Api&P=0&h=180",
  "https://tse4.mm.bing.net/th?id=OIP.siRPGeeMlz_42IJ3a22ikQHaE8&pid=Api&P=0&h=180",
  "https://tse2.mm.bing.net/th?id=OIP.cM5fTf5111EpDNGrcqLLCwHaFS&pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th?id=OIP.s2jYIJY_CSSlvtdhauPY3wHaE7&pid=Api&P=0&h=180",
];
const SinglePackage = ({ item }) => {
  // console.log("item", item);
  return (
    <div className="searchItem">
      <img src={item?.image} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item?.name}</h1>
        <span className="siDistance">{item?.address}</span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">
          Studio Apartment with Air conditioning
        </span>
        <span className="siFeatures">{item.directions}</span>
        <span className="siCancelOp">Free cancellation </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        {item.rating && (
          <div className="siRating">
            <span>Days</span>
            <button>{item.days}</button>
          </div>
        )}
        <div className="siDetailTexts">
          <span className="siPrice">${item?.price}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <Link to={`/packages/${item._id}`}>
            <button className="siCheckButton">See Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SinglePackage;
