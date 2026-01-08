import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../../redux/slice/orderSlice";
import { toast } from "react-toastify";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { allOrders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus })
      ).unwrap();
      toast.success("Order status updated");
    } catch (err) {
      toast.error(err || "Failed to update status");
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err || "Failed to cancel order");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-yellow-500">Loading orders...</div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!allOrders || allOrders.length === 0)
    return (
      <div className="text-center mt-10 text-yellow-500">No orders found.</div>
    );

  const STATUS_OPTIONS = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="p-8 min-h-screen bg-[#F5F0E1]">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#4B2E2B]">
        All Orders
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#fff8f0] rounded shadow-md border border-[#D9C4A8]">
          <thead>
            <tr className="bg-[#D9C4A8] text-[#4B2E2B] text-left">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr key={order._id} className="border-b border-[#D9C4A8]">
                <td className="px-4 py-2">{order._id}</td>
                <td className="px-4 py-2">{order.user?.name || "N/A"}</td>
                <td className="px-4 py-2">
                  {order.products.map((p) => (
                    <div key={p._id}>
                      {p.name} x{p.quantity}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2">
                  ₹{order.totalAmount?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2 flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.filter(
                    (s) =>
                      s !== order.status &&
                      order.status !== "Delivered" &&
                      order.status !== "Cancelled"
                  ).map((s) => (
                    <button
                      key={s}
                      className={`px-2 py-1 rounded text-white font-semibold ${
                        s === "Pending"
                          ? "bg-[#8B5E3C]"
                          : s === "Processing"
                          ? "bg-[#C19A6B]"
                          : s === "Shipped"
                          ? "bg-[#D9A066]"
                          : s === "Delivered"
                          ? "bg-gray-600"
                          : "bg-red-600"
                      } hover:opacity-90 transition`}
                      onClick={() => handleStatusChange(order._id, s)}
                    >
                      {s}
                    </button>
                  ))}

                  {["Pending", "Processing"].includes(order.status) && (
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded hover:opacity-90 transition"
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
