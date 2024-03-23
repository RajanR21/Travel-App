import "../list/list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
// import { setflights } from "../../redux/flightslices";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@material-tailwind/react";
import { setFlights } from "../../redux/flightslice";
import SingleFlight from "./SingleFlight";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { SimplePagination } from "../../components/Pagination";

const AllFlights = () => {
  const queryClient = useQueryClient();
  const BASEURL = process.env.REACT_APP_BASEURL;

  const navigate = useNavigate();
  //   const [dates, setDates] = useState(
  //     useSelector((state) => state.hotel.filterData.dates)
  //   );
  //   const [openDate, setOpenDate] = useState(false);
  //   const { destination, options } = useSelector(
  //     (state) => state.hotel.filterData
  //   );
  const [active, setActive] = useState(1);
  const [fastestValue, setfastest] = useState(false);
  const [cheapestValue, setcheapest] = useState(false);
  const token = localStorage.getItem("user");
  const dispatch = useDispatch();
  let url = ``;

  const getPackagedata = async () => {
    const data = getValues();
    console.log("form dta", data);
    let base = `${BASEURL}flights/all-flights`;

    url = ``;

    if (
      data.source ||
      data.destination ||
      data.noOfStops ||
      data.cheapest == true ||
      data.fastest == true
    )
      url += "?";

    if (data?.source) {
      url += `source=${data?.source}`;
      if (data?.noOfStops) url += `&noOfStops=${data?.noOfStops}`;
      if (data?.destination) url += `&destination=${data?.destination}`;
      if (data?.cheapest) url += `&cheapest=${data.cheapest}`;
      if (data?.fastest) url += `&fastest=${data.fastest}`;
    } else if (data?.noOfStops) {
      url += `noOfStops=${data?.noOfStops}`;
      if (data?.source) url += `&source=${data?.source}`;
      if (data?.destination) url += `&destination=${data?.destination}`;
      if (data?.cheapest) url += `&cheapest=${data.cheapest}`;
      if (data?.fastest) url += `&fastest=${data.fastest}`;
    } else if (data?.destination) {
      url += `destination=${data.destination}`;
      if (data?.source) url += `&source=${data?.source}`;
      if (data?.noOfStops) url += `&noOfStops=${data?.noOfStops}`;
      if (data?.cheapest) url += `&cheapest=${data.cheapest}`;
      if (data?.fastest) url += `&fastest=${data.fastest}`;
    } else if (data?.cheapest == true) {
      url += `cheapest=${data.cheapest}`;
      if (data?.source) url += `&source=${data?.source}`;
      if (data?.noOfStops) url += `&noOfStops=${data?.noOfStops}`;
      if (data?.destination) url += `&destination=${data?.destination}`;
    } else if (data?.fastest == true) {
      url += `fastest=${data.fastest}`;
      if (data?.source) url += `&source=${data?.source}`;
      if (data?.noOfStops) url += `&noOfStops=${data?.noOfStops}`;
      if (data?.destination) url += `&destination=${data?.destination}`;
    }

    if (
      !data.noOfStops &&
      !data.source &&
      !data.destination &&
      !data.cheapest &&
      !data.fastest
    ) {
      url += `?page=${active}`;
    } else {
      url += `&page=${active}`;
    }
    // window.location.search = url;
    base += url;

    try {
      const res = await axios.get(base);
      dispatch(setFlights(res?.data?.data));
      return res?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: flights,
    isSuccess: flightsFlag,
    isLoading: loading,
  } = useQuery({
    queryKey: ["flights", active],
    queryFn: async () => await getPackagedata(),
    keepPreviousData: true,
  });

  if (flightsFlag) {
    console.log("flights fatched ", flights);
  }

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    defaultValues: {
      source: "",
      destination: "",
      noOfStops: 0,
      cheapest: cheapestValue,
      fastest: fastestValue,
    },
  });

  function onSubmit(data) {
    console.log("log hauaaa", getValues());
    queryClient.invalidateQueries("flights");
  }
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <form className="listSearch" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="lsTitle">Get Your Desired Flight</h1>
            <div className="lsItem">
              <label>Source</label>
              <input
                {...register("source")}
                placeholder={getValues("source")}
                type="text"
              />
            </div>
            <div className="lsItem">
              <label>Destination</label>
              <input
                {...register("destination")}
                placeholder={getValues("destination")}
                type="text"
              />
            </div>

            <div className="lsItem">
              <label>Filter</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Minimum Stops</span>
                  <input
                    type="number"
                    {...register("noOfStops")}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <label className="mt-3">Cheapest</label>
                  <Checkbox
                    {...register("cheapest")}
                    color="blue"
                    checked={cheapestValue}
                    onChange={() => setcheapest(!cheapestValue)}
                  />
                </div>
                <div className="lsOptionItem">
                  <label className="mt-3">Fastest</label>
                  <Checkbox
                    {...register("fastest")}
                    color="blue"
                    chekced={fastestValue}
                    onChange={() => setfastest(!fastestValue)}
                  />
                </div>
              </div>
            </div>

            <button type="submit">Search</button>
          </form>
          <div className="listResult">
            {loading ? (
              "loading"
            ) : flights?.data?.length != 0 ? (
              <>
                {flights?.data?.map((item, ind) => {
                  return <SingleFlight item={item} key={item._id} />;
                })}
              </>
            ) : (
              <h1 className=" text-3xl text-center text-nowrap">
                No Data , Found
              </h1>
            )}
            {flights?.data?.length != 0 && (
              <div className="pagination">
                <SimplePagination
                  active={active}
                  setActive={setActive}
                  totalPage={flights?.paging?.pages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFlights;
