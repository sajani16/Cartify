import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    const email = JSON.parse(localStorage.getItem("email"));
    console.log(email);
    const code = otp.join("");
    if (code.length !== 6) {
      alert("Fill all 6 boxes");
      return;
    }
    const res = await axios.post("http://localhost:3000/auth/verifyOtp", {
      email,
      otp: code,
    });
    console.log(res);

    if (res.data.success) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80 text-center">
        <h2 className="mb-4 font-semibold">Enter OTP</h2>

        <div className="flex justify-between mb-4">
          {otp.map((value, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={value}
              maxLength="1"
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-10 h-12 border rounded text-center text-lg"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
