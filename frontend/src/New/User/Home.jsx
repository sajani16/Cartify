import { useNavigate } from "react-router-dom";
import Hero from "./Hero";
import Features from "./Features";
import ProductsPreview from "./ProductsPreview";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#f7fafc]">
      <Hero navigate={navigate} />
      <Features />
      <ProductsPreview navigate={navigate} />
    </div>
  );
}
