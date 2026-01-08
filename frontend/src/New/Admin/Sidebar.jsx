import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Pencil,
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

  return (
    <aside className="w-64 bg-[#FAF5F0] text-[#4B2E2B] flex flex-col sticky top-0 h-screen">
      <div className="p-6 text-xl font-bold border-b border-[#D9C4A8]">
        {name}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menu.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-[#4B2E2B] text-[#FAF5F0] font-semibold"
                  : "text-[#4B2E2B] hover:bg-[#E3D3C1]"
              }`
            }
          >
            <Icon size={20} />
            {name}
          </NavLink>
        ))}

        <button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          className="flex items-center gap-4 p-3 mt-6 rounded hover:bg-[#4B2E2B] text-[#FAF5F0] font-medium transition w-full text-left"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </nav>
    </aside>
  );
}
