import React, { useState } from "react";

const ContainerReturn = ({ setContainerReturnData }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [returnOption, setReturnOption] = useState("");

  const handleYesClick = () => {
    setShowOptions(true);
    setShowWarning(false);
  };

  const handleNoClick = () => {
    setShowOptions(false);
    setShowWarning(true);
    setContainerReturnData("No Return"); // Notify parent about no return
  };

  const handleOptionChange = (e) => {
    setReturnOption(e.target.value);
    setContainerReturnData(e.target.value); // Send selected option to parent
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg max-w-full">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        Container Return
      </h2>

      <p className="text-white text-lg text-center mb-4">
        Will you return the container?
      </p>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleYesClick}
        >
          Yes
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleNoClick}
        >
          No
        </button>
      </div>

      {showWarning && (
        <div className="bg-red-500 text-white text-center py-2 px-4 rounded-lg mb-4">
          You will not get a container fee return discount on your next order.
        </div>
      )}

      {showOptions && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-white text-lg text-center mb-4">
            How would you like to return the container?
          </p>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="returnOption"
                value="From my ordered address"
                className="form-radio h-5 w-5 text-green-500"
                checked={returnOption === "From my ordered address"}
                onChange={handleOptionChange}
              />
              <span className="ml-2 text-white">From my ordered address</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="returnOption"
                value="From my security guard"
                className="form-radio h-5 w-5 text-green-500"
                checked={returnOption === "From my security guard"}
                onChange={handleOptionChange}
              />
              <span className="ml-2 text-white">From my security guard</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="returnOption"
                value="Metro Meal Kitchen"
                className="form-radio h-5 w-5 text-green-500"
                checked={returnOption === "Metro Meal Kitchen"}
                onChange={handleOptionChange}
              />
              <span className="ml-2 text-white">Metro Meal Kitchen</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerReturn;
