import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";
import { toast } from "react-toastify";

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
      const res = await axios.post("http://localhost:3000/auth/verifyOtp", {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80 text-center">
        <h2 className="mb-4 font-semibold text-lg">Enter OTP</h2>

        {/* Single OTP input */}
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))} // only digits
          className="w-full text-center text-xl border rounded py-2 mb-4"
          placeholder="Enter 6-digit OTP"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
