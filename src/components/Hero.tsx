import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "iPhone 17 Series",
    subtitle: "Starting from ₹69,999",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    title: "Gaming Beast Laptops",
    subtitle: "RTX Powered Performance",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
  },
  {
    title: "Ultimate Gaming Setup",
    subtitle: "Consoles & Accessories",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-slate-50 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <div className="relative overflow-hidden rounded-3xl shadow-2xl">

          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="min-w-full bg-gradient-to-r from-[#2B1055] via-[#4B1E78] to-[#6F2DBD]"
              >
                <div className="grid lg:grid-cols-2 items-center">

                  <div className="p-12 lg:p-20 text-white">

                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                      India's Trusted Electronics Marketplace
                    </span>

                    <h1 className="text-5xl md:text-6xl font-black mt-6 leading-tight">
                      {slide.title}
                    </h1>

                    <p className="mt-4 text-xl text-gray-200">
                      {slide.subtitle}
                    </p>

                    <div className="flex gap-4 mt-8">

                      <Link
                        to="/products"
                        className="bg-white text-[#4B1E78] px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
                      >
                        Shop Now
                      </Link>

                    </div>

                  </div>

                  <div className="h-full">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-[500px] object-cover"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow */}

          <button
            onClick={() =>
              setCurrent(
                current === 0
                  ? slides.length - 1
                  : current - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white h-12 w-12 rounded-full shadow-lg"
          >
            ❮
          </button>

          {/* Right Arrow */}

          <button
            onClick={() =>
              setCurrent(
                (current + 1) % slides.length
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white h-12 w-12 rounded-full shadow-lg"
          >
            ❯
          </button>

        </div>

        {/* Dots */}

        <div className="flex justify-center gap-3 mt-5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full transition ${
                current === index
                  ? "bg-[#4B1E78] w-8"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}