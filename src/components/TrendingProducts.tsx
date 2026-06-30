import { apiPath } from "../config/api";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";

export default function TrendingProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    fetch(apiPath("/api/products"))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products.slice(0, 10));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const moveByFour = (direction: "next" | "prev") => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const currentIndex = swiper.realIndex;
    const nextIndex =
      direction === "next"
        ? currentIndex + 4
        : currentIndex - 4;

    swiper.slideToLoop(nextIndex, 900);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-flex px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
              🔥 TRENDING NOW
            </span>

            <h2 className="mt-4 text-5xl font-black text-slate-900">
              TRENDING PRODUCTS
            </h2>

            <p className="mt-3 text-slate-500">
              Discover the products customers are buying the most this week.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-pulse"
              >
                <div className="h-56 bg-slate-100 rounded-2xl mb-5"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-6"></div>
                <div className="h-10 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-10 text-center">
            <p className="font-bold text-slate-700">
              No trending products available right now.
            </p>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => moveByFour("prev")}
              className="absolute left-[-22px] top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-purple-100 bg-white text-[#4B1E78] shadow-xl transition-all hover:scale-110 hover:bg-purple-50 lg:flex"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => moveByFour("next")}
              className="absolute right-[-22px] top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-purple-100 bg-white text-[#4B1E78] shadow-xl transition-all hover:scale-110 hover:bg-purple-50 lg:flex"
            >
              <ChevronRight size={24} />
            </button>

            <Swiper
              modules={[Autoplay]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              loop={true}
              grabCursor={true}
              speed={1200}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              spaceBetween={24}
              slidesPerGroup={1}
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
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

      </div>
    </section>
  );
}