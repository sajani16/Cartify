import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

export default function AdminLayout() {
  const {role} = useSelector((state) => state.user);
  // or useSelector((state) => state.user)

  // ❌ No user or not admin → kick them out
  if (role !== "admin") {
    return <Navigate to="/user" replace />;
  }

  // ✅ Admin only
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
