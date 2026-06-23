import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
    <section className="py-8 bg-white overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <div
          className="
            relative
            overflow-hidden
            rounded-[42px]
            border
            border-slate-200
            shadow-[0_30px_80px_rgba(15,23,42,0.08)]
          "
        >

          {/* PROGRESS BAR */}

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

          <AnimatePresence mode="wait" initial={false}>

            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
              className="
                bg-gradient-to-br
                from-[#15052b]
                via-[#2B1055]
                to-[#4B1E78]
              "
            >

              <div className="grid lg:grid-cols-2 items-center">

                {/* LEFT */}

                <div className="px-12 lg:px-16 py-14 text-white">

                  <span
                    className="
                      inline-flex
                      px-4
                      py-2
                      rounded-full
                      bg-white/10
                      backdrop-blur-xl
                      border
                      border-white/10
                      text-sm
                      font-medium
                    "
                  >
                    India’s Premium Electronics Marketplace
                  </span>

                  <motion.h1
                    key={slides[current].title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.6,
                    }}
                    className="
                      mt-6
                      text-5xl
                      md:text-7xl
                      font-black
                      leading-tight
                      tracking-tight
                    "
                  >
                    {slides[current].title}
                  </motion.h1>

                  <div
                    className="
                      inline-flex
                      mt-5
                      px-4
                      py-2
                      rounded-full
                      bg-green-500/90
                      text-white
                      text-sm
                      font-semibold
                    "
                  >
                    ⚡ Limited Time Offer
                  </div>

                  <motion.p
                    key={slides[current].subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.35,
                      duration: 0.6,
                    }}
                    className="
                      mt-5
                      text-xl
                      text-purple-100
                    "
                  >
                    {slides[current].subtitle}
                  </motion.p>

                  {/* BUTTONS */}

                  <div className="flex flex-wrap gap-4 mt-8">

                    <Link
                      to="/products"
                      className="
                        inline-flex
                        items-center
                        gap-2
                        bg-white
                        text-[#4B1E78]
                        px-7
                        py-4
                        rounded-2xl
                        font-semibold
                        hover:scale-105
                        hover:shadow-xl
                        transition-all
                      "
                    >
                      Shop Now
                      <ArrowRight size={18} />
                    </Link>

                    <button
                      className="
                        px-7
                        py-4
                        rounded-2xl
                        border
                        border-white/20
                        bg-white/10
                        backdrop-blur-xl
                        font-medium
                        hover:bg-white/15
                        transition-all
                      "
                    >
                      Explore Collection
                    </button>

                  </div>

                  {/* STATS */}

                  <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl">

                    {[
                      {
                        number: "50K+",
                        text: "Happy Customers",
                      },
                      {
                        number: "1000+",
                        text: "Premium Products",
                      },
                      {
                        number: "50+",
                        text: "Global Brands",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="
                          bg-white/10
                          backdrop-blur-xl
                          border
                          border-white/10
                          rounded-2xl
                          p-4
                        "
                      >
                        <h3 className="text-2xl font-black">
                          {item.number}
                        </h3>

                        <p className="text-sm text-purple-200 mt-1">
                          {item.text}
                        </p>
                      </div>
                    ))}

                  </div>

                </div>

                {/* RIGHT */}

                <div className="relative">

                  <motion.img
                    key={slides[current].image}
                    src={slides[current].image}
                    alt={slides[current].title}
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 5,
                      ease: "easeOut",
                    }}
                    className="
                      w-full
                      h-[640px]
                      object-cover
                    "
                  />

                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#2B1055]/30" />

                </div>

              </div>

            </motion.div>

          </AnimatePresence>

          {/* LEFT BUTTON */}

          <button
            onClick={prevSlide}
            className="
              absolute
              left-6
              top-1/2
              -translate-y-1/2
              h-12
              w-12
              rounded-full
              bg-white/70
              backdrop-blur-xl
              hover:scale-110
              transition-all
              shadow-xl
              z-20
            "
          >
            ❮
          </button>

          {/* RIGHT BUTTON */}

          <button
            onClick={nextSlide}
            className="
              absolute
              right-6
              top-1/2
              -translate-y-1/2
              h-12
              w-12
              rounded-full
              bg-white/70
              backdrop-blur-xl
              hover:scale-110
              transition-all
              shadow-xl
              z-20
            "
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
              className={`
                transition-all
                duration-300
                rounded-full
                ${
                  current === index
                    ? "w-10 h-3 bg-[#4B1E78]"
                    : "w-3 h-3 bg-slate-300"
                }
              `}
            />
          ))}

        </div>

      </div>

    </section>
  );
}