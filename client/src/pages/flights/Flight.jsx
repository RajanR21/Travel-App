import "../hotel/hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Reserve from "./Reserve";

const Flight = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const BASEURL = process.env.REACT_APP_BASEURL;
  let [searchParams, setSearchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  console.log("session id", session_id);
  const navigate = useNavigate();

  // const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  // function dayDifference(date1, date2) {
  //   const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  //   const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
  //   return diffDays;
  // }

  const token = localStorage.getItem("user");
  console.log("flight ka id", id);
  const getFlightdata = async () => {
    let url = `${BASEURL}flights/${id}`;

    try {
      const res = await axios.get(url);
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };
  const {
    data,
    isSuccess: flightFlag,
    isLoading: loading,
  } = useQuery({
    queryKey: ["flights"],
    queryFn: async () => await getFlightdata(),
    keepPreviousData: true,
  });

  const { mutate: mutateSuccess } = useMutation({
    mutationFn: async (data) => {
      // console.log(session_id);
      let res = await axios.get(
        `${BASEURL}bookflights/success?session_id=${session_id}&flightId=${id}`,
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
      toast.success("Flight Booked Successfully");
      navigate("/flights");
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
            {session_id ? (
              <button className="bookNow" onClick={mutateSuccess}>
                Proceed To CheckOut
              </button>
            ) : (
              <button className="bookNow" onClick={handleClick}>
                Book Now!
              </button>
            )}
          </div>

          <h1 className="hotelTitle">{data?.airline_name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{data?.flight_number}</span>
          </div>
          <span className="hotelDistance">
            {data?.fromCity} to {data?.toCity}
          </span>
          <span className="hotelPriceHighlight">
            Book this flight at ${data?.price} - Enjoy your Journey
          </span>

          <div className="hotelDetails">
            <div className="hotelDetailsPrice">
              <h1>Flight Duration Will Be Of {data?.duration * 2}- Days</h1>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} flightId={id} />}
    </div>
  );
};

export default Flight;
