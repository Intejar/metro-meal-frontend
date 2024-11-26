import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { AuthContext } from "../../../Context/AuthProvider/AuthProvider";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import QRCodeGenerator from "./QrcodeGenerator";
import PendingOrders from "./PendingOrders";
import QRCodeScanner from "./QrScanner";
import Scanner from "./Scanner";

const AllOrder = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(null);
  const [btn, setBtn] = useState(false);
  const crntUserMail = user.email;
  const [selectedPlan, setSelectedPlan] = useState("");
  const qrRef = useRef();
  const [products, setProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);

  // const {
  //   data: products = [],
  //   refetch,
  //   isLoading,
  // } = useQuery({
  //   queryFn: async () => {
  //     const res = await fetch(`https://metromeal-server-tfxl.vercel.app/approvedOrders`);
  //     const data = await res.json();
  //     return data;
  //   },
  // });
  useEffect(() => {
    fetch(`https://metromeal-server-tfxl.vercel.app/approvedOrders`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);
  useEffect(() => {
    fetch(`https://metromeal-server-tfxl.vercel.app/pendingOrders`)
      .then((res) => res.json())
      .then((data) => {
        setPendingProducts(data);
      });
  }, []);

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center">
  //       <ClimbingBoxLoader color="#36d7b7" />
  //     </div>
  //   );
  // }
  console.log("data", products);

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  console.log(today);
  const todayOrders = products
    .map((order) => {
      const todayMeals = order.mealData.filter(
        (meal) => meal.date === today && order.mealPlan === selectedPlan
      );
      return todayMeals.length > 0 ? { ...order, todayMeals } : null;
    })
    .filter((order) => order !== null); // Remove any null values

  const downloadPDF = () => {
    const doc = new jsPDF();
    console.log("doc", doc);
    html2canvas(qrRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10);
      doc.save("qr-code.pdf");
    });
  };
  return (
    <div>
      <div className="overflow-x-auto mx-5 min-h-screen mt-5">
        <div role="tablist" className="tabs tabs-bordered">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-green-600"
            aria-label="Today's Order"
            defaultChecked
          />
          <div role="tabpanel" className="tab-content p-10">
            <div role="tablist" className="tabs tabs-lifted">
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab text-green-600"
                aria-label="Student Plan"
                onClick={() => setSelectedPlan("Student Plan")}
                defaultChecked
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                <div>
                  {products.length > 0 ? (
                    <table className="table w-full border-collapse border border-gray sm:table-auto sm:text-left">
                      <thead>
                        <tr className="bg-green">
                          <th className="text-center text-green font-bold py-2">
                            Date
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Order ID
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Customer Name
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Customer Email
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Meal Plan
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Lunch
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Dinner
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Container Return
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Download QR
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayOrders.length > 0 ? (
                          todayOrders.map((order, index) =>
                            order.todayMeals.map((meal, mealIndex) => (
                              <tr
                                key={`${index}-${mealIndex}`}
                                className="text-center"
                              >
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {meal.date}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.orderId}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.name}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.email}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.mealPlan}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {meal.lunchMealNumber}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {meal.dinnerMealNumber}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.containerReturnData}
                                </td>
                                <td className="">
                                  <QRCodeGenerator
                                    value={`${order.orderId},${order.container}`} // Include both order ID and container
                                    order={order}
                                  />
                                </td>
                              </tr>
                            ))
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="border border-gray-500 px-4 py-2 text-center"
                            >
                              No meals for today
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan="5"
                            className="text-sm p-1 border-b border-gray bg-white text-right"
                          >
                            Total Order Value:
                          </td>
                          <td className="text-center text-sm p-1 border-b border-gray bg-white">
                            {todayOrders.reduce((total, order) => {
                              const todayMeals = order.mealData.filter(
                                (meal) => meal.date === today
                              );
                              return (
                                total +
                                todayMeals.reduce(
                                  (sum, meal) => sum + meal.lunchMealNumber,
                                  0
                                )
                              );
                            }, 0)}
                          </td>
                          <td className="text-center text-sm p-1 border-b border-gray bg-white">
                            {todayOrders.reduce((total, order) => {
                              const todayMeals = order.mealData.filter(
                                (meal) => meal.date === today
                              );
                              return (
                                total +
                                todayMeals.reduce(
                                  (sum, meal) => sum + meal.dinnerMealNumber,
                                  0
                                )
                              );
                            }, 0)}
                          </td>
                          <td className="text-center text-sm p-1 border-b border-gray bg-white"></td>
                        </tr>
                      </tfoot>
                    </table>
                  ) : (
                    <h1 className="text-center text-3xl text-gray-400 my-20 font-bold">
                      No Order Available!
                    </h1>
                  )}
                </div>
              </div>

              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab text-green-600"
                aria-label="Corporate Plan"
                onClick={() => setSelectedPlan("Corporate Plan")}
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                <div>
                  {products.length > 0 ? (
                    <table className="table w-full border-collapse border border-gray sm:table-auto  sm:text-left">
                      <thead>
                        <tr className="bg-green">
                          <th className="text-center text-green font-bold py-2">
                            Date
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Order ID
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Customer Name
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Customer Email
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Meal Plan
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Lunch
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Dinner
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Container Return
                          </th>
                          <th className="text-center text-green font-bold py-2">
                            Download QR
                          </th>
                          {/* <th className="text-center text-white font-bold py-2">Delete</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {todayOrders.length > 0 ? (
                          todayOrders.map((order, index) =>
                            order.todayMeals.map((meal, mealIndex) => (
                              <tr
                                key={`${index}-${mealIndex}`}
                                className="text-center"
                              >
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {meal.date}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.orderId}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.name}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.email}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.mealPlan}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {meal.lunchMealNumber}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {meal.dinnerMealNumber}
                                </td>
                                <td className="text-center text-sm p-1 border-b border-gray bg-white">
                                  {order.containerReturnData}
                                </td>
                                <td className="">
                                  <QRCodeGenerator
                                    value={`${order.orderId},${order.container}`}
                                  />
                                </td>
                              </tr>
                            ))
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="border border-gray-500 px-4 py-2 text-center"
                            >
                              No meals for today
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan="5"
                            className=" text-sm p-1 border-b border-gray bg-white text-right"
                          >
                            Total Order Value:
                          </td>
                          <td className="text-center text-sm p-1 border-b border-gray bg-white">
                            {todayOrders.reduce((total, order) => {
                              const todayMeals = order.mealData.filter(
                                (meal) => meal.date === today
                              );
                              return (
                                total +
                                todayMeals.reduce(
                                  (sum, meal) => sum + meal.lunchMealNumber,
                                  0
                                )
                              );
                            }, 0)}
                          </td>
                          <td className="text-center text-sm p-1 border-b border-gray bg-white">
                            {todayOrders.reduce((total, order) => {
                              const todayMeals = order.mealData.filter(
                                (meal) => meal.date === today
                              );
                              return (
                                total +
                                todayMeals.reduce(
                                  (sum, meal) => sum + meal.dinnerMealNumber,
                                  0
                                )
                              );
                            }, 0)}
                          </td>
                          <td className="text-center text-sm p-1 border-b border-gray bg-white"></td>
                        </tr>
                      </tfoot>
                    </table>
                  ) : (
                    <h1 className="text-center text-3xl text-gray-400 my-20 font-bold">
                      No Order Available!
                    </h1>
                  )}
                </div>
              </div>
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-green-600"
            aria-label="Order History"
          />
          <div role="tabpanel" className="tab-content p-10">
            <div>
              {products.length > 0 ? (
                <table className="table w-full border-collapse border border-gray sm:table-auto  sm:text-left">
                  <thead>
                    <tr className="bg-green">
                      <th className="text-center text-white font-bold py-2">
                        Order ID
                      </th>
                      <th className="text-center text-white font-bold py-2">
                        Customer Name
                      </th>
                      <th className="text-center text-white font-bold py-2">
                        Customer Email
                      </th>
                      <th className="text-center text-white font-bold py-2">
                        Order Data
                      </th>
                      <th className="text-center text-white font-bold py-2">
                        Order Plan
                      </th>
                      <th className="text-center text-white font-bold py-2">
                        Total Container
                      </th>
                      <th className="text-center text-white font-bold py-2">
                        Container Return
                      </th>
                      <th className="text-center text-white font-bold py-2">
                        Total Price
                      </th>
                      {/* <th className="text-center text-white font-bold py-2">Delete</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, i) => (
                      <tr key={product._id} setEdit={setEdit} setBtn={setBtn}>
                        <td className="text-center text-sm p-1 border-b border-gray bg-white">
                          {product?.orderId}
                        </td>
                        <td className="text-center text-sm p-1 border-b border-gray bg-white">
                          {" "}
                          {product?.name}
                        </td>
                        <td className="text-center text-sm p-1 border-b border-gray bg-white">
                          {product?.email}
                        </td>
                        <td className="text-center text-sm p-1 border-b border-gray bg-white">
                          {product?.mealData.map((meal, index) => (
                            <div key={index}>
                              {`${meal.date} (lunch-${meal.lunchMealNumber}, dinner-${meal.dinnerMealNumber})`}
                              {/* Add a horizontal line for separation except for the last meal */}
                              {index < product.mealData.length - 1 && (
                                <hr className="border-gray-300 my-1" />
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="text-center text-sm p-1 border-b border-gray bg-white">
                          {product?.mealPlan}
                        </td>
                        <td className="text-center text-sm p-1 border-b border-gray bg-white">
                          {product?.container}
                        </td>
                        <td className="text-center text-sm p-1 border-b border-gray bg-white">
                          {product?.containerReturn}
                        </td>
                        <td className="text-center text-sm p-1 border-b border-gray bg-white">
                          {product?.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <h1 className="text-center text-3xl text-gray-400 my-20 font-bold">
                  No Order Available!
                </h1>
              )}
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-green-600 text-md"
            aria-label="Pending Orders"
          />

          <PendingOrders data={pendingProducts}></PendingOrders>
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-green-600 text-md"
            aria-label="QR Scanner"
          />
          <div role="tabpanel" className="tab-content p-10">
            <Scanner></Scanner>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrder;
