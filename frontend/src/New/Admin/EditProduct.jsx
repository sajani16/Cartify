import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, role } = useSelector((state) => state.user);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: null,
    oldImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (role !== "admin") navigate("/");

    async function fetchProduct() {
      try {
        const res = await axios.get(
          `http://localhost:3000/product/getProduct/${id}`
        );
        const p = res.data.product;

        setProduct({
          name: p.name,
          price: p.price,
          stock: p.stock,
          category: p.category,
          image: null,
          oldImage: p.image,
        });
      } catch (err) {
        toast.error("Failed to load product");
      }
    }

    fetchProduct();
  }, [id, role, navigate]);

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      if (product.image) formData.append("image", product.image);

      const res = await axios.put(
        `http://localhost:3000/product/updateProduct/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product updated successfully");
        navigate(`/products/${id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this product permanently?")) return;
    setLoadingDelete(true);

    try {
      const res = await axios.delete(
        `http://localhost:3000/product/deleteProduct/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message || "Product deleted successfully");
      navigate("/admin/adminproducts");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <div className="bg-[#0B1F3A] min-h-screen flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4 text-center">
          Edit Product
        </h2>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Product Name"
          />

          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Price"
          />

          <input
            type="number"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Stock"
          />

          <input
            type="text"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Category"
          />

          {/* Image Preview */}
          <label className="cursor-pointer">
            {product.image ? (
              <img
                src={URL.createObjectURL(product.image)}
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <img
                src={product.oldImage}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <input
              type="file"
              hidden
              onChange={(e) =>
                setProduct({ ...product, image: e.target.files[0] })
              }
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`bg-yellow-500 text-[#0B1F3A] py-2 rounded font-semibold transition-colors duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-400"
            }`}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loadingDelete}
            className={`border border-red-500 text-red-600 py-2 rounded font-semibold transition-colors duration-200 ${
              loadingDelete
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-50"
            }`}
          >
            {loadingDelete ? "Deleting..." : "Delete Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
