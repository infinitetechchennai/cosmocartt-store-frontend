import { Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -340,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 340,
      behavior: "smooth",
    });
  };

  return (
    <section className="pt-0 pb-16 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-[1400px] mx-auto px-6">

        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-100 text-[#4B1E78] text-sm font-bold">
              <Sparkles size={16} />
              PREMIUM BRANDS
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-black text-slate-900">
              Shop By Brand
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl">
              Explore trusted technology brands and discover products made for quality, performance and everyday use.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-md hover:bg-[#4B1E78] hover:text-white hover:scale-110 transition-all flex items-center justify-center"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={scrollRight}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-md hover:bg-[#4B1E78] hover:text-white hover:scale-110 transition-all flex items-center justify-center"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#2B1055] via-[#4B1E78] to-[#6F2DBD] p-6 md:p-8 shadow-2xl">

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-fuchsia-400/20 rounded-full blur-3xl" />

          <div
            ref={scrollRef}
            className="
  relative
  z-10
  flex
  gap-6
  overflow-hidden
  py-3
"
          >
            {brands.map((brand) => (
              <Link
                key={brand.name}
                to={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="
                  group
                  min-w-[230px]
                  h-[175px]
                  rounded-[28px]
                  bg-white
                  border
                  border-white/30
                  flex
                  flex-col
                  items-center
                  justify-center
                  shadow-xl
                  hover:-translate-y-2
                  hover:shadow-2xl
                  transition-all
                  duration-300
                  flex-shrink-0
                "
              >
                <div className="h-24 flex items-center justify-center">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="
                      max-h-20
                      max-w-[155px]
                      object-contain
                      group-hover:scale-110
                      transition-transform
                      duration-300
                    "
                  />
                </div>

                <p className="mt-4 font-black text-slate-800 group-hover:text-[#4B1E78] transition">
                  {brand.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}