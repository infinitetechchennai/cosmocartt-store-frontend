import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Search, ShieldCheck, Truck, RotateCcw } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apple from "../assets/apple.png";
import samsung from "../assets/samsung.png";
import sony from "../assets/sony.png";
import dell from "../assets/dell.png";
import hp from "../assets/hp.png";
import asus from "../assets/asus.png";
const brandImages: Record<string, string> = {
  Apple: apple,
  Samsung: samsung,
  Sony: sony,
  Dell: dell,
  HP: hp,
  Asus: asus,
};
export default function BrandsPage() {
  const [brands, setBrands] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        const uniqueBrands = [
          ...new Set(
            data.products
              .map((p: any) => p.brand)
              .filter(Boolean)
          ),
        ] as string[];

        setBrands(uniqueBrands);
        setProducts(data.products.slice(0, 4));
      })
      .catch(console.error);
  }, []);
const filteredBrands = brands.filter((brand) =>
  brand.toLowerCase().includes(searchTerm.toLowerCase())
);
  return (
    <div className="min-h-screen bg-[#f8f5ff]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <section className="rounded-[36px] bg-gradient-to-br from-[#2b0b45] via-[#5b1f85] to-[#8b4dff] p-10 md:p-14 text-white shadow-xl">
          <div className="inline-flex items-center gap-2 bg-white/15 px-5 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles size={16} />
            EXPLORE TOP BRANDS
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4">
            All Brands
          </h1>

          <p className="text-lg text-purple-100 max-w-2xl">
            Discover premium electronics, laptops, mobiles and accessories from
            your favourite trusted brands.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
  <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 min-w-[180px]">
    <p className="text-sm text-purple-100">
      Available Brands
    </p>

    <h2 className="text-3xl font-black mt-1">
      {brands.length}
    </h2>
  </div>

  <div className="bg-white rounded-2xl px-6 py-4 min-w-[180px]">
   <p className="text-sm text-slate-500">
  Trending Products
</p>

<h2 className="text-3xl font-black text-purple-700 mt-1">
  {products.length}
</h2>
  </div>
</div>
        </section>

        {/* Brands Section */}
        <section className="mt-12 bg-white rounded-[34px] p-8 md:p-10 shadow-sm border border-purple-100">
            <div className="mb-8 bg-slate-50 border border-purple-100 rounded-2xl px-4 py-3 flex items-center gap-3">
  <Search size={20} className="text-purple-700" />

  <input
    type="text"
    placeholder="Search brands..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
  />
</div>
          {brands.length > 0 ? (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

  {filteredBrands.length === 0 && (
    <div className="col-span-full text-center py-10">
      <p className="text-slate-500 text-lg">
        No matching brands found
      </p>
    </div>
  )}

  {filteredBrands.map((brand) => (
                <Link
                  key={brand}
                  to={`/products?brand=${encodeURIComponent(brand)}`}
                  className="group rounded-[26px] p-6 text-center border border-purple-100 bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                 <div className="h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
  <img
    src={brandImages[brand] || apple}
    alt={brand}
    className="max-h-16 max-w-[120px] object-contain"
  />
</div>

                  <h3 className="font-black text-slate-900">
                    {brand}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
                    View Products
                    <ArrowRight size={14} />
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-purple-50 flex items-center justify-center text-5xl">
                🏷️
              </div>

              <h2 className="text-3xl font-black text-slate-900">
                No brands found
              </h2>

              <p className="text-slate-500 mt-3">
                Brands will appear here once products are available.
              </p>
            </div>
          )}
        </section>
        {/* Trending Products */}
<section className="mt-12">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-3xl font-black text-slate-900">
        Trending Products
      </h2>
      <p className="text-slate-500 mt-1">
        Popular picks from top electronics brands
      </p>
    </div>

    <Link
      to="/products"
      className="text-purple-700 font-bold flex items-center gap-1"
    >
      View All
      <ArrowRight size={18} />
    </Link>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {products.map((product) => (
      <Link
        key={product._id || product.id}
        to={`/products/${product._id || product.id}`}
        className="group bg-white rounded-[28px] p-5 border border-purple-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
      >
        <div className="h-44 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-36 object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <p className="text-xs font-bold text-purple-700 uppercase">
          {product.brand}
        </p>

        <h3 className="font-black text-slate-900 mt-1 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-black text-slate-900">
            ₹{product.price}
          </p>

          <span className="text-sm font-bold text-purple-700">
            View →
          </span>
        </div>
      </Link>
    ))}
  </div>
</section>
{/* Why Shop With Us */}
<section className="mt-12">
  <h2 className="text-3xl font-black text-slate-900 mb-6">
    Why Shop With Us
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white rounded-[28px] p-6 border border-purple-100 shadow-sm">
      <ShieldCheck
        size={36}
        className="text-purple-700 mb-4"
      />

      <h3 className="font-black text-lg">
        Genuine Products
      </h3>

      <p className="text-slate-500 mt-2">
        Shop confidently with authentic
        products from trusted brands.
      </p>
    </div>

    <div className="bg-white rounded-[28px] p-6 border border-purple-100 shadow-sm">
      <Truck
        size={36}
        className="text-purple-700 mb-4"
      />

      <h3 className="font-black text-lg">
        Fast Delivery
      </h3>

      <p className="text-slate-500 mt-2">
        Quick and reliable shipping
        across the country.
      </p>
    </div>

    <div className="bg-white rounded-[28px] p-6 border border-purple-100 shadow-sm">
      <RotateCcw
        size={36}
        className="text-purple-700 mb-4"
      />

      <h3 className="font-black text-lg">
        Easy Returns
      </h3>

      <p className="text-slate-500 mt-2">
        Hassle-free returns and customer
        support whenever you need help.
      </p>
    </div>
  </div>
</section>
      </main>

      <Footer />
    </div>
  );
}