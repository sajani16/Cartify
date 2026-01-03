import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar appears on all pages */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 p-6">
        <Outlet /> {/* Nested user pages render here */}
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-4 border-t border-gray-200 text-gray-600">
        &copy; {new Date().getFullYear()} MyShop. All rights reserved.
      </footer>
    </div>
  );
}
