import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill in both fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });
      console.log(res.data);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        // localStorage.setItem("email", res.data.user.email);
        dispatch(loginSuccess(res.data.user));
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-175 rounded-lg shadow-lg overflow-hidden">
        {/* Left panel */}
        <div className="w-1/2 bg-yellow-500 text-[#0B1F3A] flex flex-col justify-center items-center p-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome Back!</h2>
          <p className="mb-6">Already have an account?</p>
          <button
            onClick={() => {
              navigate("/register");
            }}
            className="border-2 border-[#0B1F3A] text-[#0B1F3A] px-6 py-2 rounded hover:bg-[#0B1F3A] hover:text-yellow-500 transition"
          >
            Register
          </button>
        </div>

        {/* Right panel */}
        <div className="w-1/2 bg-white flex flex-col justify-center p-8">
          <h2 className="text-xl font-semibold mb-6">Login</h2>
          <div className="flex flex-col gap-4 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 border border-gray-300 rounded px-3 focus:outline-yellow-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 border border-gray-300 rounded px-3 focus:outline-yellow-500"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-yellow-500 text-xl py-2 rounded hover:bg-[#0A1A32] transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
