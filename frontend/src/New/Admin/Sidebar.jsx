import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  Plus,
  FileText,
  LogOut,
} from "lucide-react";
import { logout } from "../../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar() {
  const { name } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Add Product", path: "/admin/addproduct", icon: Plus },
    { name: "All Products", path: "/admin/products", icon: FileText },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-[#FAF5F0] text-[#4B2E2B] flex flex-col sticky top-0 h-screen">
      {/* Header */}
      <div className="p-6 text-xl font-bold border-b border-[#D9C4A8] truncate">
        {name || "Admin"}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menu.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-[#4B2E2B] text-[#FAF5F0] font-semibold"
                  : "hover:bg-[#E3D3C1]"
              }`
            }
          >
            <Icon size={20} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout (fixed at bottom) */}
      <div className="p-4 border-t border-[#D9C4A8]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg
                     text-[#4B2E2B] hover:bg-[#4B2E2B] hover:text-[#FAF5F0]
                     transition font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
