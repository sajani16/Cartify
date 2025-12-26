import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // const { cart } = useSelector((state) => state.cart);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MyShop
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500"
                }
              >
                {name}
              </NavLink>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart
                size={24}
                className="text-gray-700 hover:text-blue-500"
              />
              {/* Uncomment if you have cart length */}
              {/* {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )} */}
            </Link>
            <Link to="/profile">
              <User size={24} className="text-gray-700 hover:text-blue-500" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navLinks.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setIsOpen(false)} // Close menu on click
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-500"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
