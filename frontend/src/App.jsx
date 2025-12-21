import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./Pages/Register";
import Otp from "./Pages/Otp";
import Login from "./Pages/Login";
import Home from "./Pages/Home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
