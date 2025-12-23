import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ admin = false }) {
  const { token, role } = useSelector((state) => state.user);
  if (!token) return <Navigate to="/login" />;
  if (admin && role !== "admin") return <Navigate to="/" />;
  return <Outlet />;
}

export default ProtectedRoute;
