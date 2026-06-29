import { apiPath } from "../config/api";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function TrendingProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

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

        {/* Slider */}

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
            <p className="font-bold text-slate-700">No trending products available right now.</p>
          </div>
        ) : (
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
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
        )}

      </div>
    </section>
  );
}