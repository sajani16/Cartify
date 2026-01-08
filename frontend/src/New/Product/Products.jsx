import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../Common/Pagination";

import {
  fetchProducts,
  searchProducts,
  setFilters,
  resetProducts,
} from "../../redux/slice/productSlice";
import { addToCart as addToCartThunk } from "../../redux/slice/cartSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  const {
    isLoading,
    data: products = [],
    error,
    currentPage,
    totalPages,
    filters,
  } = useSelector((state) => state.product);

  const [addingToCart, setAddingToCart] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const PAGE_LIMIT = 8;

  const categories = [
    "Espresso",
    "Latte",
    "Cappuccino",
    "Cold Brew",
    "Desserts",
    "Snacks",
    "Other",
  ];

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    setSearchKeyword(keyword);

    if (keyword) {
      dispatch(searchProducts({ keyword, page: 1, limit: PAGE_LIMIT }));
    } else {
      dispatch(resetProducts());
      dispatch(fetchProducts({ page: 1, limit: PAGE_LIMIT, ...filters }));
    }
  }, [searchParams, dispatch, filters]);

  useEffect(() => {
    if (!searchKeyword) {
      dispatch(resetProducts());
      dispatch(fetchProducts({ page: 1, limit: PAGE_LIMIT, ...filters }));
    }
  }, [dispatch, filters, searchKeyword]);

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

  const handleFilterChange = (e) => {
    dispatch(setFilters({ category: e.target.value }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilters({ sort: e.target.value }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setSearchParams(value ? { keyword: value } : {});
  };

  const handleClearFilters = () => {
    setSearchKeyword("");
    setSearchParams({});
    dispatch(resetProducts());
    dispatch(setFilters({ category: "", sort: "latest" }));
    dispatch(fetchProducts({ page: 1, limit: PAGE_LIMIT }));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    if (searchKeyword) {
      dispatch(
        searchProducts({ keyword: searchKeyword, page, limit: PAGE_LIMIT })
      );
    } else {
      dispatch(fetchProducts({ page, limit: PAGE_LIMIT, ...filters }));
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#f9f5f0]">
      <h1 className="text-4xl font-bold text-center text-[#5C3A21] mb-8">
        Our Cafe Products
      </h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-[#fffaf5] p-4 rounded-xl shadow flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchKeyword}
            onChange={handleSearchChange}
            className="border border-[#D4B996] px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#D97A2B]"
          />

          <h2 className="font-semibold text-[#5C3A21]">Categories</h2>
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 mb-2 text-[#6B4B3A]"
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={handleFilterChange}
              />
              {cat}
            </label>
          ))}

          <h2 className="font-semibold mt-4 text-[#5C3A21]">Sort by Price</h2>
          <select
            value={filters.sort || "latest"}
            onChange={handleSortChange}
            className="border border-[#D4B996] px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#D97A2B]"
          >
            <option value="latest">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>

          <button
            className="mt-4 text-sm text-red-500 underline"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading && currentPage === 1 ? (
            <div className="text-center col-span-full mt-20 text-[#6B4B3A]">
              Loading products...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 col-span-full">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center col-span-full mt-20 text-[#6B4B3A]">
              No products found.
            </div>
          ) : (
            products.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className="bg-[#fffaf5] rounded-xl shadow hover:shadow-lg transition cursor-pointer flex flex-col"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-[#5C3A21]">{p.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    {p.salePrice ? (
                      <>
                        <span className="line-through text-gray-400 mr-2">
                          ${p.price}
                        </span>
                        <span className="text-[#D97A2B] font-bold px-2 py-1 rounded-full bg-[#FFF0E0]">
                          Sale
                        </span>
                        <span className="text-[#5C3A21] font-semibold">
                          ${p.salePrice}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#5C3A21] font-semibold">
                        ${p.price}
                      </span>
                    )}
                  </div>
                  {p.stock <= 0 && (
                    <span className="mt-2 text-sm text-red-600 font-medium">
                      Out of Stock
                    </span>
                  )}
                  <button
                    disabled={!token || p.stock <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p._id);
                    }}
                    className={`mt-auto w-full py-2 rounded-xl font-semibold transition ${
                      p.stock > 0
                        ? "bg-[#D97A2B] text-white hover:bg-[#e08b3a]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage || 1}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
          className="mt-6"
          activeClass="bg-[#D97A2B] text-white rounded px-3 py-1"
          inactiveClass="bg-[#fffaf5] text-[#5C3A21] border border-[#D4B996] rounded px-3 py-1 hover:bg-[#f0e5d8]"
        />
      )}
    </div>
  );
}
