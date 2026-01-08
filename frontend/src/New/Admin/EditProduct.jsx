import React, { useState, useEffect } from "react";
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
    description: "",
    isTrending: false,
    isOnSale: false,
    salePrice: "",
    image: null,
    oldImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Load product data
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
          description: p.description,
          isTrending: p.isTrending,
          isOnSale: p.isOnSale,
          salePrice: p.salePrice || "",
          image: null,
          oldImage: p.image,
        });
      } catch (err) {
        toast.error("Failed to load product");
      }
    }
    fetchProduct();
  }, [id, role, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (product.isOnSale && !product.salePrice) {
      toast.error("Sale price is required for on-sale products");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      formData.append("description", product.description);
      formData.append("isTrending", product.isTrending);
      formData.append("isOnSale", product.isOnSale);
      if (product.isOnSale) formData.append("salePrice", product.salePrice);
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

      toast.success(res.data.message || "Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product permanently?")) return;
    setLoadingDelete(true);
    try {
      const res = await axios.delete(
        `http://localhost:3000/product/deleteProduct/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message || "Product deleted");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="bg-[#0B1F3A] min-h-screen flex justify-center items-start p-4 sm:p-6 lg:p-8">
      <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] mb-6 text-center">
          Edit Product
        </h2>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4 sm:gap-5">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 w-full"
          />

          {/* Price & Stock */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 flex-1"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={product.stock}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 flex-1"
            />
          </div>

          {/* Category */}
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 w-full"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            rows={4}
            className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 w-full resize-none"
          />

          {/* Trending & On Sale */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isTrending"
                checked={product.isTrending}
                onChange={handleChange}
                className="w-5 h-5 accent-yellow-500"
              />
              Trending
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isOnSale"
                checked={product.isOnSale}
                onChange={handleChange}
                className="w-5 h-5 accent-yellow-500"
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
              className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 w-full"
            />
          )}

          {/* Image Preview */}
          <label className="block cursor-pointer mt-2">
            {product.image ? (
              <img
                src={URL.createObjectURL(product.image)}
                alt="preview"
                className="w-full h-60 object-cover rounded-lg"
              />
            ) : (
              <img
                src={product.oldImage}
                alt="product"
                className="w-full h-60 object-cover rounded-lg"
              />
            )}
            <input type="file" hidden onChange={handleFileChange} />
          </label>

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-yellow-500 text-[#0B1F3A] py-3 rounded-lg font-semibold transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-400"
            }`}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

          <button
            type="button"
            disabled={loadingDelete}
            onClick={handleDelete}
            className={`border border-red-500 text-red-600 py-3 rounded-lg font-semibold transition ${
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
