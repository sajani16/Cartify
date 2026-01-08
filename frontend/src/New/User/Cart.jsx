import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCart,
  removeCartItem,
} from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Checkout from "./Checkout";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const { items, loading, error } = useSelector((state) => state.cart);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (!token) navigate("/login");
    else dispatch(fetchCart());
  }, [dispatch, token, navigate]);

  useEffect(() => {
    setSelectedItems(items.map((item) => item.product._id.toString()));
  }, [items]);

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleUpdateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCart({ productId, quantity })).unwrap();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeCartItem(productId)).unwrap();
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
    } catch {
      toast.error("Failed to remove item");
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-[#6B4B3A]">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!items.length)
    return (
      <div className="text-center mt-20 text-[#6B4B3A]">
        Your cart is empty.
      </div>
    );

  const itemsToCheckout = items.filter((item) =>
    selectedItems.includes(item.product._id.toString())
  );

  return (
    <div className="min-h-screen bg-[#f9f5f0] px-4 md:px-10 py-8">
      <h1 className="text-3xl md:text-4xl font-semibold text-[#5C3A21] mb-8 text-center">
        Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* CART LIST */}
        <div className="flex-1 bg-[#fffaf5] rounded-xl shadow-sm p-4 md:p-6">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b last:border-none"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.product._id.toString())}
                  onChange={() => toggleSelect(item.product._id.toString())}
                  className="w-5 h-5 accent-[#D97A2B]"
                />

                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-[#D4B996]"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-[#5C3A21]">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-[#6B4B3A] mt-1">
                    ${item.product.price}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0 flex-wrap sm:flex-nowrap">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQty(item.product._id, Number(e.target.value))
                  }
                  className="w-16 border rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-[#D97A2B]"
                />

                <span className="font-semibold text-[#5C3A21]">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CHECKOUT */}
        <div className="lg:w-1/3">
          <Checkout items={itemsToCheckout} />
        </div>
      </div>
    </div>
  );
}
