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
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
      subItems: [
        { name: "Add Product", path: "/admin/addproduct", icon: Plus },
        { name: "All Products", path: "/admin/products", icon: FileText },
      ],
    },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
      <div className="p-6 text-xl font-bold border-b border-slate-700">
        {name}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menu.map(({ name, path, icon: Icon, subItems }) => {
          const hasSub = Array.isArray(subItems);
          return (
            <div key={name}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />
                {name}
              </NavLink>

              {hasSub && (
                <div className="pl-8 mt-1 flex flex-col space-y-1">
                  {subItems.map(
                    ({ name: subName, path: subPath, icon: SubIcon }) => (
                      <NavLink
                        key={subName}
                        to={subPath}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-4 py-1 rounded-lg text-sm transition ${
                            isActive
                              ? "bg-blue-500 text-white"
                              : "text-gray-400 hover:bg-slate-800"
                          }`
                        }
                      >
                        <SubIcon size={16} />
                        {subName}
                      </NavLink>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
        <button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          className="flex items-center gap-4 p-3 mt-6 rounded hover:bg-red-100 text-red-600 font-medium transition w-full text-left"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </nav>
    </aside>
  );
}
