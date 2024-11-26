import React, { useContext, useEffect, useState } from "react";
import CouponCard from "./CouponCard";
import ContainerReturn from "./ContainerReturn";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import PaymentModal from "./PaymentModal";

const OrderSummary = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { mealPlan, mealOption, selectedPlan } = location.state || {};
  const selectedDate = JSON.parse(localStorage.getItem("orderDate"));
  const [discount, setDiscount] = useState(0);
  const [mealData, setMealData] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [userRole, setUserRole] = useState([]);
  const [mealNumber, setMealNumber] = useState(0);
  const [totalMealPrice, setTotalMealPrice] = useState(0);
  const [containerReturnData, setContainerReturnData] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`https://metromeal-server-tfxl.vercel.app/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setUserRole(data);
      });
  }, [user?.email]);

  const userInfo = userRole[0];
  const mealPrices = mealPlan;

  const calculatePriceBasedOnDay = (day, mealType) => {
    const planPrices = mealPrices || {};
    console.log("planprices", planPrices);
    return planPrices[day]?.[mealType] || 0;
  };

  const makeDateFormat = (dateString) => {
    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[date.getDay()];
    return { day: dayName, date: dateString };
  };

  const calculateTotalPrice = (updatedMealData, discount) => {
    const total = updatedMealData.reduce((sum, item) => {
      const lunchPrice = calculatePriceBasedOnDay(item.day, "lunch");
      const dinnerPrice = calculatePriceBasedOnDay(item.day, "dinner");
      return (
        sum +
        item.lunchMealNumber * lunchPrice +
        item.dinnerMealNumber * dinnerPrice
      );
    }, 0);

    const totalContainer = updatedMealData.reduce(
      (sum, item) => sum + (item.lunchMealNumber + item.dinnerMealNumber),
      0
    );
    const totalContainerPrice = totalContainer * 30;
    const updatedTotal = totalContainerPrice + total - parseInt(discount);

    setSubtotal(updatedTotal);
    setMealNumber(totalContainer);
    setTotalMealPrice(total);
  };

  useEffect(() => {
    if (selectedDate) {
      const formattedDates = selectedDate.map((date) => makeDateFormat(date));

      const initialMealData = formattedDates.map((item) => ({
        ...item,
        lunchMealNumber:
          mealOption === "lunch" || mealOption === "both" ? 1 : 0,
        dinnerMealNumber:
          mealOption === "dinner" || mealOption === "both" ? 1 : 0,
      }));

      setMealData(initialMealData);
      calculateTotalPrice(initialMealData, discount);
    }
  }, [mealPlan, mealOption, discount]);

  const handleIncrementLunch = (index) => {
    const updatedMealData = [...mealData];
    updatedMealData[index].lunchMealNumber += 1;
    setMealData(updatedMealData);
    calculateTotalPrice(updatedMealData, discount);
  };

  const handleDecrementLunch = (index) => {
    const updatedMealData = [...mealData];
    if (updatedMealData[index].lunchMealNumber > 0) {
      updatedMealData[index].lunchMealNumber -= 1;
      setMealData(updatedMealData);
      calculateTotalPrice(updatedMealData, discount);
    }
  };

  const handleIncrementDinner = (index) => {
    const updatedMealData = [...mealData];
    updatedMealData[index].dinnerMealNumber += 1;
    setMealData(updatedMealData);
    calculateTotalPrice(updatedMealData, discount);
  };

  const handleDecrementDinner = (index) => {
    const updatedMealData = [...mealData];
    if (updatedMealData[index].dinnerMealNumber > 0) {
      updatedMealData[index].dinnerMealNumber -= 1;
      setMealData(updatedMealData);
      calculateTotalPrice(updatedMealData, discount);
    }
  };

  const handleApplyCoupon = (offer) => {
    setDiscount(offer);
    calculateTotalPrice(mealData, offer);
  };

  const handleOrderData = () => {
    const bookingData = {
      name: userInfo?.name,
      email: userInfo?.email,
      mealData: mealData,
      mealOption: mealOption,
      mealPlan: selectedPlan,
      total: subtotal,
      container: mealNumber,
      containerReturn: 0,
      containerReturnData: containerReturnData,
    };
    console.log("book", bookingData);
    setBookingData(bookingData);
    setIsModalOpen(true);

    // fetch(`https://metromeal-server-tfxl.vercel.app/booking`, {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify(bookingData),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.acknowledged) {
    //       toast.success("Your Order is confirmed");
    //     }
    //   });
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex justify-center align-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 mb-20">
        <div className="grid grid-cols-1 gap-5">
          <CouponCard handleApplyCoupon={handleApplyCoupon} />
          <ContainerReturn setContainerReturnData={setContainerReturnData} />
        </div>
        <div className="card bg-slate-800 rounded-lg w-full shadow-xl">
          <div className="card-body">
            <h2 className="text-green-600 text-2xl font-bold">Order Summary</h2>

            {mealData.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-green-800 font-semibold mb-2">
                  {item.date} - {item.day}
                </p>

                {mealOption !== "dinner" && (
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500">
                        Lunch ({calculatePriceBasedOnDay(item.day, "lunch")}) x{" "}
                        {item.lunchMealNumber}
                      </p>
                      <p className="text-white font-semibold">
                        {calculatePriceBasedOnDay(item.day, "lunch") *
                          item.lunchMealNumber}
                        .00
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => handleDecrementLunch(index)}
                      >
                        -
                      </button>
                      <span className="text-white">{item.lunchMealNumber}</span>
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded"
                        onClick={() => handleIncrementLunch(index)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {mealOption !== "lunch" && (
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500">
                        Dinner ({calculatePriceBasedOnDay(item.day, "dinner")})
                        x {item.dinnerMealNumber}
                      </p>
                      <p className="text-white font-semibold">
                        {calculatePriceBasedOnDay(item.day, "dinner") *
                          item.dinnerMealNumber}
                        .00
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => handleDecrementDinner(index)}
                      >
                        -
                      </button>
                      <span className="text-white">
                        {item.dinnerMealNumber}
                      </span>
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded"
                        onClick={() => handleIncrementDinner(index)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <hr className="my-2 border-gray-500"></hr>
            <div className="space-y-2">
              <div className="flex justify-between text-md">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-bold">
                  {totalMealPrice}.00
                </span>
              </div>
              <div className="flex justify-between text-md">
                <span className="text-gray-400">Container Fee</span>
                <span className="text-white font-bold">
                  {mealNumber * 30}.00
                </span>
              </div>
              <div className="flex justify-between text-md">
                <span className="text-gray-400">Discount</span>
                <span className="text-white font-bold">-{discount}.00</span>
              </div>
              <div className="flex justify-between text-md">
                <span className="text-green-600 font-bold">Total</span>
                <span className="text-green-600 font-bold">{subtotal}.00</span>
              </div>
            </div>

            <button onClick={handleOrderData} className="btn btn-success mt-4">
              Confirm Order
            </button>
          </div>
        </div>
        <PaymentModal
          data={bookingData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default OrderSummary;
