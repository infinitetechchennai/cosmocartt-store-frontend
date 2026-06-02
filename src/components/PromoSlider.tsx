import { useEffect, useState } from "react";

const slides = [
  {
    title: "MEGA ELECTRONICS SALE",
    subtitle: "Up To 70% Off On Top Brands",
    bg: "from-purple-700 to-indigo-700",
  },
  {
    title: "APPLE DAYS",
    subtitle: "Exclusive iPhone & MacBook Deals",
    bg: "from-blue-600 to-cyan-600",
  },
  {
    title: "GAMING FEST",
    subtitle: "Consoles, Accessories & More",
    bg: "from-red-600 to-pink-600",
  },
];

export default function PromoSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 mt-6">
      <div
        className={`bg-gradient-to-r ${slides[current].bg} rounded-3xl text-white p-12 transition-all duration-700`}
      >
        <h2 className="text-4xl md:text-5xl font-black">
          {slides[current].title}
        </h2>

        <p className="mt-3 text-lg opacity-90">
          {slides[current].subtitle}
        </p>
      </div>
    </div>
  );
}