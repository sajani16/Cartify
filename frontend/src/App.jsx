import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth Pages
import Login from "./New/Auth/Login";
import Register from "./New/Auth/Register";
import Otp from "./New/Auth/Otp";

// Admin Pages & Layout
import Layout from "./New/Admin/Layout";
import AdminDashboard from "./New/Admin/AdminDashboard";
import AddProduct from "./New/Admin/AddProduct";
import EditProduct from "./New/Admin/EditProduct";
import AdminProducts from "./New/Admin/AdminProducts";
import Customers from "./New/Admin/Customers";
import Settings from "./New/Admin/Settings";

// User Pages & Layout
import UserLayout from "./New/User/UserLayout";
import Home from "./New/User/Home";
import Products from "./New/Product/Products";
import ProductDetail from "./New/Product/ProductDetails";
import Cart from "./New/User/Cart";
import MyOrders from "./New/User/MyOrders";
import AdminOrders from "./New/Admin/AdminOrders";
import Checkout from "./New/User/Checkout";
import EditUser from "./New/Admin/EditUser";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Global Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />

        {/* Admin routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="editproduct/:id" element={<EditProduct />} />
          <Route path="edituser/:id" element={<EditUser />} />
          <Route path="adminproducts" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* User routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="myorders" element={<MyOrders />} />
        </Route>

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="text-center mt-20 text-xl text-red-500">
              Page Not Found
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
