import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const BASEURL = process.env.REACT_APP_BASEURL;

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    const token = localStorage.getItem("user");
    const obj = { otp: otp, token: token };

    try {
      const res = await axios.post(`${BASEURL}user/verifyotp`, obj);
      console.log(res.data);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const { mutate } = useMutation({
    mutationFn: () => {
      return handleVerify();
    },
    onSuccess: () => {
      toast.success("Otp Verified Successfuly");

      navigate("/login");
    },
    onError: (err) => {
      if (err.response.status == 401) {
        navigate("/register");
      }
      toast.error(err.response.data.message);
      // handleError("Something went Wrong !!! Try again");
    },
  });
  return (
    <div className="App">
      <h2>OTP verification screen in React - </h2>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderSeparator={<span> </span>}
        inputType="tel"
        containerStyle={{ display: "unset" }}
        inputStyle={{ width: "3rem", height: "3.5rem" }}
        renderInput={(props) => <input {...props} className="otp-input" />}
      />
      <div className="btn-container">
        <button onClick={mutate}>Verify OTP</button>
      </div>
    </div>
  );
}

export default VerifyOtp;
