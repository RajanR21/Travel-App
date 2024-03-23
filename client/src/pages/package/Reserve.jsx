import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Reserve = ({ setOpen, packageId }) => {
  const { dates, options } = useSelector((state) => state.package.filterData);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const token = localStorage.getItem("user");
  const BASEURL = process.env.REACT_APP_BASEURL;
  const getProductdata = async () => {
    let base = `${BASEURL}holidays/packages/${packageId}`;

    let url = ``;
    base += url;

    try {
      const res = await axios.get(base);
      console.log("andrrrrr", res?.data?.data);
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };
  const {
    data: item,
    isSuccess: hotelFlag,
    isLoading: loading,
  } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => await getProductdata(),
    keepPreviousData: true,
  });

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      let base = `${BASEURL}bookpackages/book-package/${packageId}`;

      const res = await axios.post(base, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("payment stripe ", res?.data);
      return res?.data;
    },
    onSuccess: async (data) => {
      if (!data.url) {
        toast.success(data?.message);
        navigate(`/packages/${packageId}`);
      }
      // console.log("data", data);
      else {
        toast.success("Now , You Can Proceed TO CheckOut");
        window.location.href = data?.url;
      }
    },
    onError: (err) => {
      toast.error(err.response.data.message);
      // handleError("Something went Wrong !!! Try again");
    },
  });

  // const getDatesInRange = (startDate, endDate) => {
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   const date = new Date(start.getTime());
  //   const dates = [];
  //   while (date <= end) {
  //     dates.push(new Date(date).getTime());
  //     date.setDate(date.getDate() + 1);
  //   }

  //   return dates;
  // };

  // const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "Rajan",
      phone: "123456789",
      email: "example@gmail.com",
      adult: options.adult,
      child: options.children,
    },
  });
  console.log("reserve", item, options);
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />

        <div className="rItem" key={item?._id}>
          <div className="rItemInfo">
            <form onSubmit={handleSubmit(mutate)}>
              <label className=""> Name</label>
              <input
                {...register("name")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {/* <p className="text-red-500 text-sm">
                {errors.firstName?.message}
              </p> */}
              <label className=""> Email</label>
              <input
                {...register("email")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {/* <p className="text-red-500 text-sm">{errors.email?.message}</p> */}
              <label className="mt-7"> Phone Number</label>
              <input
                {...register("phone")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {/* <p className="text-red-500 text-sm">{errors.password?.message}</p> */}
              <label className="mt-7"> Child</label>
              <input
                {...register("child")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <label className="mt-7"> Adult</label>
              <input
                {...register("adult")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />

              <button type="submit" className="rButton">
                Buy Package!
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reserve;
