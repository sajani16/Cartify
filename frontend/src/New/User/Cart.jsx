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

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.user.token);
  const { items, loading, error } = useSelector((state) => state.cart);
  const orderLoading = useSelector((state) => state.order.loading);

  useEffect(() => {
    if (token) dispatch(fetchCart());
  }, [dispatch, token]);

  const handleUpdateQty = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCart({ productId, quantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeCartItem(productId));
  };

  const handleConfirmOrder = async () => {
    const orderData = {
      items: items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price,
      })),
      totalPrice: items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      ),
    };

    console.log("ORDER PAYLOAD:", orderData); // DEBUG — DO NOT REMOVE YET

    try {
      await dispatch(createOrder(orderData)).unwrap();
      toast.success("Order placed successfully");
      dispatch(fetchCart());
      navigate("/");
    } catch (err) {
      toast.error(err);
    }
  };

  if (!token) return <div className="mt-20 text-center">Login required</div>;
  if (loading) return <div className="mt-20 text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!items.length)
    return <div className="mt-20 text-center">Cart is empty</div>;

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex gap-8">
      {/* Cart */}
      <div className="flex-1 bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

        {items.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between border-b py-4"
          >
            <div>
              <h3 className="font-semibold">{item.product.name}</h3>
              <p>${item.product.price}</p>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleUpdateQty(item.product._id, +e.target.value)
                }
                className="w-16 border px-2"
              />
              <button
                onClick={() => handleRemove(item.product._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="w-1/3 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        {items.map((item) => (
          <div
            key={`summary-${item.product._id}`}
            className="flex justify-between mb-2"
          >
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>${item.product.price * item.quantity}</span>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total}</span>
        </div>

        <button
          disabled={orderLoading}
          onClick={handleConfirmOrder}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded"
        >
          {orderLoading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
