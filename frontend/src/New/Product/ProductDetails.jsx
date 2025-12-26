import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.user);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(
          `http://localhost:3000/product/getProduct/${id}`
        );
        setProduct(res.data.product);
      } catch (err) {
        setError("Failed to load product");
      }
    }
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`http://localhost:3000/product/deleteProduct/${id}`);
      navigate("/products");
    } catch {
      alert("Failed to delete product");
    }
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!product) return <p className="text-center">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-8 grid md:grid-cols-2 gap-10">
        {/* IMAGE SECTION */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-105 object-contain rounded"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {product.name}
          </h1>

          <p className="text-2xl text-orange-600 font-bold mt-2">
            ₹{product.price}
          </p>

          <p className="mt-4 text-gray-600">
            High quality product with premium materials and excellent
            durability.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="font-medium">Quantity</span>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-20 border rounded px-2 py-1"
            />
          </div>

          {/* USER ACTION */}
          {role !== "admin" && (
            <button className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400">
              Add to Cart
            </button>
          )}

          {/* ADMIN ACTIONS */}
          {role === "admin" && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate(`/editproduct/${id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit Product
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
