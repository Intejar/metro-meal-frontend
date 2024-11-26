import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({ data, isOpen, onClose }) => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [trxId, setTrxId] = useState("");
  const [image, setImage] = useState(null);
  const imageHostKey = "41185f8bc11dfae202e0de3bc10fcabe";
  const navigate = useNavigate();

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };
  console.log("modal", data);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trxId || !image) {
      return toast.error("TRX ID or image is missing");
    }

    const formData = new FormData();
    formData.append("image", image);

    console.log("e", trxId, image);
    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const imageLink = imgData.data.url;
          console.log(imageLink);
          const randomId = [...Array(8)]
            .map(() =>
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()".charAt(
                Math.floor(Math.random() * 72)
              )
            )
            .join("");

          const newData = {
            ...data,
            trxId: trxId,
            imgLink: imageLink,
            paymentMethod: selectedPayment,
            status: false,
            orderId: randomId,
          };
          insertData(newData);
        } else {
          toast.error("Image upload failed");
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const insertData = (data) => {
    console.log(data);
    fetch("https://metromeal-server-tfxl.vercel.app/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Order Placed Successfully!");
        onClose();
        navigate("/dashboard/orderHistory");
      });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>
        <div className="bg-slate-800 rounded-lg shadow-lg p-5 z-10 relative">
          <h2 className="text-lg font-bold text-white mb-4">
            Select Payment Method
          </h2>
          <button
            className="absolute top-2 right-2 text-red-500 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handlePaymentSelect("bkash")}
              className={`flex-1 py-2 rounded-lg text-white ${
                selectedPayment === "bkash" ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              BKash
            </button>
            <button
              onClick={() => handlePaymentSelect("nagad")}
              className={`flex-1 py-2 rounded-lg text-white ${
                selectedPayment === "nagad" ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              Nagad
            </button>
          </div>

          {selectedPayment && (
            <div className="text-gray-300 mb-4">
              <p>Step 1: Send Money (01855561001) - Personal</p>
              <p>Step 2: Copy TRX ID</p>
              <p>Step 3: Take screenshot of payment</p>
              <p>Step 4: Fill in the form below</p>
            </div>
          )}

          {selectedPayment && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400">TRX ID</label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400">Upload Screenshot</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-green-600 rounded-lg text-white"
              >
                Submit
              </button>
            </form>
          )}

          <button onClick={onClose} className="mt-4 text-gray-400 underline">
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default PaymentModal;
