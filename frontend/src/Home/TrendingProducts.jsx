import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingProducts } from "../redux/slice/productSlice";
import { useNavigate } from "react-router-dom";

export default function TrendingProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trending, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchTrendingProducts());
  }, [dispatch]);

  if (isLoading || !trending.length) return null;

  return (
    <section className="bg-[#EFE6DD] py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading + CTA */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-20 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide text-[#3B2F2F] mb-4">
              FEATURED DRINKS
            </h2>
            <p className="text-[#7A5C4F] text-sm max-w-2xl leading-relaxed">
              Discover our most popular handcrafted beverages, made with premium
              ingredients and loved by our customers.
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="self-center md:self-auto px-6 py-2 text-sm font-semibold rounded-full border border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-white transition"
          >
            Explore Menu →
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {trending.slice(0, 3).map((product) => (
            <div
              key={product._id}
              className="bg-[#F7F1EA] rounded-xl text-center px-5 pt-5 pb-5"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-40 object-cover rounded-full"
                />
              </div>

              <h3 className="text-xl font-bold text-[#3B2F2F] mb-3">
                {product.name}
              </h3>

              <p className="text-[#7A5C4F] text-sm mb-6 px-4">
                {product.description}
              </p>

              <button
                onClick={() => navigate(`/product/${product._id}`)}
                className="px-8 py-2 text-sm font-semibold rounded-full bg-[#5C4033] text-white hover:bg-[#7A5C4F] transition"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
