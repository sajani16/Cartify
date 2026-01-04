import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth Pages
import Login from "./New/Auth/Login";
import Register from "./New/Auth/Register";
import Otp from "./New/Auth/Otp";

// Layouts
import UserLayout from "./New/User/UserLayout";
import AccountLayout from "./New/User/AccountLayout";
import AdminLayout from "./New/Admin/Layout";

// User Pages
import Home from "./New/User/Home";
import Products from "./New/Product/Products";
import ProductDetail from "./New/Product/ProductDetails";
import Cart from "./New/User/Cart";
import EditUser from "./New/Admin/EditUser";
import AccountDashboard from "./New/User/Dashboard";
import Profile from "./New/User/Profile";
import MyOrders from "./New/User/MyOrders";

// Admin Pages
import AdminDashboard from "./New/Admin/AdminDashboard";
import AdminOrders from "./New/Admin/AdminOrders";
import AdminProducts from "./New/Admin/AdminProducts";
import Settings from "./New/Admin/Settings";
import Customers from "./New/Admin/Customers";
import AddProduct from "./New/Admin/AddProduct";

export default function App() {
  return (
    <Routes>
      {/* ================= Public Routes ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<Otp />} />

      {/* ================= Admin Protected Routes ================= */}
      <Route element={<ProtectedRoute admin={true} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* ================= User Protected Routes ================= */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<UserLayout />}>
          {/* Main site */}
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />

          {/* Account Pages */}
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<AccountDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edituser/:id" element={<EditUser />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="cart" element={<Cart />} />
          </Route>
        </Route>
      </Route>

      {/* ================= 404 Fallback ================= */}
      <Route
        path="*"
        element={
          <div className="text-center mt-20 text-xl text-red-500">
            Page Not Found
          </div>
        }
      />
    </Routes>
  );
}
