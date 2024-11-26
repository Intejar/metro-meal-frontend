import React, { useContext, useEffect, useState } from "react";
import DatePick from "./DatePick";
import SelectMeal from "./SelectMeal";
import LocationCard from "./Location";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";

const Order = () => {
  const { user } = useContext(AuthContext);
  const [selected, setSelected] = useState([]);
  const [orderDate, setOrderDate] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("regular");
  const [mealOption, setMealOption] = useState("both");
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    fetch(`https://metromeal-server-tfxl.vercel.app/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setUserRole(data);
      });
  }, [user?.email]);

  const userInfo = userRole[0];

  // Function to format date
  function makeDateFormat(date) {
    const monthF = String(date.getMonth() + 1).padStart(2, "0");
    const yearF = date.getFullYear();
    const dateF = String(date.getDate()).padStart(2, "0");
    return `${yearF}-${monthF}-${dateF}`;
  }

  // Effect to log formatted dates whenever the selected dates change
  useEffect(() => {
    if (selected.length > 0) {
      const formattedDates = selected.map((date) =>
        makeDateFormat(new Date(date))
      );
      setOrderDate(formattedDates);
      localStorage.setItem("orderDate", JSON.stringify(formattedDates));
    }
    // Store selectedPlan and mealOption in localStorage when they change
    localStorage.setItem("selectedPlan", selectedPlan);
    localStorage.setItem("mealOption", mealOption);
  }, [selected, selectedPlan, mealOption]);

  console.log("or", orderDate);
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 mb-20">
        <DatePick selected={selected} setSelected={setSelected}></DatePick>
        <SelectMeal
          date={selected}
          setSelectedPlan={setSelectedPlan}
          selectedPlan={selectedPlan}
          mealOption={mealOption}
          setMealOption={setMealOption}
          roleCategory={userInfo?.roleCategory}
          varify={userInfo?.varify}
        ></SelectMeal>
        <LocationCard></LocationCard>
      </div>
    </div>
  );
};

export default Order;
