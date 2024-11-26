import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider/AuthProvider";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import "./Dashboard.css";
import NavLink from "./NavLink";
import BottomNavigation from "./BottomNavigation";
import Navbar from "../Shared/Navbar/Navbar";

const DashboardLayout = () => {
  const [theme, setTheme] = useState(null);
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState([]);
  const location = useLocation();
  console.log("e", user.email);
  useEffect(() => {
    fetch(`https://metromeal-server-tfxl.vercel.app/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserRole(data);
      });
  }, [user?.email]);
  const userInfo = userRole[0];
  console.log("d", userInfo);
  const isButtonActive = (path) => {
    return location.pathname === path;
  };
  const handleSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle " />
        <div className="drawer-content flex flex-col items-center justify-center bg-slate-900">
          <Outlet></Outlet>
        </div>
        <BottomNavigation></BottomNavigation>
        <div className="drawer-side position h-full">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay "
          ></label>
          <ul className="menu p-4 w-80 bg-slate-800 dark:bg-slate-700 text-base-content h-full">
            {userInfo?.role === "customer" && (
              <>
                <div className="flex items-center">
                  {/* <img src={logo} alt="logo" className="w-10" /> */}
                  <Link
                    to="/"
                    className="lg:hidden btn btn-ghost text-green-600 normal-case text-xl font-bold dark:text-white mb-10"
                  >
                    Metro Meal
                  </Link>
                </div>
                <li className="mb-2">
                  {" "}
                  <NavLink to="/dashboard">
                    <ClockIcon className="h-10 w-6 text-green-500" />
                    User Profile
                  </NavLink>
                </li>

                <li className="mb-2">
                  {" "}
                  <Link
                    className={`font-bold text-xl  dark:text-white  ${
                      isButtonActive("/dashboard/order")
                        ? "bg-green-800 text-white font-bold"
                        : "bg-white text-green-800  font-bold hover:bg-green-300"
                    }`}
                    to="/dashboard/order"
                  >
                    <ClockIcon className="h-10 w-6 text-green-500" /> Make Order
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className={`font-bold text-xl dark:text-white ${
                      isButtonActive("/dashboard/orderHistory")
                        ? "bg-green-800 text-white font-bold"
                        : "bg-white text-green-800  font-bold hover:bg-green-300"
                    }`}
                    to="/dashboard/orderHistory"
                  >
                    <UserGroupIcon className="h-10 w-6 text-green-500" />
                    Order History
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className={`font-bold text-xl dark:text-white ${
                      isButtonActive("/dashboard/notification")
                        ? "bg-green-800 text-white font-bold"
                        : "bg-white text-green-800  font-bold hover:bg-green-300"
                    }`}
                  >
                    <BellIcon className="h-10 w-6 text-green-500" />{" "}
                    Notification{" "}
                  </Link>
                </li>
                <li className="mt-20 ">
                  <label className="swap swap-rotate text-green-600 ">
                    <input onClick={handleSwitch} type="checkbox" />

                    <svg
                      className="swap-on fill-current w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>

                    <svg
                      className="swap-off fill-current w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                  </label>
                </li>
              </>
            )}
            {userInfo?.role === "admin" && (
              <>
                <li className="mb-2">
                  {" "}
                  <NavLink to="/dashboard">
                    <ClockIcon className="h-10 w-6 text-green-500" />
                    User Profile
                  </NavLink>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className={`font-bold text-xl  dark:text-white  ${
                      isButtonActive("/dashboard/bookedData")
                        ? "bg-green-800 text-white font-bold"
                        : "bg-white text-green-800  font-bold hover:bg-green-300"
                    }`}
                    to="/dashboard/bookedData"
                  >
                    <ClockIcon className="h-10 w-6 text-green-500" /> Order
                    History
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className={`font-bold text-xl  dark:text-white  ${
                      isButtonActive("/dashboard/allUser")
                        ? "bg-green-800 text-white font-bold"
                        : "bg-white text-green-800  font-bold hover:bg-green-300"
                    }`}
                    to="/dashboard/allUser"
                  >
                    <ClockIcon className="h-10 w-6 text-green-500" /> User List
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
