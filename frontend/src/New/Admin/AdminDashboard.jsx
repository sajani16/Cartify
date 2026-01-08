export default function Dashboard() {
  const cardClasses =
    "p-6 rounded shadow bg-[#F5F0E1] text-[#4B3621] flex flex-col items-center justify-center";

  return (
    <div className="p-6 bg-[#F3E9DC] min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-[#4B3621] text-center">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className={cardClasses}>
          <h2 className="text-lg font-medium mb-2">Total Sales</h2>
          <p className="text-2xl font-bold">₹12,345</p>
        </div>

        <div className={cardClasses}>
          <h2 className="text-lg font-medium mb-2">Orders</h2>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className={cardClasses}>
          <h2 className="text-lg font-medium mb-2">Customers</h2>
          <p className="text-2xl font-bold">85</p>
        </div>
      </div>
    </div>
  );
}
