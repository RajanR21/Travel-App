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
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels"
          element={
            <ProtectedRoute>
              <List />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <ProtectedRoute>
              <Hotel />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        {/* <Route path="/verify-otp" element={<VerifyOtp />} /> */}
        <Route
          path="/packages"
          element={
            <ProtectedRoute>
              <AllPackages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/packages/:id"
          element={
            <ProtectedRoute>
              <Package />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flights"
          element={
            <ProtectedRoute>
              <AllFlights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flights/:id"
          element={
            <ProtectedRoute>
              <Flight />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
