import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CATEGORIES = [
  "Espresso",
  "Latte",
  "Cappuccino",
  "Cold Brew",
  "Desserts",
  "Snacks",
  "Others",
];

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AddProduct() {
  const { token, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    isTrending: false,
    isOnSale: false,
    salePrice: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  if (role !== "admin") {
    return (
      <div className="bg-[#4B3621] min-h-screen flex justify-center items-center px-4">
        <h2 className="text-3xl font-bold text-[#D9A066] text-center">
          Admin Only
        </h2>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.price ||
      !product.stock ||
      !product.category ||
      !product.image
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (product.isOnSale && !product.salePrice) {
      toast.error("Please provide sale price for on-sale product");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(product).forEach((key) => {
        if (key === "image" && product[key]) {
          formData.append(key, product[key]);
        } else if (product[key] !== null) {
          formData.append(key, product[key]);
        }
      });

      const res = await axios.post(`${BASE_URL}/product/addProduct`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#4B3621] min-h-screen flex justify-center items-start pt-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#F5F0E1] w-full max-w-xl p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#4B3621] mb-6 text-center">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="border border-[#D9A066] px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#D9A066] w-full"
          />

          {/* Price & Stock */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
              className="border border-[#D9A066] px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#D9A066] flex-1"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={product.stock}
              onChange={handleChange}
              className="border border-[#D9A066] px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#D9A066] flex-1"
            />
          </div>

          {/* Category */}
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="border border-[#D9A066] px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#D9A066] w-full"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            rows={4}
            className="border border-[#D9A066] px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#D9A066] resize-none w-full"
          />

          {/* Trending & Sale */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isTrending"
                checked={product.isTrending}
                onChange={handleChange}
                className="w-5 h-5 accent-[#D9A066]"
              />
              Trending
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isOnSale"
                checked={product.isOnSale}
                onChange={handleChange}
                className="w-5 h-5 accent-[#D9A066]"
              />
              On Sale
            </label>
          </div>

          {product.isOnSale && (
            <input
              type="number"
              name="salePrice"
              placeholder="Sale Price"
              value={product.salePrice}
              onChange={handleChange}
              className="border border-[#D9A066] px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#D9A066] w-full"
            />
          )}

          {/* Image Picker */}
          <label className="block cursor-pointer mt-2">
            {product.image ? (
              <img
                src={URL.createObjectURL(product.image)}
                alt="preview"
                className="w-full h-60 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-60 bg-[#D9C7A0] flex items-center justify-center rounded-lg text-[#4B3621] font-medium">
                Click to select image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-[#D9A066] text-[#4B3621] py-3 rounded-lg font-semibold transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#C79E6E]"
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
