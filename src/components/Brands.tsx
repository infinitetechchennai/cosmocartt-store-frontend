import { Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-10">

      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900">
          Shop By Brand
        </h2>

        <p className="text-slate-500 mt-3">
          Trusted electronics brands
        </p>
      </div>

      <div className="relative">

        {/* Left Arrow */}

        <button
          onClick={scrollLeft}
          className="
            absolute
            left-[-20px]
            top-1/2
            -translate-y-1/2
            z-20
            w-12
            h-12
            rounded-full
            bg-white
            shadow-xl
            hover:scale-110
            transition-all
            duration-300
            flex
            items-center
            justify-center
          "
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right Arrow */}

        <button
          onClick={scrollRight}
          className="
            absolute
            right-[-20px]
            top-1/2
            -translate-y-1/2
            z-20
            w-12
            h-12
            rounded-full
            bg-white
            shadow-xl
            hover:scale-110
            transition-all
            duration-300
            flex
            items-center
            justify-center
          "
        >
          <ChevronRight size={22} />
        </button>

        {/* Brand Cards */}

        <div
          ref={scrollRef}
          className="
            flex
            gap-5
            overflow-x-auto
            px-2
            py-4
            scrollbar-hide
            scroll-smooth
          "
        >
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="
                min-w-[260px]
                h-[180px]
                bg-gradient-to-br
                from-[#4B1E78]
                to-[#6F2DBD]
                rounded-2xl
                flex
                items-center
                justify-center
                shadow-lg
                hover:-translate-y-2
                hover:shadow-2xl
                transition-all
                duration-300
                flex-shrink-0
              "
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="
                  max-h-28
                  max-w-[200px]
                  object-contain
                "
              />
            </Link>
          ))}
        </div>

      </div>

    </section>
  );
}