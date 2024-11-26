import { useQuery } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";
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

const PendingOrders = ({ data }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(null);
  const [btn, setBtn] = useState(false);
  const crntUserMail = user.email;
  const [selectedPlan, setSelectedPlan] = useState("");
  const qrRef = useRef();
  const orders = data;

  //   const {
  //     data: orders = [],
  //     refetch,
  //     isLoading,
  //   } = useQuery({
  //     queryFn: async () => {
  //       const res = await fetch(`https://metromeal-server-tfxl.vercel.app/pendingOrders`);
  //       const data = await res.json();
  //       return data;
  //     },
  //   });
  //   console.log("pending", orders);
  //   if (isLoading) {
  //     return (
  //       <div className="flex justify-center items-center">
  //         <ClimbingBoxLoader color="#36d7b7" />
  //       </div>
  //     );
  //   }
  //   console.log("data", orders);

  const handleApprove = (id) => {
    console.log("id", id);
    fetch(`https://metromeal-server-tfxl.vercel.app/pendingOrders/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ status: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("Order Approved!");
      });
  };
  return (
    <div role="tabpanel" className="tab-content p-10">
      <div>
        {orders.length > 0 ? (
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
                  Total Price
                </th>
                <th className="text-center text-white font-bold py-2">
                  Payment Method
                </th>
                <th className="text-center text-white font-bold py-2">
                  Trx ID
                </th>
                <th className="text-center text-white font-bold py-2">
                  Image Proof
                </th>
                <th className="text-center text-white font-bold py-2">
                  Action
                </th>

                {/* <th className="text-center text-white font-bold py-2">Delete</th> */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order._id} setEdit={setEdit} setBtn={setBtn}>
                  <td className="text-center text-sm p-1 border-b border-gray bg-white">
                    {order?.orderId}
                  </td>
                  <td className="text-center text-sm p-1 border-b border-gray bg-white">
                    {" "}
                    {order?.name}
                  </td>
                  <td className="text-center text-sm p-1 border-b border-gray bg-white">
                    {order?.email}
                  </td>

                  <td className="text-center text-sm p-1 border-b border-gray bg-white">
                    {order?.total}
                  </td>
                  <td className="text-center text-sm p-1 border-b border-gray bg-white">
                    {order?.paymentMethod}
                  </td>
                  <td className="text-center text-sm p-1 border-b border-gray bg-white">
                    {order?.trxId}
                  </td>
                  <td className="text-center text-sm p-1 border-b border-gray bg-white">
                    <div className="avatar">
                      <div className="w-24 rounded">
                        <img src={order?.imgLink} />
                      </div>
                    </div>
                  </td>
                  <td className="text-center text-sm p-1 border-b border-gray bg-white">
                    <button
                      className={`btn-xs rounded-md  text-white bg-red-800`}
                      onClick={() => handleApprove(order?._id)}
                    >
                      Aprrove
                    </button>
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
  );
};

export default PendingOrders;
