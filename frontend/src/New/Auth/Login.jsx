import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";
import { toast } from "react-toastify";

const BASE_URL =  import.meta.env.VITE_BASE_URL ;
; // <-- updated API base URL

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        dispatch(loginSuccess(res.data.user));
        toast.success("Login successful");
        if (res.data.user.role == "admin") {
          navigate("/admin");
        }
        if (res.data.user.role == "user") {
          navigate("/");
        }
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col sm:flex-row w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
        {/* Left Panel */}
        <div className="sm:w-1/2 bg-yellow-500 text-[#0B1F3A] flex flex-col justify-center items-center p-8">
          <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back!</h2>
          <p className="mb-6 text-center">Don’t have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="border-2 border-[#0B1F3A] text-[#0B1F3A] px-6 py-2 rounded hover:bg-[#0B1F3A] hover:text-yellow-500 transition"
          >
            Register
          </button>
        </div>

        {/* Right Panel */}
        <div className="sm:w-1/2 bg-white flex flex-col justify-center p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 border border-gray-300 rounded px-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 border border-gray-300 rounded px-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-yellow-500 text-[#0B1F3A] font-semibold py-3 rounded-lg text-lg transition ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#0A1A32] hover:text-yellow-500"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
