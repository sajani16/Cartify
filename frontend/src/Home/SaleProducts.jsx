import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOnSaleProducts } from "../redux/slice/productSlice";
import { useNavigate } from "react-router-dom";

export default function SaleProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { onSale, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchOnSaleProducts());
  }, [dispatch]);

  if (isLoading || !onSale.length) return null;

  return (
    <section className="bg-[#EFE6DD] py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading + CTA */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-14 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-[#5C4033] mb-3">
              Special Sales
            </h2>
            <p className="text-[#7A5C4F] text-sm max-w-xl">
              Limited-time offers on freshly baked favorites.
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="self-center md:self-auto px-6 py-2 text-sm font-semibold rounded-full border border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-white transition"
          >
            Explore More →
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {onSale.slice(0, 3).map((product) => {
            const discount =
              product.salePrice && product.price
                ? Math.round(
                    ((product.price - product.salePrice) / product.price) * 100
                  )
                : 0;

            return (
              <div
                key={product._id}
                className="bg-[#FFF8F0] rounded-xl overflow-hidden shadow-md text-center"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                  {discount > 0 && (
                    <span className="absolute top-4 left-4 bg-[#5C4033] text-white text-xs font-bold px-3 py-1 rounded-full">
                      SALE −{discount}%
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#3B2F2F] mb-2">
                    {product.name}
                  </h3>

                  <div className="flex justify-center gap-3 mb-4">
                    <span className="text-lg font-bold text-[#5C4033]">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-sm line-through text-[#A0897D]">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="px-6 py-2 text-sm font-semibold rounded-full bg-[#5C4033] text-white hover:bg-[#7A5C4F] transition"
                  >
                    View Deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
