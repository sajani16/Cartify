import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

function Dashboard() {
  const { role } = useSelector((state) => state.user);
  return <div>{role == "admin" ? <AdminDashboard /> : <UserDashboard />}</div>;
}

export default Dashboard;
