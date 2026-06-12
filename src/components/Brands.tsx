import { Link } from "react-router-dom";

import apple from "../assets/apple.png";
import samsung from "../assets/samsung.png";
import sony from "../assets/sony.png";
import dell from "../assets/dell.png";
import hp from "../assets/hp.png";
import asus from "../assets/asus.png";

const brands = [
  {
    name: "Apple",
    image: apple,
  },
  {
    name: "Samsung",
    image: samsung,
  },
  {
    name: "Sony",
    image: sony,
  },
  {
    name: "Dell",
    image: dell,
  },
  {
    name: "HP",
    image: hp,
  },
  {
    name: "Asus",
    image: asus,
  },
];

export default function Brands() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900">
          Shop By Brand
        </h2>

        <p className="text-slate-500 mt-3">
          Trusted electronics brands
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            to={`/products?brand=${brand.name}`}
            className="
              bg-[#491D76]
              rounded-3xl
              border
              border-[#5A248F]
              p-6
              text-center
              shadow-lg
              hover:shadow-2xl
              hover:-translate-y-2
              transition-all
              duration-300
              flex
              flex-col
              items-center
              justify-center
              overflow-hidden
            "
          >
            <img
              src={brand.image}
              alt={brand.name}
              className={`
                h-36
                w-full
                object-contain
                mb-4
                scale-150
                transition-all
                duration-300
                hover:scale-[1.7]
                ${brand.name === "Sony" ? "translate-x-4" : ""}
              `}
            />

            <h3 className="font-bold text-white mt-4">
              {brand.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}