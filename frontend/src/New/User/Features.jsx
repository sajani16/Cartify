import SaleProducts from "../../Home/SaleProducts";
import TrendingProducts from "../../Home/TrendingProducts";

export default function Features() {
  return (
    <section className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        {/* Image */}
        <div className="h-115 bg-[#E5EFF3] flex items-center justify-center">
          <span className="text-gray-400">Feature Image</span>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-3xl font-serif text-gray-900 leading-snug">
            Designed for comfort.
            <br />
            Built for modern spaces.
          </h2>

          <p className="mt-6 text-gray-600 max-w-md">
            Clean silhouettes, ergonomic structure and premium materials come
            together to create furniture that fits naturally into your
            lifestyle.
          </p>

          <ul className="mt-8 space-y-4 text-gray-700">
            <li>— Minimal & timeless design</li>
            <li>— Premium quality materials</li>
            <li>— Built for everyday use</li>
          </ul>

          <button className="mt-10 px-6 py-3 border border-gray-900 text-gray-900">
            Discover More
          </button>
        </div>
      </div>
    </section>
  );
}
