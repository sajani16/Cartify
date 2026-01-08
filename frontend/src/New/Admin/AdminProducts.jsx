import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slice/productSlice";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, totalPages } = useSelector((state) => state.product);
  const { token } = useSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setLoadingDelete(id);
    try {
      const res = await axios.delete(
        `http://localhost:3000/product/deleteProduct/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Product deleted successfully");
      dispatch(fetchProducts({ page: currentPage, limit }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setLoadingDelete(null);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6 min-h-screen bg-[#F5F0E1]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#4B2E2B]">Products</h1>
        <button
          onClick={() => navigate("/admin/addproduct")}
          className="bg-yellow-500 text-[#0B1F3A] px-4 py-2 rounded hover:bg-yellow-400 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#fff8f0] rounded shadow border border-[#D9C4A8]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#D9C4A8] text-[#4B2E2B] text-sm">
            <tr>
              <th className="p-3">Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((product) => (
              <tr
                key={product._id}
                className="border-t border-[#D9C4A8] hover:bg-[#FFF3E0] cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="font-medium">{product.name}</span>
                </td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      product.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? "Active" : "Out of Stock"}
                  </span>
                </td>
                <td
                  className="text-right space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* EDIT */}
                  <button
                    onClick={() =>
                      navigate(`/admin/editproduct/${product._id}`)
                    }
                    className="p-2 text-[#4B2E2B] hover:bg-[#F1E0C5] rounded transition"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={loadingDelete === product._id}
                    className={`p-2 text-red-600 hover:bg-red-100 rounded transition ${
                      loadingDelete === product._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border hover:bg-[#F1E0C5] disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded border ${
              page === currentPage
                ? "bg-yellow-500 text-[#0B1F3A]"
                : "hover:bg-[#F1E0C5]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border hover:bg-[#F1E0C5] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
