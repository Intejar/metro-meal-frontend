import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import toast from "react-hot-toast";

const CouponCard = ({ handleApplyCoupon }) => {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Track applied coupon

  useEffect(() => {
    fetch(`https://metromeal-server-tfxl.vercel.app/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserRole(data);
        setCoupons(data[0]?.discount || []);
      });
  }, [user?.email]);

  const userInfo = userRole[0];
  console.log(userInfo);

  const applyCoupon = async (coupon) => {
    console.log("c", coupon);
    handleApplyCoupon(coupon.couponAmount);
    toast.success("Discount applied!");

    // Set applied coupon
    setAppliedCoupon(coupon.couponCode);

    // Remove applied coupon from the array
    const updatedCoupons = coupons.filter(
      (c) => c.couponCode !== coupon.couponCode
    );
    setCoupons(updatedCoupons);
    console.log("h", updatedCoupons);

    fetch(
      `https://metromeal-server-tfxl.vercel.app/users/coupon/${userInfo._id}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ discount: updatedCoupons }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.acknowledged) {
          // Optionally handle success
        } else {
          console.log(data.message);
        }
      });
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg max-w-full">
      <h2 className="text-2xl font-bold text-center text-green-600">
        Enjoy Discount
      </h2>
      <div className="my-5">
        <h4 className="text-md text-white">We offer regular discounts on-</h4>
        <ul className="list-disc list-inside text-white ml-4">
          <li>Ordering more than 50 meals.</li>
          <li>Returning container.</li>
        </ul>
      </div>
      {userInfo?.discount?.map((coupon) => (
        <label
          className="form-control w-full max-w-full my-3"
          key={coupon.couponCode}
        >
          <div className="relative">
            <input
              type="text"
              placeholder={coupon.couponCode}
              className="input input-bordered w-full max-w-full bg-slate-600 placeholder-green-600 font-bold opacity-100 pr-16"
              disabled={appliedCoupon === coupon.couponCode} // Disable if coupon is applied
            />
            <button
              className={`absolute right-0 top-0 h-full px-4 text-white bg-green-600 rounded-r-md hover:bg-green-700 transition ${
                appliedCoupon === coupon.couponCode
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => applyCoupon(coupon)}
              disabled={appliedCoupon === coupon.couponCode} // Disable button if coupon is applied
            >
              Apply
            </button>
          </div>
          <div className="label">
            <span className="label-text-alt text-white">
              {coupon.couponText}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default CouponCard;
