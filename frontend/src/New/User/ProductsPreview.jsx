import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slice/productSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductsPreview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data = [], isLoading, error } = useSelector((state) => state.product);

  useEffect(() => {
    // Load only 4 products for preview
    dispatch(fetchProducts({ page: 1, limit: 4 }))
      .unwrap()
      .catch((err) => toast.error(err.message || "Failed to load products"));
  }, [dispatch]);

  return (
    <section className="bg-[#EAF3F6] py-28">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-serif text-gray-900">Popular Products</h2>
        <p className="mt-4 text-gray-600">
          A curated selection from our collection
        </p>

        {/* Loading */}
        {isLoading && (
          <p className="mt-10 text-gray-500">Loading products...</p>
        )}

        {/* Error */}
        {error && <p className="mt-10 text-red-500">{error}</p>}

        {/* Product Grid */}
        <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-4 gap-12">
          {data?.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/products/${product._id}`)}
              className="cursor-pointer group"
            >
              <div className="h-56 bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <p className="mt-4 text-gray-900 font-medium">{product.name}</p>
              <p className="text-gray-600">${product.price}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/products")}
          className="mt-20 px-8 py-3 bg-gray-900 text-white hover:bg-black transition rounded"
        >
          View All Products
        </button>
      </div>
    </section>
  );
}
