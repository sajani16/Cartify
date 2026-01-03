import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, cancelOrder } from "../../redux/slice/orderSlice";
import { toast } from "react-toastify";

export default function MyOrders() {
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleCancelOrder = async (orderId, status) => {
    // Only allow cancelling Pending or Processing orders
    if (!["Pending", "Processing"].includes(status)) return;

    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      toast.success("Order cancelled");
      dispatch(fetchMyOrders());
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
    }
  };

  if (loading)
    return <div className="text-center mt-20">Loading orders...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  if (!myOrders.length)
    return <div className="text-center mt-20">You have no orders.</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {myOrders.map((order) => (
          <div
            key={order._id}
            className={`bg-white shadow-md rounded-lg p-6 border transition-all ${
              order.status.toLowerCase() === "cancelled" ? " bg-gray-100" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <p>
                <span className="font-semibold">Order ID:</span> {order._id}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-bold ${
                    order.status.toLowerCase() === "pending"
                      ? "text-yellow-600"
                      : order.status.toLowerCase() === "processing"
                      ? "text-blue-600"
                      : order.status.toLowerCase() === "shipped"
                      ? "text-purple-600"
                      : order.status.toLowerCase() === "delivered"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>

            {/* Products in order */}
            <div className="space-y-2 mb-4">
              {order.products.map((item) => {
                const product = item.product; // Populated product from backend
                return (
                  <div
                    key={product?._id || Math.random()}
                    className="flex items-center gap-4 border-b py-2"
                  >
                    {product?.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-md" />
                    )}

                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0B1F3A]">
                        {product?.name || "Unknown Product"}
                      </h3>
                      <p className="text-gray-600">
                        ${product?.price} × {item.quantity} = $
                        {(product?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Amount */}
            <p className="font-bold text-lg mb-2">
              Total: ${order.totalAmount?.toFixed(2) || 0}
            </p>

            {/* Cancel button */}
            <button
              onClick={() => handleCancelOrder(order._id, order.status)}
              disabled={!["Pending", "Processing"].includes(order.status)}
              className={`px-4 py-2 rounded text-white transition-colors ${
                ["Pending", "Processing"].includes(order.status)
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Cancel Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
