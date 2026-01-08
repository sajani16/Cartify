import CategorySection from "./CategorySection";
import Hero from "./Hero";
import WhyChooseUs from "./WhyChooseUs";
import SaleProducts from "./SaleProducts";
import TrendingProducts from "./TrendingProducts";

export default function HomePage() {
  return (
    <div className="w-full bg-[#f7fafc]">
      <Hero />
      <CategorySection />
      {/* <Features /> */}
      <TrendingProducts />
      <WhyChooseUs />
      <SaleProducts />
      {/* <ProductsPreview /> */}
    </div>
  );
}
