import "../list/list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
// import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { setPackages } from "../../redux/packageslices";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@material-tailwind/react";
import SinglePackage from "./SinglePackage";
import { SimplePagination } from "../../components/Pagination";

const AllPackages = () => {
  const queryClient = useQueryClient();
  const BASEURL = process.env.REACT_APP_BASEURL;
  //   const [dates, setDates] = useState(
  //     useSelector((state) => state.hotel.filterData.dates)
  //   );
  //   const [openDate, setOpenDate] = useState(false);
  //   const { destination, options } = useSelector(
  //     (state) => state.hotel.filterData
  //   );
  const [active, setActive] = useState(1);
  const [highToLowValue, sethighToLow] = useState(false);
  const [lowToHighValue, setlowToHigh] = useState(false);
  const dispatch = useDispatch();
  let url = ``;

  const getPackagedata = async () => {
    const data = getValues();
    console.log("form dta", data);
    let base = `${BASEURL}holidays/all-packages`;

    url = ``;

    if (
      data.city ||
      data.minPrice ||
      data.minDay ||
      data.lowToHigh == true ||
      data.highToLow == true
    )
      url += "?";

    if (data?.city) {
      url += `city=${data?.city}`;
      if (data?.minDay) url += `&minDay=${data?.minDay}`;
      if (data?.minPrice) url += `&minPrice=${data?.minPrice}`;
      if (data?.lowToHigh) url += `&lowToHigh=${data.lowToHigh}`;
      if (data?.highToLow) url += `&highToLow=${data.highToLow}`;
    } else if (data?.minDay) {
      url += `minDay=${data?.minDay}`;
      if (data?.city) url += `&city=${data?.city}`;
      if (data?.minPrice) url += `&minPrice=${data?.minPrice}`;
      if (data?.lowToHigh) url += `&lowToHigh=${data.lowToHigh}`;
      if (data?.highToLow) url += `&highToLow=${data.highToLow}`;
    } else if (data?.minPrice) {
      url += `minPrice=${data.minPrice}`;
      if (data?.city) url += `&city=${data?.city}`;
      if (data?.minDay) url += `&minDay=${data?.minDay}`;
      if (data?.lowToHigh) url += `&lowToHigh=${data.lowToHigh}`;
      if (data?.highToLow) url += `&highToLow=${data.highToLow}`;
    } else if (data?.lowToHigh == true) {
      url += `lowToHigh=${data.lowToHigh}`;
      if (data?.city) url += `&city=${data?.city}`;
      if (data?.minDay) url += `&minDay=${data?.minDay}`;
      if (data?.minPrice) url += `&minPrice=${data?.minPrice}`;
    } else if (data?.highToLow == true) {
      url += `highToLow=${data.highToLow}`;
      if (data?.city) url += `&city=${data?.city}`;
      if (data?.minDay) url += `&minDay=${data?.minDay}`;
      if (data?.minPrice) url += `&minPrice=${data?.minPrice}`;
    }

    if (
      !data.minDay &&
      !data.city &&
      !data.minPrice &&
      !data.lowToHigh &&
      !data.highToLow
    ) {
      url += `?page=${active}`;
    } else {
      url += `&page=${active}`;
    }
    base += url;

    try {
      const res = await axios.get(base);
      dispatch(setPackages(res?.data?.data));
      return res?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: packages,
    isSuccess: packagesFlag,
    isLoading: loading,
  } = useQuery({
    queryKey: ["packages", active],
    queryFn: async () => await getPackagedata(),
    keepPreviousData: true,
  });

  if (packagesFlag) {
    // window.location.search = url;
    console.log("packages fatched ", packages);
  }

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    defaultValues: {
      city: "",
      minPrice: 0,
      minDay: 0,
      lowToHigh: lowToHighValue,
      highToLow: highToLowValue,
    },
  });

  function onSubmit(data) {
    console.log("log hauaaa", getValues());
    queryClient.invalidateQueries("packages");
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
              <label>Filter</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Minimum price</span>
                  <input
                    type="number"
                    {...register("minPrice")}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Minimum Days</span>
                  <input
                    type="number"
                    {...register("minDay")}
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
              </div>
            </div>

            <button type="submit">Search</button>
          </form>
          <div className="listResult">
            {loading ? (
              "loading"
            ) : packages?.data?.length != 0 ? (
              <>
                {packages?.data?.map((item, ind) => {
                  return <SinglePackage item={item} key={item._id} />;
                })}
              </>
            ) : (
              <h1 className=" text-3xl text-center text-nowrap">
                No Data , Found
              </h1>
            )}

            {packages?.data?.length != 0 && (
              <div className="pagination">
                <SimplePagination
                  active={active}
                  setActive={setActive}
                  totalPage={packages?.paging?.pages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPackages;
