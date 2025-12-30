import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/allorders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdating(true);
      await axios.put(
        `/order/updateorderstatus/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchOrders(); // refresh after update
      setUpdating(false);
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      setUpdating(true);
      await axios.delete(`/order/cancelorder/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
      setUpdating(false);
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Products</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{order._id}</td>
                  <td className="px-4 py-2">{order.user?.name || "N/A"}</td>
                  <td className="px-4 py-2">
                    {order.products.map((p) => (
                      <div key={p.product._id}>
                        {p.product.name} x {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">${order.totalAmount}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                      disabled={updating}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      disabled={updating}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center text-gray-500 p-4">No orders found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Orders;
