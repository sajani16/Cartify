import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function SearchResult() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/product/search?keyword=${keyword}`
        );
        if (res.data.success) {
          setProducts(res.data.products);
        } else {
          toast.error("No products found");
          setProducts([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [keyword]);

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-700">Loading products...</div>
    );

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
                  disabled={!token || p.stock <= 0}
                  className={`mt-auto w-full py-2 rounded font-semibold ${
                    p.stock > 0
                      ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => toast.info("Add to Cart feature pending")}
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
