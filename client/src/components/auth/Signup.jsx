import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
// import { Api } from "../../utils/Api";
import "./signup.css";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { handleError, handleSignUp } from "../../controllers/authController";

//////// yup validation for the form data

let schema = yup.object({
  name: yup.string().required("Name required"),
  password: yup
    .string()
    .required("Password Required")
    .test(
      "len",
      "Password needs to be atleast 8 digits",
      (val) => !(val.toString().length < 8)
    ),

  confirmPassword: yup
    .string()
    .required("Required")
    .test(
      "len",
      "Zip code needs to be atleast 8 digits",
      (val) => !(val.toString().length < 8)
    )
    .oneOf([yup.ref("password"), null], "Password should be same !"),

  email: yup.string().required("Email required").email("Invalid email address"),
});

function Signup() {
  //   if (loading) return <h1>Loading...</h1>;
  const user = localStorage.getItem("status");
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return handleSignUp(data);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Register Successful");
      if (user != "true") localStorage.setItem("status", false);
      if (user == "false") navigate("/verify-otp");
    },
    onError: (err) => {
      toast.error(err.response.data.message);
      // handleError("Something went Wrong !!! Try again");
    },
  });
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "Rajan",
      password: "123456789",
      confirmPassword: "123456789",
      email: "example@gmail.com",
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;
  return (
    <div className="signupscreen">
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
            <p className=" text-2xl text-black">Signup</p>
          </div>

          <form onSubmit={handleSubmit(mutate)}>
            <label className=""> Name</label>
            <input
              {...register("name")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.firstName?.message}</p>
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
            <label className="mt-7"> Confirm Password</label>
            <input
              {...register("confirmPassword")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">
              {errors.confirmPassword?.message}
            </p>

            <button
              type="submit"
              className="bg-blue-500 block mt-3 w-50%  bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
