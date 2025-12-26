export default function Hero({ navigate }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
      <div>
        <p className="text-sm tracking-wide text-gray-500 uppercase">
          New Collection
        </p>

        <h1 className="mt-4 text-5xl font-serif text-gray-900 leading-tight">
          Modern office<br />design made<br />simple
        </h1>

        <p className="mt-6 text-gray-600 max-w-md">
          Thoughtfully designed furniture that balances
          aesthetics and comfort.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-10 px-7 py-3 bg-gray-900 text-white rounded-sm"
        >
          Shop Now
        </button>
      </div>

      <div className="h-130 bg-[#D7E9EE] flex items-center justify-center">
        <span className="text-gray-400">Hero Image</span>
      </div>
    </section>
  );
}
