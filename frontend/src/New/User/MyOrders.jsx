import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API = "http://localhost:3000/order";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.user);

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`${API}/myorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data); // backend returns array directly
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyOrders();
  }, [token]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      const res = await axios.put(
        `${API}/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-5">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">
                  Order ID: {order._id}
                </span>

                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full
                  ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* Products */}
              <div className="divide-y">
                {order.products?.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">
                  Total: ₹{order.totalAmount}
                </span>

                {order.status === "pending" && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="text-red-600 border border-red-600 px-4 py-1 rounded hover:bg-red-600 hover:text-white transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
