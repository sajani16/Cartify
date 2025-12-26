import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slice/productSlice";
import { Link } from "react-router-dom";

function Products() {
  const dispatch = useDispatch();

  const { isLoading, data, error, currentPage, totalPages } = useSelector(
    (state) => state.product
  );

  // Load FIRST page
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 4 }));
  }, [dispatch]);

  const loadMoreHandler = () => {
    if (currentPage < totalPages) {
      dispatch(fetchProducts({ page: currentPage + 1, limit: 4 }));
    }
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center h-screen text-yellow-500">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-4xl font-bold text-[#0B1F3A] mb-8 text-center">
        Products
      </h1>

      {!data.length ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <>
          {/* PRODUCT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((product) => (
              <Link key={product._id} to={`/productdetail/${product._id}`}>
                <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4 flex flex-col">
                    <h3 className="font-semibold text-lg text-[#0B1F3A]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">${product.price}</p>
                    <button
                      className="mt-4 bg-yellow-500 text-[#0B1F3A] py-2 rounded hover:bg-yellow-400"
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* LOAD MORE */}
          {currentPage < totalPages && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMoreHandler}
                disabled={isLoading}
                className="bg-[#0B1F3A] text-white px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;
