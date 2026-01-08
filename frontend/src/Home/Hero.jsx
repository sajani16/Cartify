import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[85vh] flex items-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="text-white text-center lg:text-left">
            <p className="uppercase tracking-widest text-sm text-gray-200">
              Freshly Brewed
            </p>

            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-serif leading-tight">
              Savor the
              <br />
              Perfect Brew
            </h1>

            <p className="mt-6 max-w-md mx-auto lg:mx-0 text-gray-200">
              Handcrafted coffee, premium beans, and carefully curated flavors —
              made to elevate your everyday moments.
            </p>

            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate("/products")}
                className="px-7 py-3 bg-[#C89B3C] text-black font-semibold rounded hover:bg-[#b58a32] transition"
              >
                Shop Now
              </button>

              <button
                onClick={() => navigate("/products?category=Coffee")}
                className="px-7 py-3 border border-white text-white rounded hover:bg-white hover:text-black transition"
              >
                View Menu
              </button>
            </div>
          </div>

          {/* Right: Image / Visual (Hidden on Mobile for Clean Look) */}
          <div className="hidden lg:flex justify-end">
            <div className="w-95 h-95 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80"
                alt="Coffee Cup"
                className="w-72 h-72 object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
