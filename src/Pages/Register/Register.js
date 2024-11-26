import { GoogleAuthProvider } from "firebase/auth";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaEyeSlash,
  FaEye,
  FaGoogle,
  FaGithub,
  FaWindows,
} from "react-icons/fa";
import "./Register.css";
import Lottie from "react-lottie";
// import useToken from "../hooks/useToken";
// import { TabTitle } from "../../DynamicTitle/DynamicTitle";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";

const Register = () => {
  //   TabTitle("SignUp-Mobile Broker");
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("../../meal.json"),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { createUser, updateUserProfile, googleLogIn, emailVarification } =
    useContext(AuthContext);
  const googleProvider = new GoogleAuthProvider();
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [emailLink, setEmailLink] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const location = useLocation();
  const imageHostKey = "41185f8bc11dfae202e0de3bc10fcabe";
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  const toggle = () => {
    setOpen(!open);
  };
  const handleRegister = (data) => {
    console.log(data);

    if (data.password !== data.confirmPassword) {
      setSignUpError("confirm password doesnot match!!");
    } else {
      createUser(data.email, data.password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          const image = data.img[0];
          const formData = new FormData();
          formData.append("image", image);
          const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
          fetch(url, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((imgData) => {
              const image = imgData.data.url;
              handleUpdate(data.name, image);
              saveUser(
                data.name,
                data.email,
                data.number,
                data.houseNo,
                data.roadNo,
                data.flatNo,
                data.fullAddress,
                image
              );
            });
        })
        .catch((error) => {
          console.error(error);
          const errorMsg = error.message;
          setSignUpError(errorMsg);
        });
      const handleUpdate = (name, img) => {
        const profile = {
          displayName: name,
          photoURL: img,
        };
        console.log(profile);
        updateUserProfile(profile)
          .then(() => {})
          .catch((e) => console.error(e));
      };
    }
  };

  const saveUser = (name, email, number, house, road, flat, address, image) => {
    const newUser = {
      name: name,
      email: email,
      phone: number,
      house: house,
      road: road,
      flat: flat,
      address: address,
      role: "customer",
      roleCategory: "general",
      img: image,
      varify: "False",
      discount: [],
    };
    const newNotification = {
      email: email,
      msg: "We have sent you a varification link to your email.",
    };
    fetch("https://metromeal-server-tfxl.vercel.app/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserEmail(email);
        toast.success("user registered successfully!!");
        navigate("/numberVarify", {
          state: { exampleState: { name } },
        });
      });
  };
  return (
    <div className="hero min-h-screen bg-slate-200 dark:bg-slate-800">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="w-full">
          <Lottie options={defaultOptions} />
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 dark:bg-slate-600">
          <form onSubmit={handleSubmit(handleRegister)} className="card-body">
            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Full Name <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Full Name"
                className="input input-bordered input-success"
              />
              {errors.name && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.name?.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Email <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                type="text"
                placeholder="Email"
                className="input input-bordered input-success"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.email?.message}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Phone Number <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                {...register("number", {
                  required: "Phone Number is required",
                  pattern: /^[0-9]{11}$/,
                })}
                type="text"
                placeholder="Phone Number"
                className="input input-bordered input-success"
              />
              {errors.number && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.number?.message}
                </p>
              )}
              {errors?.number?.type === "pattern" && (
                <p className="text-xs text-red-400 mt-3" role="alert">
                  Please input a valid phone number.
                </p>
              )}
            </div>

            {/* Address Inputs */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  House No. <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                {...register("houseNo", { required: "House No. is required" })}
                type="text"
                placeholder="House No."
                className="input input-bordered input-success"
              />
              {errors.houseNo && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.houseNo?.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Road No. <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                {...register("roadNo", { required: "Road No. is required" })}
                type="text"
                placeholder="Road No."
                className="input input-bordered input-success"
              />
              {errors.roadNo && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.roadNo?.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Flat No. <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                {...register("flatNo", { required: "Flat No. is required" })}
                type="text"
                placeholder="Flat No. "
                className="input input-bordered input-success"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Full Address <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                {...register("fullAddress", {
                  required: "Full Address is required",
                })}
                type="text"
                placeholder="Full Address"
                className="input input-bordered input-success"
              />
              {errors.fullAddress && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.fullAddress?.message}
                </p>
              )}
            </div>

            {/* File Input for User Photo */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  User Photo <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                {...register("img", { required: "Image is required" })}
                type="file"
                className="file-input file-input-bordered file-input-success w-full max-w-xs"
              />
              {errors.img && (
                <p className="text-sm text-red-400 mt-3" role="alert">
                  {errors.img?.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Password <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="input input-bordered input-success pass flex justify-between items-center border rounded-lg p-3 dark: bg-white">
                <input
                  {...register("password", {
                    required: "Password is required",
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  })}
                  type={open === false ? "password" : "text"}
                  placeholder="password"
                  className="  dark:text-black dark:bg-white"
                />
                {open === false ? (
                  <FaEyeSlash
                    className="dark:text-black"
                    onClick={toggle}
                  ></FaEyeSlash>
                ) : (
                  <FaEye className="dark:text-black" onClick={toggle}></FaEye>
                )}
              </div>
              <label className="label">
                <span className="label-text">
                  {" "}
                  Minimum eight characters, at least one
                  uppercasse,lowercase,number,special letter
                </span>
              </label>
              {errors.password && (
                <p className="text-sm text-red-400" role="alert">
                  {errors.password?.message}
                </p>
              )}
              {errors?.password?.type === "pattern" && (
                <p className="text-xs text-red-400 max-w-fit mt-3" role="alert">
                  Minimum eight characters, at least one
                  uppercasse,lowercase,number,special letter
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Confirm Password <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="input input-bordered input-success pass flex justify-between items-center border rounded-lg p-3 dark: bg-white">
                <input
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                  })}
                  type={open === false ? "password" : "text"}
                  placeholder="confirm password"
                  className="dark:text-black dark:bg-white"
                />
                {open === false ? (
                  <FaEyeSlash
                    className="dark:text-black"
                    onClick={toggle}
                  ></FaEyeSlash>
                ) : (
                  <FaEye className="dark:text-black" onClick={toggle}></FaEye>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400" role="alert">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>
            {signUpError && <p className="text-red-500 my-3">{signUpError}</p>}
            {emailLink && <p className="text-red-500 my-3">{emailLink}</p>}

            {/* Error Message */}
            {signUpError && (
              <p className="text-red-500 text-sm font-semibold text-center">
                {signUpError}
              </p>
            )}

            <div className="form-control mt-6">
              <button className="btn btn-success">Register</button>
            </div>

            {/* Already Have Account */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
