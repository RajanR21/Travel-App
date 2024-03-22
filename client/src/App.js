import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import { Toaster } from "react-hot-toast";
import VerifyOtp from "./components/auth/VerifyOtp";
import AllPackages from "./pages/package/AllPackages";
import Package from "./pages/package/Package";
import AllFlights from "./pages/flights/AllFlights";
import Flight from "./pages/flights/Flight";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/packages" element={<AllPackages />} />
        <Route path="/packages/:id" element={<Package />} />
        <Route path="/flights" element={<AllFlights />} />
        <Route path="/flights/:id" element={<Flight />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
