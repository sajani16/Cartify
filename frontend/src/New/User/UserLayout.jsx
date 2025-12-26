import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar appears on all pages */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet /> {/* Nested user pages render here */}
      </main>
      {/* Optional footer */}
      <footer className="bg-white text-center py-4 border-t border-gray-200">
        &copy; {new Date().getFullYear()} MyShop. All rights reserved.
      </footer>
    </div>
  );
}
