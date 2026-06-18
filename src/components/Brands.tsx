import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

import apple from "../assets/apple.png";
import samsung from "../assets/samsung.png";
import sony from "../assets/sony.png";
import dell from "../assets/dell.png";
import hp from "../assets/hp.png";
import asus from "../assets/asus.png";

const brands = [
  { name: "Apple", image: apple },
  { name: "Samsung", image: samsung },
  { name: "Sony", image: sony },
  { name: "Dell", image: dell },
  { name: "HP", image: hp },
  { name: "Asus", image: asus },
];

export default function Brands() {
  return (
    <section className="pt-4 pb-20 bg-gradient-to-b from-white via-[#faf7ff] to-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F1E8FF] text-[#4B1E78] text-sm font-black">
              <Sparkles size={16} />
              OFFICIAL BRAND STORE
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-black text-slate-900">
              Shop By Brand
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl">
              Explore trusted brands with premium accessories, electronics and everyday essentials.
            </p>
          </div>

          <Link
            to="/products"
            className="
              hidden md:inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-full
              bg-slate-900
              text-white
              font-bold
              hover:bg-[#4B1E78]
              hover:gap-4
              transition-all
            "
          >
            View All Brands
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-[#F6CEFC] via-[#FAF5FF] to-white rounded-[40px] p-8 border border-purple-100 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                to={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="
                  group
                  relative
                  overflow-hidden
                  h-[190px]
                  rounded-[30px]
                  bg-white/90
                  backdrop-blur-md
                  border
                  border-white/70
                  shadow-[0_10px_35px_rgba(15,23,42,0.08)]
                  hover:shadow-[0_20px_55px_rgba(75,30,120,0.18)]
                  hover:-translate-y-2
                  transition-all
                  duration-300
                "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-white opacity-0 group-hover:opacity-100 transition-all duration-300" />

                <div className="relative h-full flex flex-col items-center justify-center px-5">
                  <div
                    className="
                      w-28
                      h-28
                      rounded-[28px]
                      bg-gradient-to-br
                      from-white
                      to-purple-50
                      border
                      border-purple-100
                      flex
                      items-center
                      justify-center
                      group-hover:bg-white
                      group-hover:scale-105
                      transition-all
                      duration-300
                    "
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="
                        max-h-20
                        max-w-[120px]
                        object-contain
                        group-hover:scale-110
                        transition-transform
                        duration-300
                      "
                    />
                  </div>

                  <h3 className="mt-4 font-black text-slate-900">
                    {brand.name}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-slate-400 group-hover:text-[#4B1E78] transition">
                    Explore Products →
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#9333EA] via-[#C026D3] to-[#EC4899] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}