import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Espresso",
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Latte",
    image:
      "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Cappuccino",
    image:
      "https://images.unsplash.com/photo-1523942839745-7848d0a5e3b3?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Cold Brew",
    image:
      "https://images.unsplash.com/photo-1550551039-3e9b94a99c54?auto=format&fit=crop&w=400&q=80",
  },
];

export default function CategorySection() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="w-full bg-[#f6f1eb] py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-[#4b2e1e]">
            Our Coffee Categories
          </h2>
          <p className="mt-2 text-sm text-[#7a5a44]">
            Crafted with passion, brewed to perfection
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="cursor-pointer flex flex-col items-center text-center group"
            >
              {/* Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-md border border-[#e0d4c8] bg-white">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Label */}
              <h3 className="mt-4 font-semibold text-[#4b2e1e] group-hover:text-[#8b5e3c] transition">
                {cat.name}
              </h3>

              <span className="mt-1 text-xs text-[#8b6f5a]">
                Explore →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
