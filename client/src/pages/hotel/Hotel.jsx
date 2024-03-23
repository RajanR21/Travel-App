import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
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
import Reserve from "../../components/reserve/Reserve";
import { useSelector } from "react-redux";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Hotel = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const BASEURL = process.env.REACT_APP_BASEURL;
  const token = localStorage.getItem("user");
  let [searchParams, setSearchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  console.log("session id", session_id);
  // const { user } = useContext(AuthContext);
  const user = localStorage.getItem("status");
  const navigate = useNavigate();

  const { dates, options } = useSelector((state) => state.hotel.filterData);
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0].endDate, dates[0].startDate);

  const getHoteldata = async () => {
    console.log("form dta", data);
    let base = `${BASEURL}hotels/${id}`;

    let url = ``;

    base += url;

    try {
      const res = await axios.get(base);
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };
  const {
    data,
    isSuccess: hotelFlag,
    isLoading: loading,
  } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => await getHoteldata(),
    keepPreviousData: true,
  });

  const { mutate: mutateSuccess } = useMutation({
    mutationFn: async (data) => {
      console.log(session_id);
      let res = await axios.get(
        `${BASEURL}bookhotels/success?session_id=${session_id}&hotelId=${id}`,
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
      navigate("/hotels");
    },
    onError: (err) => {
      toast.error(err.response.data.message);
      // handleError("Something went Wrong !!! Try again");
    },
  });

  const handleClick = () => {
    if (!user) {
    }
    if (user == "true") {
      setOpenModal(true);
    } else {
      if (!token) {
        toast.error("UnAuthorised , Register First");
        navigate("/register");
      }

      if (user == "false") {
        toast.error("UnAuthorised , Login First");
        navigate("/login");
      }
    }
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
              Book a stay over ${data?.price} at this property and get a free
              airport taxi
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
                <h1>Perfect for a {data?.rating * 5}-night stay!</h1>
                <span>
                  Located in the real heart of Krakow, this property has an
                  excellent location score of 9.8!
                </span>
                <h2>
                  <b>${data?.rating * data?.price * 5}</b> ({data?.rating * 5}{" "}
                  nights)
                </h2>
                {!session_id && (
                  <button onClick={handleClick}>Book Now!</button>
                )}
              </div>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id} />}
    </div>
  );
};

export default Hotel;
