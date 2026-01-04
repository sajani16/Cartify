import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  User,
  LogOut,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slice/userSlice"; // adjust path

export default function AccountLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r px-6 py-8 sticky top-0 h-screen">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-8">My Account</h2>

        <nav className="flex flex-col space-y-2">
          <NavLink to="/account" end className={linkClass}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>

          <NavLink to="/account/orders" className={linkClass}>
            <Package className="w-5 h-5" /> My Orders
          </NavLink>

          <NavLink to={`/account/edituser/${_id}`} className={linkClass}>
            <User className="w-5 h-5" /> Update Profile
          </NavLink>

          <NavLink to="/account/cart" className={linkClass}>
            <ShoppingCart className="w-5 h-5" /> My Cart
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-10 overflow-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-[#0B1F3A]"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <Outlet />
      </main>
    </div>
  );
}

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
    isActive
      ? "bg-[#0B1F3A]/10 text-[#0B1F3A]"
      : "text-gray-700 hover:bg-gray-100"
  }`;
