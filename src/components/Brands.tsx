import { apiPath } from "../config/api";
import { getImageUrl } from "../utils/imageUrl";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Brands() {

  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {

    fetch(apiPath("/api/products/brands"))
      .then(res => res.json())
      .then(data => {

        if (data.success) {
          setBrands(data.brands);
        }

      })
      .catch(console.error);

  }, []);

  return (
    <section className="pt-4 pb-20 bg-gradient-to-b from-white via-[#faf7ff] to-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

          <div>

            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F1E8FF] text-[#4B1E78] text-sm font-black">
              <Sparkles size={16}/>
              OFFICIAL BRAND STORE
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-black text-slate-900">
              Shop By Brand
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl">
              Shop products directly from your favourite brands.
            </p>

          </div>

          <Link
            to="/brands"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-[#4B1E78]"
          >
            View All Brands
            <ArrowRight size={18}/>
          </Link>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {brands.map((brand:any)=>(

            <Link
              key={brand.name}
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="group bg-white rounded-3xl border border-purple-100 p-6 hover:-translate-y-2 hover:shadow-xl transition-all"
            >

              <div className="h-24 flex items-center justify-center">

                <img
                  src={getImageUrl(brand.image)}
                  alt={brand.name}
                  className="max-h-20 object-contain group-hover:scale-110 transition"
                />

              </div>

              <h3 className="mt-5 text-center font-black">
                {brand.name}
              </h3>

              <p className="mt-2 text-center text-xs text-slate-500">
                {brand.productCount} Products
              </p>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );

}
