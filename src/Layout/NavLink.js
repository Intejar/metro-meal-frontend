import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children }) => {
  const location = useLocation();

  // Function to determine if the link is active
  const isButtonActive = (path) => location.pathname === path;
  return (
    <Link
      to={to}
      className={`font-bold text-xl hover:bg-green-800 dark:text-white ${
        isButtonActive(to)
          ? "bg-green-800 text-white font-bold hover:bg-green-800 hover:text-white"
          : "bg-white text-green-800 font-bold hover:bg-green-300"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
