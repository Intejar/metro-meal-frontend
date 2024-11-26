import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";
import dummyImage from "../../img/dummy.jpg"; // Replace with actual images if available
import mealPlansData from "../../Pages/OrderSummary/meal.json"; // Assuming JSON file is stored in data folder

const SelectMeal = ({
  date,
  setSelectedPlan,
  selectedPlan,
  mealOption,
  setMealOption,
  roleCategory, // roleCategory passed from parent component or global context
  varify,
}) => {
  const navigate = useNavigate();
  const [filteredMealPlans, setFilteredMealPlans] = useState([]);
  const [clickedPlan, setClickedPlan] = useState([]);
  // Fetch and filter meal plans based on the user's roleCategory
  useEffect(() => {
    // Filter meal plans based on category matching the user's role OR if category is an empty string
    const filteredPlans = mealPlansData.mealPlans.filter(
      (plan) => plan?.category === roleCategory || plan?.category === ""
    );
    setFilteredMealPlans(filteredPlans);
  }, [roleCategory]);

  const handleAddOrder = () => {
    const orderDetails = {
      mealPlan: clickedPlan,
      mealOption: mealOption,
      selectedPlan: selectedPlan,
    };
    navigate("/dashboard/OrderSummary", { state: orderDetails });
  };

  const handleClick = (plan) => {
    setSelectedPlan(plan?.mealPlan);
    setClickedPlan(plan?.prices);
  };
  const renderMealOptions = () => {
    if (selectedPlan === "Student Plan") {
      return (
        <div className="mt-4">
          <label className="label cursor-pointer">
            <span className="label-text text-white">Include Lunch</span>
            <input
              type="radio"
              name="mealOption"
              value="lunch"
              className="radio radio-success"
              checked={mealOption === "lunch"}
              onChange={() => setMealOption("lunch")}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text text-white">Include Dinner</span>
            <input
              type="radio"
              name="mealOption"
              value="dinner"
              className="radio radio-success"
              checked={mealOption === "dinner"}
              onChange={() => setMealOption("dinner")}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text text-white">Lunch and Dinner</span>
            <input
              type="radio"
              name="mealOption"
              value="both"
              className="radio radio-success"
              checked={mealOption === "both"}
              onChange={() => setMealOption("both")}
            />
          </label>
        </div>
      );
    } else if (selectedPlan === "Corporate Plan") {
      return (
        <>
          <label className="label cursor-pointer mt-4">
            <span className="label-text text-white">Include Lunch</span>
            <input
              type="radio"
              name="mealOption"
              value="lunch"
              className="radio radio-success"
              checked={mealOption === "lunch"}
              onChange={() => setMealOption("lunch")}
            />
          </label>
        </>
      );
    } else {
      return (
        <p className="text-green-600 font-bold mt-5 text-xl text-center">
          Order from the menu
        </p>
      );
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg max-w-full">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        Select Meal Plans
      </h2>

      {/* Carousel to display meal plans based on user's roleCategory */}
      <div className="carousel carousel-center bg-neutral rounded-box max-w-full space-x-5 p-4">
        {filteredMealPlans.map((plan, index) => (
          <div key={index} className="carousel-item">
            <div
              className={`card bg-base-100 shadow-md cursor-pointer ${
                selectedPlan === plan?.mealPlan ? "ring-2 ring-green-500" : ""
              }`}
              onClick={() => handleClick(plan)}
            >
              <figure>
                <img
                  src={plan?.imageUrl || dummyImage}
                  alt={plan?.mealPlan}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body text-center">
                <h2 className="card-title">{plan?.mealPlan}</h2>
                {/* Show the pricing range dynamically */}
                {plan.prices ? (
                  <p>
                    {(() => {
                      let maxPrice = -Infinity;
                      let minPrice = Infinity;

                      for (const day in plan.prices) {
                        const { lunch, dinner } = plan.prices[day];

                        // Validate lunch price
                        if (typeof lunch === "number") {
                          maxPrice = Math.max(maxPrice, lunch);
                          minPrice = Math.min(minPrice, lunch);
                        }

                        // Validate dinner price
                        if (typeof dinner === "number") {
                          maxPrice = Math.max(maxPrice, dinner);
                          minPrice = Math.min(minPrice, dinner);
                        }
                      }

                      // Check if no valid prices were found
                      if (minPrice === Infinity || maxPrice === -Infinity) {
                        return `Coming Soon!`; // Return formatted price string
                      } else if (minPrice === maxPrice) {
                        return `${minPrice} tk`;
                      } else {
                        return `${minPrice} - ${maxPrice} tk`; // Return formatted price string
                      }
                    })()}
                  </p>
                ) : (
                  <p>Exciting pricing</p>
                )}
                {/* <p>{Object.values(plan?.prices).flat().join("-")} tk</p> */}
                {/* Pass the entire plan data to the SideMenu component */}
                <SideMenu
                  selectedPlan={selectedPlan}
                  drawerValue={`my-drawer-${index + 4}`}
                  plan={plan}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meal Options */}
      {/* <div className="form-control mb-6">
        <label className="label cursor-pointer">
          <span className="label-text text-white">Include Lunch</span>
          <input
            type="radio"
            name="mealOption"
            value="lunch"
            className="radio radio-success"
            checked={mealOption === "lunch"}
            onChange={() => setMealOption("lunch")}
          />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text text-white">Include Dinner</span>
          <input
            type="radio"
            name="mealOption"
            value="dinner"
            className="radio radio-success"
            checked={mealOption === "dinner"}
            onChange={() => setMealOption("dinner")}
          />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text text-white">Lunch and Dinner</span>
          <input
            type="radio"
            name="mealOption"
            value="both"
            className="radio radio-success"
            checked={mealOption === "both"}
            onChange={() => setMealOption("both")}
          />
        </label>
      </div> */}
      <div className="form-control mb-6">{renderMealOptions()}</div>
      {selectedPlan === "Corporate Plan" && (
        <button
          className="btn btn-success w-full text-white"
          onClick={handleAddOrder}
        >
          Add Order
        </button>
      )}
      {selectedPlan === "Student Plan" && (
        <button
          className="btn btn-success w-full text-white"
          onClick={handleAddOrder}
        >
          Add Order
        </button>
      )}
      {varify === "False" && (
        <p className="text-md text-red-500 font-bold text-center">
          Please varify your number to add order
        </p>
      )}
    </div>
  );
};

export default SelectMeal;
