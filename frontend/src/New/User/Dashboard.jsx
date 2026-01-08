import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyOrders, cancelOrder } from "../../redux/slice/orderSlice";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  DollarSign,
  XCircle,
} from "lucide-react";

export default function AccountDashboard() {
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((state) => state.order);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const totalOrders = myOrders.length;
  const pendingOrders = myOrders.filter(
    (o) => o.status?.toLowerCase() === "pending"
  ).length;
  const completedOrders = myOrders.filter(
    (o) => o.status?.toLowerCase() === "delivered"
  ).length;
  const totalSpent = myOrders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0
  );

  const handleCancel = (id) => dispatch(cancelOrder(id));

  return (
    <div className="space-y-10 px-4 md:px-8 lg:px-16 py-8 min-h-screen bg-[#f9f5f0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#5C3A21]">Dashboard</h1>
          <p className="text-[#6B4B3A] mt-1">
            Welcome back, <span className="font-medium">{user?.name}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/products"
            className="px-4 py-2 text-sm bg-[#D97A2B] text-white rounded-md hover:bg-[#e08b3a] transition"
          >
            Shop Now
          </Link>
          <Link
            to="/account/profile"
            className="px-4 py-2 text-sm border border-[#D4B996] rounded-md hover:bg-[#fffaf5] transition"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<ShoppingBag size={20} />}
          title="Total Orders"
          value={totalOrders}
        />
        <StatCard
          icon={<Clock size={20} />}
          title="Pending"
          value={pendingOrders}
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          title="Completed"
          value={completedOrders}
        />
        <StatCard
          icon={<DollarSign size={20} />}
          title="Total Spent"
          value={`$${totalSpent}`}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <QuickAction to="/cart" label="View Cart" />
        <QuickAction to="/account/orders" label="Track Orders" />
        <QuickAction to="/products" label="Shop Again" />
        <QuickAction to="/account/profile" label="Account Settings" />
      </div>

      {/* Recent Orders */}
      <div className="bg-[#fffaf5] rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-[#5C3A21]">
            Recent Orders
          </h2>
          <Link
            to="/account/orders"
            className="text-sm text-[#D97A2B] hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-[#6B4B3A]">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : myOrders.length === 0 ? (
          <p className="text-[#6B4B3A]">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="text-left border-b border-[#D4B996] text-[#5C3A21]">
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-[#D4B996] last:border-none hover:bg-[#fff4e5] transition"
                  >
                    <td className="py-3 font-medium">{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="text-right font-medium">
                      ${Number(order.totalAmount || 0)}
                    </td>
                    <td className="text-center">
                      {["pending", "processing"].includes(
                        order.status.toLowerCase()
                      ) && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="text-red-600 hover:underline flex items-center gap-1 justify-center"
                        >
                          <XCircle size={16} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-[#fffaf5] rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-[#D97A2B]/20 text-[#D97A2B]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-[#6B4B3A]">{title}</p>
        <p className="text-2xl font-bold text-[#5C3A21]">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ to, label }) {
  return (
    <Link
      to={to}
      className="bg-[#fffaf5] border border-[#D4B996] rounded-lg p-4 text-center text-sm font-medium hover:bg-[#fff4e5] transition"
    >
      {label}
    </Link>
  );
}

function StatusBadge({ status }) {
  const styles =
    status?.toLowerCase() === "delivered"
      ? "bg-green-100 text-green-700"
      : ["pending", "processing"].includes(status?.toLowerCase())
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}
