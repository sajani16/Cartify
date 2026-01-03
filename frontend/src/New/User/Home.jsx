import Hero from "./Hero";
import Features from "./Features";
import ProductsPreview from "./ProductsPreview";

export default function HomePage() {
  return (
    <div className="w-full bg-[#f7fafc]">
      <Hero />
      <Features />
      <ProductsPreview />
    </div>
  );
}
