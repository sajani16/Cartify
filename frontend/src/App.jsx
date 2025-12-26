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
import Orders from "./New/Admin/Orders";
import Products from "./New/Admin/AdminProducts";
import EditProduct from "./New/Admin/EditProduct";
import ProductDetail from "./New/Product/ProductDetails";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/otp" element={<Otp />}></Route>
        <Route path="/" element={<Layout />}>
          <Route path="/addproduct" element={<AddProduct />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/customers" element={<Customers />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
          <Route path="/adminproducts" element={<Products />}></Route>
          <Route path="/productdetails/:id" element={<ProductDetail />}></Route>
          <Route path="/editproduct/:id" element={<EditProduct />}></Route>
          <Route path="/" element={<AdminDashboard />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
