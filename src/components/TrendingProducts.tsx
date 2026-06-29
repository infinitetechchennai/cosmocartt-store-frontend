import { apiPath } from "../config/api";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function TrendingProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch(apiPath("/api/products"))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products.slice(0, 10));
        }
      })
      .catch(console.error);
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

      </div>
    </section>
  );
}