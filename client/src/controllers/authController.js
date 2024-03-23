import axios from "axios";
import toast from "react-hot-toast";
const BASEURL = process.env.REACT_APP_BASEURL;

//  Sign up form.........................

export async function handleSignUp(data) {
  console.log("inside signup handler", data);
  try {
    const res = await axios.post(`${BASEURL}user/register`, data);
    console.log(res.data);
    localStorage.setItem("user", res.data.token);

    return res.data;
  } catch (error) {
    throw error;
  }
}

// Sign In form .................

export async function handleSignIn(data) {
  console.log("inside signin handler", data, process.env.REACT_APP_BASEURL);
  try {
    const res = await axios.post(`${BASEURL}user/login`, data);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

//  // Sign In for Admin  .................

// export async function handleAdminLogin(data) {
//   console.log("inside adminlogin handler", data);
//   try {
//     const res = await axios.post(`${BASEURL}auth/login_admin`, data);
//     console.log(res.data);
//     localStorage.setItem("user", res.data.token);
//     return res.data;
//   } catch (error) {
//     throw error;
//   }
// }

// error handler.............................

export function handleError(err) {
  console.log(err);
  toast.error(err.response.data.message);
}
