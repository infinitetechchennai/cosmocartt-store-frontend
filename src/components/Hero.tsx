import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section className="bg-slate-50 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <div className="relative overflow-hidden rounded-3xl shadow-2xl">

          {/* Progress Bar */}

          <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-30">

            <motion.div
              key={current}
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 5,
                ease: "linear",
              }}
            />

          </div>

          <AnimatePresence mode="wait">

            <motion.div
  key={current}
  initial={{
    x: 40,
  }}
  animate={{
    x: 0,
  }}
  exit={{
    x: -40,
  }}
  transition={{
    duration: 0.45,
    ease: "easeOut",
  }}
              className="bg-gradient-to-r from-[#2B1055] via-[#4B1E78] to-[#6F2DBD]"
            >
              <div className="grid lg:grid-cols-2 items-center">

                {/* LEFT */}

                <div className="p-12 lg:p-20 text-white">

                  <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                    India's Trusted Electronics Marketplace
                  </span>

                  <h1 className="text-5xl md:text-6xl font-black mt-6 leading-tight">
                    {slides[current].title}
                  </h1>

                  <p className="mt-4 text-xl text-gray-200">
                    {slides[current].subtitle}
                  </p>

                  <div className="flex gap-4 mt-8">

                    <Link
                      to="/products"
                      className="bg-white text-[#4B1E78] px-8 py-4 rounded-xl font-bold hover:scale-105 transition"
                    >
                      Shop Now
                    </Link>

                    <button className="border border-white/30 bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition">
                      Explore
                    </button>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="relative">

                  <img
                    src={slides[current].image}
                    alt={slides[current].title}
                    className="w-full h-[500px] object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#2B1055]/30"></div>

                </div>

              </div>
            </motion.div>

          </AnimatePresence>

          {/* LEFT ARROW */}

          <button
            onClick={prevSlide}
            className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white h-12 w-12 rounded-full shadow-xl backdrop-blur-md z-20"
          >
            ❮
          </button>

          {/* RIGHT ARROW */}

          <button
            onClick={nextSlide}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white h-12 w-12 rounded-full shadow-xl backdrop-blur-md z-20"
          >
            ❯
          </button>

        </div>

        {/* DOTS */}

        <div className="flex justify-center gap-3 mt-6">

          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? "w-10 h-3 bg-[#4B1E78]"
                  : "w-3 h-3 bg-gray-300"
              }`}
            />
          ))}

        </div>

      </div>
    </section>
  );
}