import { X, LayoutDashboard, Package, User, Lock, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserSidebar({ open, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-10" : "opacity-0"
        }`}
      />

      {/* Sidebar Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="font-bold text-xl text-[#0B1F3A]">My Account</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 flex flex-col px-6 py-6 space-y-3">
          <Link
            to="/account"
            className="flex items-center gap-4 p-3 rounded hover:bg-[#0B1F3A]/10 text-[#0B1F3A] font-medium transition"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>

          <Link
            to="/account/myorders"
            className="flex items-center gap-4 p-3 rounded hover:bg-[#0B1F3A]/10 text-[#0B1F3A] font-medium transition"
          >
            <Package className="w-5 h-5" /> Orders
          </Link>

          <Link
            to="/account/profile"
            className="flex items-center gap-4 p-3 rounded hover:bg-[#0B1F3A]/10 text-[#0B1F3A] font-medium transition"
          >
            <User className="w-5 h-5" /> Profile
          </Link>

          <Link
            to="/account/cart"
            className="flex items-center gap-4 p-3 rounded hover:bg-[#0B1F3A]/10 text-[#0B1F3A] font-medium transition"
          >
            <Lock className="w-5 h-5" /> Change Password
          </Link>

          <button className="flex items-center gap-4 p-3 mt-6 rounded hover:bg-red-100 text-red-600 font-medium transition w-full text-left">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
