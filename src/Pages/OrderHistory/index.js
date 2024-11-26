import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaTrashAlt, FaDownload } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const crntUserMail = user?.email;
  const {
    data: bookings = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch(
        `https://metromeal-server-tfxl.vercel.app/orders?customerEmail=${crntUserMail}`
      );
      const data = await res.json();
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <ClimbingBoxLoader color="#36d7b7" />
      </div>
    );
  }

  const bookingDelete = (id, name, slot) => {
    const proceed = window.confirm(
      `Are you sure you want to delete ${name}, slot: ${slot}?`
    );
    if (proceed) {
      fetch(`https://metromeal-server-tfxl.vercel.app/booking/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.deletedCount > 0) {
            toast.success(
              `Product ${name} booking has been successfully deleted`
            );
            refetch();
          }
        });
    }
  };

  return (
    <div className="bg-slate-900 p-5">
      <div
        class="w-full mx-auto my-4 bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md"
        role="alert"
      >
        <div class="flex">
          <div class="py-1">
            <svg
              class="fill-current h-6 w-6 text-red-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <div>
            <p class="font-bold">Check Your Order Status</p>
            <p class="text-sm">
              If your order is pending more than 20 mins after order please
              contact 01855561001
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto min-h-screen">
        {bookings.length > 0 ? (
          <table className="table-auto w-full text-left border-collapse border border-gray-800">
            <thead>
              <tr className="bg-green-600">
                <th className="text-center text-white font-bold py-2">
                  Order ID
                </th>
                <th className="text-center text-white font-bold py-2">
                  Order Dates
                </th>
                <th className="text-center text-white font-bold py-2">
                  Total Price
                </th>
                <th className="text-center text-white font-bold py-2">
                  Container Returned
                </th>
                <th className="text-center text-white font-bold py-2">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-100">
                  <td className="text-center text-sm p-1 border-b border-gray-800 bg-white">
                    {booking?.orderId}
                  </td>
                  <td className="text-center text-sm p-1 border-b border-gray-800 bg-white">
                    {booking?.mealData.map((meal, index) => (
                      <div key={index}>
                        {`${meal.date} (lunch-${meal.lunchMealNumber}, dinner-${meal.dinnerMealNumber})`}
                        {/* Add a horizontal line for separation except for the last meal */}
                        {index < booking.mealData.length - 1 && (
                          <hr className="border-gray-300 my-1" />
                        )}
                      </div>
                    ))}
                  </td>

                  <td className="text-center p-1 border-b border-gray-800 bg-white">
                    <span className="text-xl">৳</span> {booking?.total}
                  </td>
                  <td className="text-center text-sm p-1 border-b border-gray-800 bg-white">
                    {booking?.containerReturn}/{booking?.container}
                  </td>
                  <td className="text-center text-sm p-1 border-b border-gray-800 bg-white">
                    {booking?.status === false ? (
                      <span className="text-sm text-red-500">pending</span>
                    ) : (
                      <span className="text-sm text-green-500">approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-5 text-3xl font-bold text-gray-400">
            Please Add Order!
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
