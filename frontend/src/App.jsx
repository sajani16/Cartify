import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./New/Auth/Login";
import Otp from "./New/Auth/Otp";
import Register from "./New/Auth/Register";
import AdminDashboard from "./New/Admin/AdminDashboard";
import Settings from "./New/Admin/Settings";
import Customers from "./New/Admin/Customers";
import AddProduct from "./New/Admin/AddProduct";
import Layout from "./New/Admin/Layout";
import AdminProducts from "./New/Admin/AdminProducts";
import EditProduct from "./New/Admin/EditProduct";
import ProductDetail from "./New/Product/ProductDetails";
import UserLayout from "./New/User/UserLayout";
import Home from "./New/User/Home";
import Products from "./New/Product/Products";
import AdminOrders from "./New/Admin/Orders";
import MyOrders from "./New/User/MyOrders";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/otp" element={<Otp />}></Route>
        <Route path="/" element={<Layout />}>
          <Route path="/addproduct" element={<AddProduct />}></Route>
          <Route path="/orders" element={<AdminOrders />}></Route>
          <Route path="/customers" element={<Customers />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
          <Route path="/adminproducts" element={<AdminProducts />}></Route>

          <Route path="/editproduct/:id" element={<EditProduct />}></Route>
          <Route path="/" element={<AdminDashboard />}></Route>
        </Route>
        <Route path="/" element={<UserLayout />}>
          <Route path="/user" element={<Home />}></Route>
          <Route path="/productdetail/:id" element={<ProductDetail />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/myorders" element={<MyOrders />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
