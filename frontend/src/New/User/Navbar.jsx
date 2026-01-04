import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { items } = useSelector((state) => state.cart);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#0B1F3A]">
            MyShop
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navClass}>
              Products
            </NavLink>
            <NavLink to="/categories" className={navClass}>
              Categories
            </NavLink>
            <NavLink to="/deals" className={navClass}>
              Deals
            </NavLink>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/account/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#0B1F3A]" />
              {items?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              to="/account"
              className="p-1 rounded-full hover:bg-gray-100 transition"
            >
              <User className="w-6 h-6 text-[#0B1F3A]" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

const navClass = ({ isActive }) =>
  isActive
    ? "text-[#0B1F3A] font-semibold"
    : "text-gray-700 hover:text-[#0B1F3A] transition";
