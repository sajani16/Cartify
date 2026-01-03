import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addToCart as addToCartThunk } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const role = useSelector((state) => state.user.role);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      await dispatch(
        addToCartThunk({ productId: product._id, quantity: Number(qty) })
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
      await axios.delete(`http://localhost:3000/product/deleteProduct/${id}`);
      toast.success("Product deleted");
      navigate("/products");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <div className="max-w-5xl bg-white rounded-lg shadow-lg grid md:grid-cols-2 gap-8 p-6">
        {/* IMAGE */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-md"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold text-[#0B1F3A]">{product.name}</h1>
          <p className="text-2xl text-orange-600 font-semibold mt-2">
            ₹{product.price}
          </p>
          <p className="mt-4 text-gray-600">
            {product.description ||
              "High quality product with premium materials."}
          </p>

          {/* Quantity */}
          {role !== "admin" && (
            <div className="mt-6 flex items-center gap-3">
              <span className="font-medium">Quantity:</span>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-20 border rounded px-2 py-1"
              />
            </div>
          )}

          {/* USER BUTTON */}
          {role !== "admin" && (
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-yellow-500 text-[#0B1F3A] px-6 py-3 rounded font-semibold hover:bg-yellow-400"
            >
              Add to Cart
            </button>
          )}

          {/* ADMIN BUTTONS */}
          {role === "admin" && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate(`/editproduct/${id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                Edit Product
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
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
