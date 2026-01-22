import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL; 
export default function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password } = userData;

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, userData);

      if (res.data.email) {
        localStorage.setItem("email", JSON.stringify(res.data.email));
        toast.success("Registered successfully! Enter OTP.");
        navigate("/otp");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col sm:flex-row w-full max-w-180 rounded-lg shadow-lg overflow-hidden">
        {/* Left panel */}
        <div className="w-full sm:w-1/2 bg-yellow-500 text-[#0B1F3A] flex flex-col justify-center items-center p-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
          <p className="mb-6">Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            className="border-2 border-[#0B1F3A] text-[#0B1F3A] px-6 py-2 rounded hover:bg-[#0B1F3A] hover:text-yellow-500 transition"
          >
            Login
          </button>
        </div>

        {/* Right panel */}
        <div className="w-full sm:w-1/2 bg-white flex flex-col justify-center p-8">
          <h2 className="text-xl font-semibold mb-6">Register</h2>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="w-full h-12 border border-gray-300 rounded px-3 focus:outline-yellow-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="w-full h-12 border border-gray-300 rounded px-3 focus:outline-yellow-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="w-full h-12 border border-gray-300 rounded px-3 focus:outline-yellow-500"
              required
              minLength={6}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded transition font-semibold ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#0B1F3A] text-yellow-500 hover:bg-yellow-500 hover:text-[#0B1F3A]"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
