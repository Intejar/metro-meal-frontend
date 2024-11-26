import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Main";
import Home from "../../Pages/Home/Home/Home";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import DashboardLayout from "../../Layout/Dashboard";
import NumberVarification from "../../Pages/Register/NumberVarification";
import UserProfile from "../../Dashboard/UserProfile";
import Order from "../../Pages/Order";
import OrderSummary from "../../Pages/OrderSummary";
import OrderHistory from "../../Pages/OrderHistory";
import AllOrder from "../../Pages/Admin/AllOrder";
import AllUser from "../../Pages/Admin/AllUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        path: "/dashboard",
        element: <UserProfile></UserProfile>,
      },
      {
        path: "/dashboard/order",
        element: <Order></Order>,
      },
      {
        path: "/dashboard/orderSummary",
        element: <OrderSummary></OrderSummary>,
      },
      {
        path: "/dashboard/orderHistory",
        element: <OrderHistory></OrderHistory>,
      },
      {
        path: "/dashboard/bookedData",
        element: <AllOrder></AllOrder>,
      },
      {
        path: "/dashboard/allUser",
        element: <AllUser></AllUser>,
      },
    ],
  },
  {
    path: "/numberVarify",
    element: <NumberVarification></NumberVarification>,
  },
]);

export default router;
