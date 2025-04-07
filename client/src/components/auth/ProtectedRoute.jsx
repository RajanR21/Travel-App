import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const BASEURL = process.env.REACT_APP_BASEURL;
    const token = localStorage.getItem("user");
    if (!token) return setIsAuth(false);

    axios
      .get(`${BASEURL}holidays/all-packages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => setIsAuth(true))
      .catch(() => {
        localStorage.removeItem("user");
        setIsAuth(false);
      });
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  return isAuth ? children : <Navigate to="/login" />;
}
