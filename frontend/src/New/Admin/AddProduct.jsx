import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const { token, role } = useSelector((state) => state.user);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // new loading state

  if (role !== "admin") {
    return (
      <div className="bg-[#0B1F3A] min-h-screen flex justify-center items-center p-6">
        <h2 className="text-2xl font-bold text-yellow-500">
          Admin Access Only
        </h2>
      </div>
    );
  }

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
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
      setError("All fields are required");
      return;
    }
    setError("");
    setLoading(true); // disable button

    try {
      const formData = new FormData();
      for (let key in product) {
        formData.append(key, product[key]);
      }

      const res = await axios.post(
        "http://localhost:3000/product/addProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert(res.data.message);
        setProduct({
          name: "",
          price: "",
          stock: "",
          category: "",
          image: null,
        });
        navigate("/adminproducts");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false); // enable button again
    }
  };

  return (
    <div className="bg-[#0B1F3A] min-h-screen flex justify-center items-center p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-6 text-center">
          Add New Product
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

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
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />

          <button
            type="submit"
            disabled={loading} // disable while loading
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
