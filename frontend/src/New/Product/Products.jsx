import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slice/productSlice";
import { addToCart as addToCartThunk } from "../../redux/slice/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Products() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const {
    isLoading,
    data = [],
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.product);

  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const loadMoreHandler = () => {
    if (currentPage < totalPages) {
      dispatch(fetchProducts({ page: currentPage + 1, limit: 10 }));
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      await dispatch(addToCartThunk({ productId, quantity: 1 })).unwrap();
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (isLoading && currentPage === 1)
    return <div className="text-center mt-20">Loading products...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-[#0B1F3A] mb-8">
        Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
          >
            <Link to={`/products/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
            </Link>
            <h3 className="mt-3 text-lg font-semibold text-[#0B1F3A] hover:underline">
              <Link to={`/products/${product._id}`}>{product.name}</Link>
            </h3>
            <p className="text-gray-600 mt-1">${product.price}</p>
            <button
              onClick={() => handleAddToCart(product._id)}
              disabled={
                !token || product.stock <= 0 || addingToCart[product._id]
              }
              className={`mt-4 w-full py-2 rounded font-semibold ${
                product.stock > 0
                  ? "bg-yellow-500 text-[#0B1F3A] hover:bg-yellow-400"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {addingToCart[product._id]
                ? "Adding..."
                : product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          </div>
        ))}
      </div>

      {currentPage < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreHandler}
            className="bg-[#0B1F3A] text-white px-6 py-2 rounded hover:bg-[#0A1A30]"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
