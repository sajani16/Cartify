import { Coffee, Leaf, Clock, HeartHandshake } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F4EFE9] py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide text-[#3B2F2F] mb-4">
            WHY CHOOSE US
          </h2>
          <p className="text-[#7A5C4F] text-sm max-w-2xl mx-auto leading-relaxed">
            We focus on quality, consistency, and creating experiences that keep
            our customers coming back.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Feature 1 */}
          <div className="text-center px-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-[#E9DED4]">
                <Coffee size={32} className="text-[#5C4033]" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#3B2F2F] mb-3">
              Premium Quality
            </h3>
            <p className="text-sm text-[#7A5C4F] leading-relaxed">
              Carefully selected ingredients and expertly crafted recipes in
              every cup.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center px-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-[#E9DED4]">
                <Leaf size={32} className="text-[#5C4033]" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#3B2F2F] mb-3">
              Fresh & Organic
            </h3>
            <p className="text-sm text-[#7A5C4F] leading-relaxed">
              We prioritize fresh, ethically sourced, and organic ingredients
              whenever possible.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center px-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-[#E9DED4]">
                <Clock size={32} className="text-[#5C4033]" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#3B2F2F] mb-3">
              Fast & Reliable
            </h3>
            <p className="text-sm text-[#7A5C4F] leading-relaxed">
              Quick service without compromising quality, perfect for your daily
              routine.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="text-center px-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-[#E9DED4]">
                <HeartHandshake size={32} className="text-[#5C4033]" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#3B2F2F] mb-3">
              Loved by Customers
            </h3>
            <p className="text-sm text-[#7A5C4F] leading-relaxed">
              Trusted by a growing community who value taste, comfort, and
              consistency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
