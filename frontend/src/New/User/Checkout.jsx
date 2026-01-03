import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCart,
  removeCartItem,
} from "../../redux/slice/cartSlice";
import { createOrder } from "../../redux/slice/orderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Inline Checkout component
function Checkout({ items }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.order);

  const total = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  const handleConfirmOrder = async () => {
    try {
      await dispatch(createOrder()).unwrap();
      toast.success("Order placed successfully");
      dispatch(fetchCart());
      navigate("/"); // clear cart
    } catch (err) {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="w-1/3 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

      {items.map((item, idx) => (
        <div
          key={`${item.product?._id}-${idx}`}
          className="flex justify-between mb-2"
        >
          <div>
            {item.product?.name} × {item.quantity}
          </div>
          <div>${((item.product?.price || 0) * item.quantity).toFixed(2)}</div>
        </div>
      ))}

      <hr className="my-4" />

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button
        onClick={handleConfirmOrder}
        disabled={loading}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-500"
      >
        {loading ? "Placing Order..." : "Confirm Order"}
      </button>
    </div>
  );
}

export default function Cart() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const { items, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (token) dispatch(fetchCart());
  }, [dispatch, token]);

  const handleUpdateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCart({ productId, quantity })).unwrap();
      toast.success("Cart updated");
    } catch (err) {
      toast.error(err.message || "Failed to update cart");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeCartItem(productId)).unwrap();
      toast.success("Removed from cart");
    } catch (err) {
      toast.error(err.message || "Failed to remove item");
    }
  };

  if (!token)
    return (
      <div className="text-center mt-20">Please login to view your cart.</div>
    );
  if (loading) return <div className="text-center mt-20">Loading cart...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!items.length)
    return <div className="text-center mt-20">Your cart is empty.</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex gap-8">
      {/* Cart items */}
      <div className="flex-1 max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-bold text-[#0B1F3A] mb-6 text-center">
          Your Cart
        </h1>
        {items.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold text-[#0B1F3A]">
                  {item.product.name}
                </h3>
                <p className="text-gray-600">${item.product.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleUpdateQty(item.product._id, Number(e.target.value))
                }
                className="w-16 border rounded px-2 py-1"
              />
              <button
                onClick={() => handleRemove(item.product._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout / Bill */}
      <Checkout items={items} />
    </div>
  );
}
