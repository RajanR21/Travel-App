import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { setFilterData, sethotels } from "../../redux/hotelslices";
import { useDispatch, useSelector } from "react-redux";
import { faChampagneGlasses } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "@material-tailwind/react";
import { SimplePagination } from "../../components/Pagination";

const List = () => {
  const queryClient = useQueryClient();
  const BASEURL = process.env.REACT_APP_BASEURL;
  const location = useLocation();
  const [dates, setDates] = useState(
    useSelector((state) => state.hotel.filterData.dates)
  );
  const [openDate, setOpenDate] = useState(false);
  const { destination, options } = useSelector(
    (state) => state.hotel.filterData
  );
  const [active, setActive] = useState(1);
  const [highToLowValue, sethighToLow] = useState(false);
  const [lowToHighValue, setlowToHigh] = useState(false);
  const dispatch = useDispatch();
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  let url = ``;

  const getProductdata = async () => {
    const data = getValues();
    console.log("form dta", data);
    let base = `${BASEURL}hotels/all-hotels`;

    url = ``;

    if (
      data.city ||
      data.startingFrom ||
      data.minRating ||
      data.lowToHigh == true ||
      data.highToLow == true
    )
      url += "?";

    if (data?.city) {
      url += `city=${data?.city}`;
      if (data?.minRating) url += `&minRating=${data?.minRating}`;
      if (data?.startingFrom) url += `&startingFrom=${data?.startingFrom}`;
      if (data?.lowToHigh) url += `&lowToHigh=${data.lowToHigh}`;
      if (data?.highToLow) url += `&highToLow=${data.highToLow}`;
    } else if (data?.minRating) {
      url += `minRating=${data?.minRating}`;
      if (data?.city) url += `&city=${data?.city}`;
      if (data?.startingFrom) url += `&startingFrom=${data?.startingFrom}`;
      if (data?.lowToHigh) url += `&lowToHigh=${data.lowToHigh}`;
      if (data?.highToLow) url += `&highToLow=${data.highToLow}`;
    } else if (data?.startingFrom) {
      url += `startingFrom=${data.startingFrom}`;
      if (data?.city) url += `&city=${data?.city}`;
      if (data?.minRating) url += `&minRating=${data?.minRating}`;
      if (data?.lowToHigh) url += `&lowToHigh=${data.lowToHigh}`;
      if (data?.highToLow) url += `&highToLow=${data.highToLow}`;
    } else if (data?.lowToHigh == true) {
      url += `lowToHigh=${data.lowToHigh}`;
      if (data?.city) url += `&city=${data?.city}`;
      if (data?.minRating) url += `&minRating=${data?.minRating}`;
      if (data?.startingFrom) url += `&startingFrom=${data?.startingFrom}`;
    } else if (data?.highToLow == true) {
      url += `highToLow=${data.highToLow}`;
      if (data?.city) url += `&city=${data?.city}`;
      if (data?.minRating) url += `&minRating=${data?.minRating}`;
      if (data?.startingFrom) url += `&startingFrom=${data?.startingFrom}`;
    }

    if (
      !data.minRating &&
      !data.city &&
      !data.startingFrom &&
      !data.lowToHigh
    ) {
      url += `?page=${active}`;
    } else {
      url += `&page=${active}`;
    }
    base += url;

    try {
      const res = await axios.get(base);
      dispatch(sethotels(res?.data?.data));
      return res?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: hotels,
    isSuccess: hotelsFlag,
    isLoading: loading,
  } = useQuery({
    queryKey: ["hotels", active],
    queryFn: async () => await getProductdata(),
    keepPreviousData: true,
  });

  if (hotelsFlag) {
    // window.location.search = url;
    console.log("hotels fatched ", hotels);
  }

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    defaultValues: {
      city: destination,
      startingFrom: 0,
      minRating: 0,
      lowToHigh: lowToHighValue,
      highToLow: highToLowValue,
      dates: dates,
      options: options,
    },
  });

  function onSubmit(data) {
    console.log("log hauaaa", getValues());
    queryClient.invalidateQueries("hotels");
  }
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <form className="listSearch" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>City</label>
              <input
                {...register("city")}
                placeholder={getValues("city")}
                type="text"
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0]?.startDate,
                "MM/dd/yyyy"
              )} to ${format(dates[0]?.endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  {...register("dates")}
                  onChange={(item) => {
                    console.log("dates", item.selection);
                    dispatch(
                      setFilterData({
                        options,
                        destination,
                        dates: [item.selection],
                      })
                    );
                    setDates([item.selection]);

                    return setValue("dates", item.selection);
                  }}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Min price</span>
                  <input
                    type="number"
                    {...register("startingFrom")}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Min Ratings</span>
                  <input
                    type="number"
                    {...register("minRating")}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <label className="mt-3">Low To High</label>
                  <Checkbox
                    {...register("lowToHigh")}
                    color="blue"
                    checked={lowToHighValue}
                    onChange={() => setlowToHigh(!lowToHighValue)}
                  />
                </div>
                <div className="lsOptionItem">
                  <label className="mt-3">High To Low</label>
                  <Checkbox
                    {...register("highToLow")}
                    color="blue"
                    chekced={highToLowValue}
                    onChange={() => sethighToLow(!highToLowValue)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>

            <button type="submit">Search</button>
          </form>
          <div className="listResult">
            {loading ? (
              "loading"
            ) : hotels?.data?.length != 0 ? (
              <>
                {hotels?.data?.map((item, ind) => {
                  return <SearchItem item={item} key={item._id} />;
                })}
              </>
            ) : (
              <h1 className=" text-3xl text-center text-nowrap">
                No Data , Found
              </h1>
            )}
            {hotels?.data?.length != 0 && (
              <div className="pagination">
                <SimplePagination
                  active={active}
                  setActive={setActive}
                  totalPage={hotels?.paging?.pages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
