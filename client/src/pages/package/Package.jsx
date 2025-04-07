import "../hotel/hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
// import { SearchContext } from "../../context/SearchContext";
// import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Reserve from "./Reserve";

const Package = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const BASEURL = process.env.REACT_APP_BASEURL;
  let [searchParams, setSearchParams] = useSearchParams();

  const session_id = searchParams.get("session_id");
  console.log("session id", session_id);
  // const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  // function dayDifference(date1, date2) {
  //   const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  //   const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
  //   return diffDays;
  // }
  // const user = localStorage.getItem("status");
  const token = localStorage.getItem("user");

  const getPackagedata = async () => {
    let url = `${BASEURL}holidays/packages/${id}`;

    try {
      const res = await axios.get(url);
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };
  const {
    data,
    isSuccess: packageFlag,
    isLoading: loading,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => await getPackagedata(),
    keepPreviousData: true,
  });

  const { mutate: mutateSuccess } = useMutation({
    mutationFn: async (data) => {
      console.log(session_id);
      let res = await axios.get(
        `${BASEURL}bookpackages/success?session_id=${session_id}&packageId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("success", res?.data?.data);
      return res?.data?.data;
    },
    onSuccess: (data) => {
      toast.success("Hotel Booked Successfully");
      navigate("/packages");
    },
    onError: (err) => {
      toast.error(err.response.data.message);
      // handleError("Something went Wrong !!! Try again");
    },
  });

  const handleClick = () => {
    if (!token) {
      toast.error("UnAuthorised , Login First");
      navigate("/login");
    }
    setOpenModal(true);
  };
  return (
    <div>
      <Navbar />
      <Header type="list" />
      {loading ? (
        "loading"
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
            </div>
          )}
          <div className="hotelWrapper">
            {session_id && (
              <button className="bookNow" onClick={mutateSuccess}>
                Proceed To CheckOut
              </button>
            )}
            <h1 className="hotelTitle">{data?.name}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data?.address}</span>
            </div>
            <span className="hotelDistance">
              {data?.city} , {data?.country}
            </span>
            <span className="hotelPriceHighlight">
              Book this packag at ${data?.price} - Enjoy your vacations
            </span>
            <div className="hotelImages">
              <img src={data?.image} alt="" className="hotelImg" />
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data?.name}</h1>
                <p className="hotelDesc">{data?.directions}</p>
              </div>
              <div className="hotelDetailsPrice">
                <h1>Perfect for a {data?.days}-night stay!</h1>
                <span>
                  Located in the real heart of Krakow, this property has an
                  excellent location score of 9.8!
                </span>
                <h2>({data?.days} nights)</h2>
                {!session_id && (
                  <button onClick={handleClick}>Buy Package!</button>
                )}
              </div>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} packageId={id} />}
    </div>
  );
};

export default Package;
