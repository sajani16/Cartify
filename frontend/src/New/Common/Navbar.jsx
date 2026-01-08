import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { name } = useSelector((state) => state.user); // ✅ as requested

  // Guarded navigation
  const handleProtectedRoute = (path) => {
    if (!name) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-[#F4EFE9]/90 backdrop-blur sticky top-0 z-50 border-b border-[#E3D8CE]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-[#3B2F2F]"
          >
            Brew<span className="text-[#5C4033]">Café</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navClass}>
              Menu
            </NavLink>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <button
              onClick={() => handleProtectedRoute("/account/cart")}
              className="relative p-2 rounded-full hover:bg-[#E9DED4] transition"
            >
              <ShoppingCart className="w-5 h-5 text-[#3B2F2F]" />
              {items?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#5C4033] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => handleProtectedRoute("/account")}
              className="p-2 rounded-full hover:bg-[#E9DED4] transition"
            >
              <User className="w-5 h-5 text-[#3B2F2F]" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* Active / Inactive NavLink Styling */
const navClass = ({ isActive }) =>
  isActive
    ? "text-[#5C4033] font-semibold border-b-2 border-[#5C4033] pb-1"
    : "text-[#3B2F2F] hover:text-[#5C4033] transition";
