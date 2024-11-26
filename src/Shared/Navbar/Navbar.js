import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import Notification from "./Notification";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { ClimbingBoxLoader } from "react-spinners";
const Navbar = () => {
  const [theme, setTheme] = useState(null);
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const state = location.state;
  console.log(state);

  // const {
  //   data: notification = [],
  //   refetch,
  //   isLoading,
  // } = useQuery({
  //   queryKey: ["notification"],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `https://metromeal-server-tfxl.vercel.app/notification?email=${user?.email}`
  //     );
  //     const data = await res.json();
  //     return data;
  //   },
  // });

  // const notificationDelete = (id) => {
  //   fetch(`https://metromeal-server-tfxl.vercel.app/notification/${id}`, {
  //     method: "DELETE",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       if (data.deletedCount > 0) {
  //         refetch();
  //       }
  //     });
  // };
  useEffect(() => {
    if (window.matchMedia("{prefers-color-scheme : dark}").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((err) => {});
  };

  const menuItems = (
    <React.Fragment>
      {user?.uid ? (
        <></>
      ) : (
        <li>
          <Link
            to="/login"
            className="font-bold text-green-600 dark:text-white"
          >
            Login
          </Link>
        </li>
      )}
    </React.Fragment>
  );

  return (
    <div className="navbar bg-slate-800 dark:bg-slate-600">
      <div className="navbar-start">
        <div className="dropdown">
          {/* <label tabIndex={0} className="btn btn-ghost lg:hidden ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label> */}
          <ul
            // tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuItems}
          </ul>
        </div>
        <label
          tabIndex={2}
          htmlFor="my-drawer-2"
          className="btn btn-ghost text-green-600 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </label>
        <div className="flex items-center ">
          {/* <img src={logo} alt="logo" className="w-10" /> */}
          <Link
            to="/"
            className="text-green-600 btn  btn-ghost normal-case text-xl font-bold dark:text-white "
          >
            Metro Meal
          </Link>
        </div>
      </div>
      <div className="navbar-center  flex ">
        <ul className="menu menu-horizontal p-0">{menuItems}</ul>
      </div>
      <div className="navbar-end">
        {user?.uid ? (
          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator ">
                <div className="dropdown dropdown-left ">
                  {/* <label tabIndex={3}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </label>
                  <ul
                    tabIndex={3}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-96 "
                  >
                    {notification.length > 0 ? (
                      <>
                        {notification.map((n, i) => (
                          <li key={i}>
                            <div className="flex justify-between text-center">
                              <a>{n.msg}</a>
                              <button onClick={() => notificationDelete(n._id)}>
                                <FaTrashAlt className="text-red-400 "></FaTrashAlt>
                              </button>
                            </div>
                          </li>
                        ))}
                      </>
                    ) : (
                      <li>
                        <a>NO msg</a>
                      </li>
                    )}
                  </ul>
                  {notification.length > 0 ? (
                    <span className="badge badge-xs badge-success indicator-item">
                      {notification.length}
                    </span>
                  ) : (
                    <span className="badge badge-xs badge-success indicator-item">
                      0
                    </span>
                  )} */}
                </div>
              </div>
            </button>

            <p className="text-green-600 sm:font-semibold text-xs font-bold dark:text-white">
              {user.displayName}
            </p>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.photoURL} alt="userPhoto" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/dashboard">Profile</Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <Link to="/login" onClick={handleLogOut}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
            {/* <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoURL} alt="userPhoto" />
              </div>
            </div> */}
          </div>
        ) : (
          <Link to="/register" className="btn btn-primary">
            Get started
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
