import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Import Heroicons v2 (Outline Icons)
import {
  HomeIcon,
  ShoppingCartIcon,
  BuildingLibraryIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard"); // Set initial active icon

  return (
    <div
      className="btm-nav bg-slate-800 lg:hidden"
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        zIndex: 600,
      }}
    >
      <button
        className={`text-green-800 ${currentPath === "/" ? "active" : ""}`}
        onClick={() => {
          navigate("/");
        }}
      >
        <HomeIcon className="h-5 w-5" />
      </button>

      <button
        className={`text-green-800 ${
          currentPath === "/dashboard/order" ? "active" : ""
        }`}
        onClick={() => {
          navigate("/dashboard/order");
        }}
      >
        <ShoppingCartIcon className="h-5 w-5" />
      </button>

      <button
        className={`text-green-800 ${
          currentPath === "/dashboard/orderHistory" ? "active" : ""
        }`}
        onClick={() => {
          navigate("/dashboard/orderHistory");
          setActive("orderHistory");
        }}
      >
        <ClockIcon className="h-5 w-5" />
      </button>

      <button
        className={`text-green-800 ${
          currentPath === "/dashboard" ? "active" : ""
        }`}
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        <UserIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default BottomNavigation;
