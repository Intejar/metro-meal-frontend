import React, { useState } from "react";
import dummyImg from "../../img/dummy.jpg"; // Default image if needed

const SideMenu = ({ selectedPlan, drawerValue, plan }) => {
  const [mealTime, setMealTime] = useState("lunch");

  // Determine the meals based on the plan structure
  let meals = [];

  // Check if prices exist and if the plan is a daily meal plan
  if (plan.prices && Object.keys(plan.prices).length > 0) {
    const hasLunch = Object.values(plan.prices).some((day) => day.lunch);
    const hasDinner = Object.values(plan.prices).some((day) => day.dinner);

    // Check if both lunch and dinner are present
    if (hasLunch || hasDinner) {
      meals = Object.keys(plan.prices)
        .map((day) => {
          const priceInfo = plan.prices[day][mealTime];
          const menuInfo = plan.menu[day]?.[mealTime];

          return priceInfo && menuInfo
            ? {
                day,
                price: `${priceInfo} tk`,
                meals: menuInfo.items,
                img: menuInfo.imageUrl || dummyImg,
              }
            : {
                day: "No meals available",
                price: "",
                meals: "Check back later!",
                img: dummyImg,
              };
        })
        .filter(Boolean); // Filter out any null entries
    } else {
      // If neither lunch nor dinner is available for any day
      meals = [
        {
          day: "No meals available",
          price: "",
          meals: "Check back later!",
          img: dummyImg,
        },
      ];
    }
  }

  // Check if the plan has a menu structure without daily pricing
  else if (plan.menu && Array.isArray(plan.menu)) {
    meals = plan.menu.map((item) => ({
      day: item.name,
      price: `${item.price} tk`,
      meals: item.name,
      img: plan.imageUrl || dummyImg, // Use a generic image for fast food items
    }));
  }
  // Handle empty or undefined menus
  else if (!meals.length) {
    meals = [
      {
        day: "No meals available",
        price: "",
        meals: "Check back later!",
        img: dummyImg,
      },
    ];
  }

  return (
    <div className="drawer drawer-end">
      <input id={drawerValue} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor={drawerValue}
          className="btn btn-sm btn-success px-5 py-2 text-white"
        >
          Menu
        </label>
      </div>
      <div
        className="drawer-side h-full"
        style={{ zIndex: 700, position: "fixed", height: "100vh" }}
      >
        <label
          htmlFor={drawerValue}
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="menu p-4 w-80 bg-gray-900 text-white h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {plan.mealPlan.toUpperCase()}
              </h2>
              <label
                htmlFor={drawerValue}
                className="btn btn-sm btn-square btn-success text-white "
              >
                →
              </label>
            </div>

            {/* Toggle buttons */}
            <div className="flex justify-center space-x-2 mb-4">
              <button
                className={`btn ${
                  mealTime === "lunch"
                    ? "btn-success text-white"
                    : "bg-slate-800 text-white"
                }`}
                onClick={() => setMealTime("lunch")}
              >
                Lunch
              </button>
              <button
                className={`btn ${
                  mealTime === "dinner"
                    ? "btn-success text-white"
                    : "bg-slate-800 text-white"
                }`}
                onClick={() => setMealTime("dinner")}
              >
                Dinner
              </button>
            </div>

            {/* Meal Cards */}
            <div className="space-y-2.5">
              {meals.map((meal, index) => (
                <div
                  key={index}
                  className="flex bg-gray-800 rounded-lg shadow-md"
                >
                  {/* Image on the left */}
                  <img
                    src={meal.img}
                    alt={meal.day}
                    className="rounded-l-lg object-cover w-24 h-24"
                  />

                  {/* Content on the right */}
                  <div className="p-4 flex flex-col justify-center">
                    <h3 className="font-semibold text-sm">{meal.day}</h3>
                    <p className="text-gray-400 text-sm">{meal.meals}</p>
                    <p className="font-bold text-white text-sm">{meal.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>{/* Additional footer content here if needed */}</div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
