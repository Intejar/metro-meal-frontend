import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";
import NavbarHome from "../Shared/Navbar/NavbarHome";

const Main = () => {
  return (
    <div className="min-h-screen">
      <NavbarHome></NavbarHome>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default Main;
