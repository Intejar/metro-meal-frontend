// UserProfile.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase/firebase.config"; // Use the auth instance directly
import FirbaseNumber from "../../Pages/Register/firbaseNumber";
import Navbar from "../../Shared/Navbar/Navbar";
import firebase from "firebase/compat/app";

const UserProfileDummy = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAbLB5_sStHF_pz1wwPPB7_KD2TYQIaxho",
    authDomain: "turfslotbooking.firebaseapp.com",
    projectId: "turfslotbooking",
    storageBucket: "turfslotbooking.appspot.com",
    messagingSenderId: "822344802585",
    appId: "1:822344802585:web:902e5ae1be457e8b596588",
  };
  firebase.initializeApp(firebaseConfig);

  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [users, setUser] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetch(
        `https://metromeal-server-tfxl.vercel.app/users?email=${user.email}`
      )
        .then((res) => res.json())
        .then((data) => setUserRole(data));
    }
  }, [user?.email]);

  const userInfo = userRole[0];

  useEffect(() => {
    const unSubscriber = onAuthStateChanged(firebase.auth(), (currentUser) => {
      console.log(currentUser);
      setUser(currentUser);
    });

    return () => unSubscriber();
  }, []);

  const handleClick = () => {
    setShowComponent(true); // Show the FirebaseNumber component
  };

  return (
    <div className="min-h-screen w-full bg-slate-600 dark:bg-slate-700">
      {/* <Navbar /> */}
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          <div className="avatar mt-5 ml-5 mb-5">
            <div className="overflow-hidden w-1/2 lg:w-40 rounded-full">
              <img
                src={userInfo?.img}
                alt="user-photo"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phone Verification Notice */}
      {userInfo?.varify === "False" && (
        <div className="w-full mx-auto bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md">
          <div className="">
            <p className="font-bold sm:font-semibold">
              Your Phone Number is NOT VERIFIED
            </p>
            <p className="text-sm">
              Make sure your number is verified to order!
            </p>
            <button onClick={handleClick} className="text-blue-600 underline">
              Open Firebase Phone Auth
            </button>
          </div>
        </div>
      )}

      {showComponent && <FirbaseNumber auth={firebase.auth()} />}

      {/* User Information */}
      <h1 className="text-3xl sm:text-xl font-bold m-5 text-green-700">
        {`${userInfo?.role} Information`}
      </h1>

      {/* Add additional user info sections here */}
    </div>
  );
};

export default UserProfileDummy;
