import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function TrendingProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products.slice(0, 10));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section
      className="
        py-20
        bg-gradient-to-b
        from-white
        via-purple-50/30
        to-white
      "
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-6
            mb-12
          "
        >
          <div>
            {/* Badge */}
            <span
              className="
                inline-flex
                px-4
                py-2
                rounded-full
                bg-gradient-to-r
                from-[#4B1E78]
                to-[#6F2DBD]
                text-white
                font-semibold
                text-sm
                shadow-lg
                shadow-purple-200
              "
            >
              ✨ TRENDING NOW
            </span>

            {/* Title */}
            <h2
              className="
                mt-5
                text-4xl
                md:text-5xl
                font-black
                tracking-tight
                text-[#2B0E45]
              "
            >
              Trending Products
            </h2>

            {/* Subtitle */}
            <p
              className="
                mt-3
                text-slate-500
                text-base
                max-w-2xl
              "
            >
              Discover the products customers are loving the most this week —
              handpicked best sellers updated in real time.
            </p>
          </div>

          {/* Optional side text */}
          <div
            className="
              hidden
              md:block
              text-right
            "
          >
            <p className="text-sm text-[#6F2DBD] font-medium">
              Updated Daily
            </p>

            <p className="text-xs text-slate-400">
              Premium picks curated for you
            </p>
          </div>
        </div>

        {/* Slider Container */}
        <div
          className="
            rounded-3xl
            p-5
            bg-white
            border
            border-purple-100
            shadow-[0_8px_30px_rgba(111,45,189,0.08)]
            hover:shadow-[0_10px_40px_rgba(111,45,189,0.12)]
            transition-all
            duration-300
          "
        >
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation={true}
            loop={true}
            grabCursor={true}
            speed={1200}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            spaceBetween={24}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            className="trending-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <div
                  className="
                    transition-all
                    duration-300
                    hover:-translate-y-2
                  "
                >
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}