import "./navbar.css";
import { Link } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
const Navbar = () => {
  const user = localStorage.getItem("user");

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo text-3xl">Book My Trip</span>
        </Link>
        {user ? (
          user.username
        ) : (
          <div className="navItems">
            <Link
              to={"/register"}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Register
            </Link>
            <Link
              to={"/login"}
              style={{
                color: "inherit",
                textDecoration: "none",
                marginLeft: "3rem",
              }}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
