import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddProduct() {
  const { token, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  // Admin check
  if (role !== "admin") {
    return (
      <div className="bg-[#0B1F3A] min-h-screen flex justify-center items-center p-6">
        <h2 className="text-2xl font-bold text-yellow-500">
          Admin Access Only
        </h2>
      </div>
    );
  }

  // Input change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // File change
  const handleFileChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.price ||
      !product.stock ||
      !product.category ||
      !product.image
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Send JSON data first
      const productData = {
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
      };

      const productRes = await axios.post(
        "http://localhost:3000/product/addProductData",
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const productId = productRes.data.product._id;

      // 2️⃣ Send image separately
      const fileData = new FormData();
      fileData.append("image", product.image);

      await axios.post(
        `http://localhost:3000/product/addProductImage/${productId}`,
        fileData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product added successfully");
      setProduct({ name: "", price: "", stock: "", category: "", image: null });
      navigate("/admin/adminproducts");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B1F3A] min-h-screen flex justify-center items-center p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-6 text-center">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {/* Image picker */}
          <label htmlFor="image" className="block cursor-pointer mb-4">
            {product.image ? (
              <img
                src={URL.createObjectURL(product.image)}
                alt="preview"
                className="w-full rounded-md object-cover aspect-video"
              />
            ) : (
              <div className="w-full aspect-video rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                Select Image
              </div>
            )}
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-yellow-500 text-[#0B1F3A] font-semibold py-2 rounded transition-colors duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-400"
            }`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
