import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/slice/orderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Checkout({ items }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.order);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const total = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    if (!items.length) {
      toast.error("Select at least one item");
      return;
    }

    const selectedProductIds = items.map((i) => i.product._id.toString());

    try {
      await dispatch(
        createOrder({ shippingAddress, paymentMethod, selectedProductIds })
      ).unwrap();

      toast.success("Order placed successfully");
      navigate("/");
    } catch (err) {
      toast.error(err || "Failed to place order");
    }
  };

  return (
    <div className="bg-[#fffaf5] rounded-xl shadow-md p-6 sticky top-4 md:top-8 w-full md:w-full lg:w-full">
      <h2 className="text-2xl font-semibold text-[#5C3A21] mb-4 text-center md:text-left">
        Order Summary
      </h2>

      {/* SELECTED ITEMS */}
      <div className="space-y-2 text-sm text-[#6B4B3A] max-h-60 overflow-y-auto mb-4">
        {items.length === 0 && (
          <p className="text-gray-500 text-center">No items selected</p>
        )}
        {items.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between border-b border-[#D4B996] pb-2"
          >
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#D4B996] my-4"></div>

      <div className="flex justify-between font-semibold text-lg mb-6 text-[#5C3A21]">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* SHIPPING */}
      <h3 className="font-medium text-[#5C3A21] mb-2">Shipping Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {Object.keys(shippingAddress).map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={shippingAddress[field]}
            onChange={handleChange}
            className="border border-[#D4B996] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97A2B]"
            required
          />
        ))}
      </div>

      {/* PAYMENT */}
      <h3 className="font-medium text-[#5C3A21] mt-2 mb-2">Payment Method</h3>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="border border-[#D4B996] rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#D97A2B]"
      >
        <option value="COD">Cash on Delivery</option>
        <option value="FakeCard">Demo Card</option>
      </select>

      <button
        onClick={handleConfirmOrder}
        disabled={loading}
        className="mt-6 w-full bg-[#D97A2B] text-white py-3 rounded-lg hover:bg-[#e08b3a] transition font-semibold"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
