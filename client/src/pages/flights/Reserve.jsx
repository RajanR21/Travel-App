import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

let schema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),

  adult: Yup.number()
    .required("Adult count is required")
    .min(0, "Adult count cannot be negative")
    .integer("Adult count must be an integer"),

  child: Yup.number()
    .required("Child count is required")
    .min(0, "Child count cannot be negative")
    .integer("Child count must be an integer"),
});
const Reserve = ({ setOpen, flightId }) => {
  console.log("mil gayaa", flightId);
  // const { dates, options } = useSelector((state) => state.package.filterData);
  const token = localStorage.getItem("user");
  const BASEURL = process.env.REACT_APP_BASEURL;

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      let base = `${BASEURL}bookflights/book-flight/${flightId}`;

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
        navigate(`/flights/${flightId}`);
      }
      // console.log("data", data);
      else {
        toast.success("Now , You Can Proceed TO CheckOut");
        window.location.href = data?.url;
      }
      // navigate("/verify-otp");
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
      email: "example@gmail.com",
      adult: 1,
      child: 0,
    },

    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  // console.log("reserve", item);
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />

        <div className="rItem" key={flightId}>
          <div className="rItemInfo">
            <form onSubmit={handleSubmit(mutate)}>
              <label className=""> Name</label>
              <input
                {...register("name")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
              <label className=""> Email</label>
              <input
                {...register("email")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>

              <label className="mt-7"> Child</label>
              <input
                {...register("child")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-red-500 text-sm">{errors.child?.message}</p>
              <label className="mt-7"> Adult</label>
              <input
                {...register("adult")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-red-500 text-sm">{errors.adult?.message}</p>

              <button type="submit" className="rButton">
                Book Flight!
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reserve;
