import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addToCart as addToCartThunk } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import Reviews from "./Reviews";

// Use Vite env variable
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.user);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`${BASE_URL}/product/getProduct/${id}`);
        setProduct(res.data.product);

        const reviewRes = await axios.get(`${BASE_URL}/reviews/${id}`);
        setReviews(reviewRes.data.reviews || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load product or reviews");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) return toast.error("Please login first");

    try {
      await dispatch(
        addToCartThunk({ productId: product._id, quantity: Number(qty) }),
      ).unwrap();
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add to cart");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${BASE_URL}/product/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      navigate("/products");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-brown-300">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#f9f5f0] py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto bg-[#fffaf5] shadow-lg rounded-xl overflow-hidden md:flex">
        {/* Product Image */}
        <div className="md:w-1/2 bg-[#f3e9dc] flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-96 rounded-lg shadow-sm"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#5C3A21]">
              {product.name}
            </h1>
            {product.isOnSale ? (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-400 line-through text-lg">
                  ${product.price}
                </span>
                <span className="text-[#D97A2B] font-semibold text-2xl">
                  ${product.salePrice}
                </span>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-[#5C3A21] mt-2">
                ₹{product.price}
              </p>
            )}
            <p className="mt-4 text-[#6B4B3A]">
              {product.description || "High-quality product."}
            </p>
            <p
              className={`mt-4 font-medium ${
                product.stock > 0 ? "text-green-700" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:gap-4">
            {role !== "admin" && product.stock > 0 && (
              <>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-24 border border-[#D4B996] rounded px-2 py-1 mb-3 md:mb-0 focus:outline-none focus:ring-2 focus:ring-[#D97A2B]"
                />
                <button
                  onClick={handleAddToCart}
                  className="bg-[#D97A2B] text-white font-semibold px-6 py-2 rounded hover:bg-[#e08b3a] transition"
                >
                  Add to Cart
                </button>
              </>
            )}

            {role === "admin" && (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/admin/editproduct/${id}`)}
                  className="bg-[#5C3A21] text-white px-4 py-2 rounded hover:bg-[#7a4f2e] transition"
                >
                  Edit Product
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition"
                >
                  Delete Product
                </button>
              </div>
            )}
          </div>

          {/* Reviews */}
        </div>
      </div>
      <div className="max-w-4xl mt-10 mx-30 px-4 py-2 shadow-lg overflow-hidden ">
        <Reviews
          productId={product._id}
          reviews={reviews}
          setReviews={setReviews}
          token={token}
        />
      </div>
    </div>
  );
}
