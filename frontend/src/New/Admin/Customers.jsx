import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_BASE_URL + "/user";

export default function Customers() {
  const navigate = useNavigate();
  const { token, _id } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const limit = 5;

  // FETCH USERS
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/getusers?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // DELETE USER
  const handleDelete = async (userId) => {
    if (userId === _id) {
      toast.error("You cannot delete your own account");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoadingDelete(userId);
    try {
      const res = await axios.delete(`${API}/deleteuser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "User deleted");
      fetchUsers(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoadingDelete(null);
    }
  };

  return (
    <div className="p-6 bg-[#F5F0E1] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-[#4B2E2B]">Customers</h1>

      <div className="overflow-x-auto bg-[#fff8f0] rounded shadow border border-[#D9C4A8]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#D9C4A8] text-[#4B2E2B] text-sm">
            <tr>
              <th className="p-3">Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-[#4B2E2B]">
                  Loading...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-[#D9C4A8] hover:bg-[#FFF3E0]"
                >
                  <td className="p-3">
                    <img
                      src={u.image || "/default-avatar.png"}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="text-[#4B2E2B]">{u.name}</td>
                  <td className="text-[#4B2E2B]">{u.email}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold ${
                        u.role === "admin"
                          ? "bg-yellow-500 text-[#0B1F3A]"
                          : "bg-[#D9C4A8] text-[#4B2E2B]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="text-right space-x-2">
                    <button
                      onClick={() => navigate(`/edituser/${u._id}`)}
                      className="p-2 text-[#4B2E2B] hover:bg-[#F1E0C5] rounded transition"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={loadingDelete === u._id}
                      className={`p-2 text-red-600 hover:bg-red-100 rounded transition ${
                        loadingDelete === u._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-[#4B2E2B]">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-[#F1E0C5] disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                page === currentPage
                  ? "bg-yellow-500 text-[#0B1F3A]"
                  : "hover:bg-[#F1E0C5]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-[#F1E0C5] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
