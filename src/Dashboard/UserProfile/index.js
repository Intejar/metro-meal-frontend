import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState([]);
  const [userImg, setUserImg] = useState([]);
  const [userHouse, setUserHouse] = useState("");
  const [userRoad, setUserRoad] = useState("");
  const [userFlat, setuserFlat] = useState("");
  const [userAddress, setuserAddress] = useState("");
  const imageHostKey = "41185f8bc11dfae202e0de3bc10fcabe";
  const [userRoleCategory, setUserRoleCategory] = useState("");
  const [varifyImg, setVarifyImg] = useState([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (user?.email) {
      fetch(
        `https://metromeal-server-tfxl.vercel.app/users?email=${user.email}`
      )
        .then((res) => res.json())
        .then((data) => {
          setUserRole(data);
          if (data.length > 0) {
            let userInfo = data[0];
            // Set initial values from database
            setUserImg(userInfo.img || "");
            setUserHouse(userInfo.house || "");
            setUserRoad(userInfo.road || "");
            setuserFlat(userInfo.flat || "");
            setuserAddress(userInfo.address || "");
          }
        });
    }
  }, [user?.email]);

  const userInfo = userRole[0];
  console.log("v", userInfo);
  useEffect(() => {
    if (userInfo) {
      reset({
        houseNo: userInfo.house,
        roadNo: userInfo.road,
        flatNo: userInfo.flat,
        fullAddress: userInfo.address,
      });
    }
  }, [userInfo, reset]);

  const handleUpdateInfo = (e) => {
    console.log(
      "Updated Info:",
      userHouse,
      userRoad,
      userFlat,
      userAddress,
      userImg
    );

    const updatedImg = userImg || userInfo.img;
    const updatedHouse = userHouse || userInfo.house;
    const updatedRoad = userRoad || userInfo.road;
    const updatedFlat = userFlat || userInfo.flat;
    const updatedAddress = userAddress || userInfo.address;

    fetch(
      `https://metromeal-server-tfxl.vercel.app/users/updateInfo/${userInfo._id}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          img: updatedImg,
          house: updatedHouse,
          road: updatedRoad,
          flat: updatedFlat,
          address: updatedAddress,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.acknowledged) {
          toast.success("Your Info Has been Updated!");
          window.location.reload();
        } else {
          console.log(data.message);
        }
      });
  };

  const generateImgLink = (img) => {
    const formData = new FormData();
    formData.append("image", img);

    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const imageLink = imgData.data.url;
          setUserImg(imageLink);
        } else {
          toast.error("Image upload failed");
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };
  const generateVarifyImgLink = (img) => {
    const formData = new FormData();
    formData.append("image", img);

    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const imageLink = imgData.data.url;
          setVarifyImg(imageLink);
        } else {
          toast.error("Image upload failed");
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleSubmitVarify = () => {
    const updatedImgVarify = varifyImg || "";
    const updatedUserCategory = userRoleCategory || "general";
    console.log(updatedImgVarify, updatedUserCategory);
    const data = {
      userId: userInfo?._id,
      userName: userInfo?.name,
      userEmail: userInfo?.email,
      phoneNumber: userInfo?.phoneNumber,
      roleCategory: updatedUserCategory,
      img: updatedImgVarify,
    };
    fetch(`https://metromeal-server-tfxl.vercel.app/varifyUser`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("Your request has been sent!");
        window.location.reload();
      });
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 dark:bg-slate-700 ">
      {/* Phone Verification Notice */}
      {userInfo?.roleCategory === "general" && (
        <div
          className="w-full my-4 bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md lg:w-1/2 lg:mx-auto"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Please Update Your User Info</p>
              <p className="text-sm">
                If you don't update your user role then you will miss exciting
                offers
              </p>
            </div>
          </div>
        </div>
      )}
      {userInfo?.varify === "False" && (
        <div
          className="w-full my-4 bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md lg:w-1/2 lg:mx-auto"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Verify Your Number</p>
              <p className="text-sm">
                You won't be able to place orders if your number is not verified
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Information */}
      <div role="tablist" className="tabs tabs-lifted mx-5 mt-5">
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab text-xs text-green-600 font-bold"
          aria-label="Basic Info"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <div className="">
            <label className="label">Name</label>
            <input
              {...register("name")}
              type="text"
              defaultValue={userInfo?.name}
              className="input input-bordered input-success"
              disabled
            />
          </div>
          <div className="">
            <label className="label">Email</label>
            <input
              {...register("email")}
              type="text"
              defaultValue={userInfo?.email}
              className="input input-bordered input-success"
              disabled
            />
          </div>
          <div className="">
            <label className="label">Phone Number</label>
            <input
              {...register("phone")}
              type="text"
              defaultValue={userInfo?.phone}
              className="input input-bordered input-success"
              disabled
            />
          </div>
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab text-xs text-green-600 font-bold"
          aria-label="Edit Info"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <form onSubmit={handleSubmit(handleUpdateInfo)} className="card-body">
            <div className="form-control items-center mb-2">
              <div className="relative w-24 h-24">
                <img
                  src={userInfo?.img || "/placeholder-image.png"}
                  alt="User Profile"
                  className="rounded-full w-full h-full object-cover"
                />
                <label className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full cursor-pointer">
                  <FiPlus className="text-white" />
                  <input
                    {...register("img")}
                    type="file"
                    className="hidden"
                    onChange={(e) => generateImgLink(e.target.files[0])}
                  />
                </label>
              </div>
              {errors.img && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.img?.message}
                </p>
              )}
            </div>

            {/* Address Inputs */}
            <div className="form-control">
              <label className="label">House No.</label>
              <input
                {...register("houseNo")}
                type="text"
                defaultValue={userInfo?.house}
                className="input input-bordered input-success"
                onChange={(e) => setUserHouse(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">Road No.</label>
              <input
                {...register("roadNo")}
                type="text"
                defaultValue={userInfo?.road}
                className="input input-bordered input-success"
                onChange={(e) => setUserRoad(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">Flat No.</label>
              <input
                {...register("flatNo")}
                type="text"
                defaultValue={userInfo?.flat}
                className="input input-bordered input-success"
                onChange={(e) => setuserFlat(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">Full Address</label>
              <input
                {...register("fullAddress")}
                type="text"
                defaultValue={userInfo?.address}
                className="input input-bordered input-success"
                onChange={(e) => setuserAddress(e.target.value)}
              />
            </div>

            <div className="form-control my-4">
              <button type="submit" className="btn btn-success">
                Update Information
              </button>
            </div>
          </form>
        </div>
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab text-xs text-green-600 font-bold"
          aria-label="Required Update"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <form
            className="space-y-4"
            onSubmit={handleSubmit(handleSubmitVarify)}
          >
            <div>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Pick Your Role</span>
                </div>
                <select
                  className="select select-bordered"
                  onChange={(e) => setUserRoleCategory(e.target.value)}
                >
                  <option disabled selected>
                    Pick one
                  </option>
                  <option>student</option>
                  <option>corporate</option>
                </select>
              </label>
            </div>
            <div className="form-control">
              <label className=" block text-gray-400">Upload Id Proof</label>
              <input
                type="file"
                onChange={(e) => generateVarifyImgLink(e.target.files[0])}
                className="w-full p-2 rounded bg-green-700 text-white"
                required
              />
            </div>
            <button type="submit" className="btn btn-success text-white w-full">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
