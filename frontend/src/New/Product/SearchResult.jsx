import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../../redux/slice/productSlice"; // your thunk
import { toast } from "react-toastify";

export default function SearchResult({ keyword }) {
  const dispatch = useDispatch();
  const {
    isLoading,
    data: products,
    error,
  } = useSelector((state) => state.product);

  useEffect(() => {
    if (keyword) {
      dispatch(searchProducts({ keyword }))
        .unwrap()
        .catch((err) => toast.error(err || "Failed to fetch search results"));
    }
  }, [keyword, dispatch]);

  if (isLoading)
    return <div className="text-center mt-20 text-gray-700">Loading...</div>;

  if (error)
    return <div className="text-center text-red-500 mt-20">{error}</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Search results for "{keyword}"
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition flex flex-col"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-800 mb-2">{p.name}</h3>
                <p className="text-gray-600 mb-4">₹{p.price}</p>
                <button
                  disabled={p.stock <= 0}
                  className={`mt-auto w-full py-2 rounded font-semibold ${
                    p.stock > 0
                      ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => toast.info("Add to Cart pending")}
                >
                  {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
