import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";
import { toast } from "react-toastify";

const BASE_URL =  import.meta.env.VITE_BASE_URL ;

export default function Otp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const email = JSON.parse(localStorage.getItem("email"));

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/verifyOtp`, {
        email,
        otp,
      });

      if (res.data.success) {
        toast.success("OTP verified successfully");
        dispatch(loginSuccess(res.data.user));
        navigate("/");
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="mb-4 text-2xl font-semibold text-[#0B1F3A]">
          Enter OTP
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Please enter the 6-digit OTP sent to your email.
        </p>

        {/* OTP Input */}
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // only digits
          className="w-full text-center text-xl border border-gray-300 rounded-lg py-2 mb-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
          placeholder="●●●●●●"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full bg-yellow-500 text-[#0B1F3A] py-2 rounded-lg font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-400"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Optional: Resend OTP */}
        <p className="mt-4 text-sm text-gray-500">
          Didn't receive OTP?{" "}
          <button
            onClick={() => toast.info("Resend OTP feature not implemented")}
            className="text-yellow-500 hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
