import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const API = "http://localhost:3000/user";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, _id, role } = useSelector((state) => state.user);

  const targetUserId = id || _id;
  const isAdmin = role === "admin";
  const isSelf = _id === targetUserId;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Authorization check
  useEffect(() => {
    if (!isAdmin && !isSelf) {
      toast.error("Not authorized");
      navigate("/");
    }
  }, [isAdmin, isSelf, navigate]);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/getuser/${targetUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data.user;
        setForm({
          name: u.name,
          email: u.email,
          password: "",
          role: u.role,
        });
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load user");
        navigate(-1);
      }
    };
    fetchUser();
  }, [targetUserId, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Admin editing other: disable email/password
    if (isAdmin && !isSelf && (name === "email" || name === "password")) return;
    // User cannot change role
    if (!isAdmin && name === "role") return;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = { name: form.name };

      if (isAdmin && !isSelf) payload.role = form.role; // Admin can edit role
      if (isSelf) {
        payload.email = form.email;
        if (form.password.trim()) payload.password = form.password;
      }

      const res = await axios.put(
        `${API}/updateuser/${targetUserId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "User updated");

      // refresh form to reflect DB
      setForm((f) => ({
        ...f,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        password: "",
      }));

      if (isAdmin && !isSelf) navigate("/admin/customers");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isAdmin && !isSelf ? "Edit Customer" : "Edit Profile"}
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={isAdmin && !isSelf}
            className={`w-full border px-3 py-2 rounded ${
              isAdmin && !isSelf ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          {isAdmin && !isSelf ? (
            <input
              type="password"
              value="********"
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            />
          ) : (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="w-full border px-3 py-2 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={!isAdmin || isSelf}
            className={`w-full border px-3 py-2 rounded ${
              !isAdmin || isSelf ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
