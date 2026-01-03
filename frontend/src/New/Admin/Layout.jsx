import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

export default function AdminLayout() {
  const { role } = useSelector((state) => state.user);

  // ❌ Kick out if not admin
  if (role !== "admin") {
    return <Navigate to="/user" replace />;
  }

  // ✅ Admin layout
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet /> {/* Nested admin pages will render here */}
      </main>
    </div>
  );
}
