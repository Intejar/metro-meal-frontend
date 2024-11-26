import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useContext, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast, Toaster } from "react-hot-toast";
import { AuthContext } from "../../Context/AuthProvider/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NumberVerification = () => {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState([]);
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [sentCode, setSentCode] = useState(""); // To hold the sent OTP code
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://metromeal-server-tfxl.vercel.app/users?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("userdata", data);
        setUserRole(data);
      });
  }, [user?.email]);

  const userInfo = userRole[0];

  // Function to send SMS using BD Bulk SMS API
  const sendSms = async () => {
    // Generate a random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code); // Store the sent code

    const message = `METROMEAL OTP is ${code}`;
    const apiKey = "muDq66DOuFDOBLM9KVft"; // Replace with your BD Bulk SMS API key
    const senderId = "8809617622103"; // Replace with your sender ID

    setLoading(true);

    try {
      const response = await axios.post(
        "https://bulksmsbd.net/api/smsapi",
        {
          api_key: apiKey,
          senderid: senderId,
          number: ph,
          message: message,
        },
        { timeout: 10000 } // 10 seconds timeout
      );

      // Log the full response for debugging
      console.log("Response from API:", response.data);

      // Check for success based on the expected response structure
      if (response.data.response_code === 202) {
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      } else {
        const errorMessage =
          response.data.error_message || "Failed to send SMS";
        console.error("Error from API:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
      });
      toast.error("Failed to send OTP. Try again.");
    }
  };

  const onOTPVerify = async () => {
    setLoading(true);
    if (otp === sentCode) {
      try {
        const response = await fetch(
          `https://metromeal-server-tfxl.vercel.app/users/${userInfo._id}`,
          {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ number: ph, varify: "True" }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to verify phone number");
        }

        toast.success("Phone number verified successfully!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error verifying OTP:", error);
        toast.error("OTP verification failed. Please try again.");
      }
    } else {
      toast.error("OTP verification failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section className="bg-slate-900 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />

        <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
          <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
            Welcome {userInfo?.name}
          </h1>
          {showOTP ? (
            <>
              <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                <BsFillShieldLockFill size={30} />
              </div>
              <label
                htmlFor="otp"
                className="font-bold text-xl text-white text-center"
              >
                Enter your OTP
              </label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={false}
                autoFocus
                className="opt-container "
              />
              <button
                onClick={onOTPVerify}
                className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
              >
                {loading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>Verify OTP</span>
              </button>
            </>
          ) : (
            <>
              <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                <BsTelephoneFill size={30} />
              </div>
              <label className="font-bold text-xl text-white text-center">
                Verify your phone number
              </label>
              <PhoneInput country={"bd"} value={ph} onChange={setPh} />
              <button
                onClick={sendSms} // Call sendSms instead of onSignup
                className="bg-green-800 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
              >
                {loading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>Send code via SMS</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default NumberVerification;
