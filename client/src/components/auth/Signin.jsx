import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
// import { Api } from "../../utils/Api";
import "./signIn.css";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../redux/authslices";
import toast from "react-hot-toast";
import { handleSignIn } from "../../controllers/authController.js";

// yup validation for the form data

let schema = yup.object({
  password: yup
    .string()
    .required("Password Required")
    .test(
      "len",
      "Password needs to be atleast 8 digits",
      (val) => !(val.toString().length < 8)
    ),

  email: yup.string().required("Email required").email("Invalid email address"),
});

function Signin() {
  const navigate = useNavigate();
  // let token = useSelector((state) => state?.auth?.token);
  const status = localStorage.getItem("status");

  // console.log(token, typeof token);
  // if (token != "null" && status == "true") {
  //   toast.success("You are already Logged in");
  //   // return;
  // }
  const dispatch = useDispatch();

  const { mutate } = useMutation({
    mutationFn: (data) => {
      return handleSignIn(data);
    },
    onSuccess: (data) => {
      localStorage.setItem("user", data?.token);
      dispatch(setToken(data?.token));

      toast.success("Login in Successfully");
      navigate("/");
    },
    onError: (err) => {
      if (err.response.status == 401) {
        navigate("/register");
      }
      // if (err.response.status == 402) {
      //   navigate("/verify-otp");
      // }
      toast.error(err?.response?.data?.message || "Erro While Login User");
      // handleError("Something went Wrong !!! Try again");
    },
  });

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      password: "123456789",
      email: "example@gmail.com",
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;
  return (
    <div className="signupscreen">
      {
        <div className="container mt-5 pl-96">
          <div className="innerContainer ">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <p className=" text-2xl text-black">Log IN</p>
            </div>

            <form onSubmit={handleSubmit(mutate)}>
              <label className=""> Email</label>
              <input
                {...register("email")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
              <label className="mt-7"> Password</label>
              <input
                {...register("password")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>

              <button
                type="submit"
                className="bg-blue-500 block mt-3 w-50%  bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  );
}

export default Signin;
