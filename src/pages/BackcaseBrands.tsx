import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import spotlightImage from "../assets/spotlight product.png.png";

import {
Truck,
ShieldCheck,
Star,
Zap
} from "lucide-react";

const brands = [
    "Apple",
    "Samsung",
    "Vivo",
    "Oppo",
    "OnePlus",
    "Google Pixel",
    "Infinix",
    "iQOO",
    "Motorola",
    "Nothing",
    "Poco",
    "Realme",
    "Xiaomi"
];


const trending = [
    "Shockproof Case",
    "Clear Case",
    "Silicone Case",
    "Leather Case",
    "Camera Protection Case",
];

export default function BackcaseBrands() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* HERO */}
                <div className="bg-gradient-to-r from-[#2B1055] to-[#6F2DBD] rounded-3xl p-10 text-white shadow-2xl">
                    <p className="text-purple-200">Mobile Accessories</p>

                    <h1 className="text-5xl md:text-6xl font-black mt-3 leading-tight">
    Protect Your Phone
    <br />
    Without Compromising Style
</h1>

<div className="flex gap-4 mt-6 flex-wrap">
  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
    1000+ Designs
  </span>

  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
    Free Shipping
  </span>

  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
    Premium Quality
  </span>
</div>
                    <p className="mt-4 text-purple-100 max-w-xl">
                        Explore stylish, shockproof and premium backcases for your favorite mobile brands.
                    </p>

                    <button className="mt-6 bg-white text-[#4B1E78] px-6 py-3 rounded-xl font-bold">
                        Explore Collection
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {["50K Customers", "1000+ Products", "50+ Brands", "100% Quality"].map((item) => (
                        <div className="bg-white rounded-2xl p-5 text-center shadow-md font-bold">
                            {item}
                        </div>
                    ))}
                </div>
<div className="grid md:grid-cols-3 gap-5 mt-8">

  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6">
    <p className="text-sm opacity-80">LIMITED OFFER</p>
    <h3 className="text-2xl font-black mt-2">
      Up To 50% OFF
    </h3>
    <p className="mt-2">Premium Shockproof Cases</p>
  </div>

  <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-3xl p-6">
    <p className="text-sm opacity-80">HOT DEAL</p>
    <h3 className="text-2xl font-black mt-2">
      Buy 2 Get 1
    </h3>
    <p className="mt-2">Selected Collections</p>
  </div>

  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-3xl p-6">
    <p className="text-sm opacity-80">NEW ARRIVAL</p>
    <h3 className="text-2xl font-black mt-2">
      Premium Series
    </h3>
    <p className="mt-2">Latest Case Collection</p>
  </div>

</div>
                {/* FEATURES */}
                <div className="grid md:grid-cols-4 gap-4 mt-8">

  <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition text-center">
    <Truck className="mx-auto text-[#4B1E78]" size={32} />
    <p className="font-semibold mt-3">Free Shipping</p>
  </div>

  <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition text-center">
    <ShieldCheck className="mx-auto text-[#4B1E78]" size={32} />
    <p className="font-semibold mt-3">Secure Payments</p>
  </div>

  <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition text-center">
    <Star className="mx-auto text-[#4B1E78]" size={32} />
    <p className="font-semibold mt-3">Trusted Quality</p>
  </div>

  <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition text-center">
    <Zap className="mx-auto text-[#4B1E78]" size={32} />
    <p className="font-semibold mt-3">Fast Delivery</p>
  </div>

</div>

                {/* BRAND CATEGORIES */}
                <h2 className="text-3xl font-black mt-12 mb-6">
                    Choose Your Brand
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {brands.map((brand) => (
                        <Link
  key={brand}
  to={`/brand-models/${brand}`}
  className="
  group
  bg-white
  rounded-3xl
  p-5
  border
  border-slate-200
  hover:border-[#4B1E78]
  hover:shadow-2xl
  transition-all
  duration-300
  text-center
  "
>
  <div
    className="
    h-24
    rounded-2xl
    bg-gradient-to-br
    from-purple-50
    to-pink-50
    flex
    items-center
    justify-center
    text-3xl
    group-hover:scale-110
    transition
  "
  >
    📱
  </div>

  <h3 className="font-bold mt-4 text-slate-800">
    {brand}
  </h3>

  <p className="text-xs text-slate-500 mt-1">
    Explore Cases →
  </p>
</Link>
                    ))}
                </div>

                {/* TRENDING PRODUCTS */}
                <h2 className="text-3xl font-black mt-12 mb-6">
                    Trending Cases
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                    {trending.map((item) => (
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition">
                            <div className="h-32 bg-slate-100 rounded-xl flex items-center justify-center text-4xl">
                                📱
                            </div>

                            <h3 className="font-bold mt-3 text-sm">
                                {item}
                            </h3>

                            <p className="font-black text-[#4B1E78] mt-1">
                                ₹499
                            </p>
                        </div>
                    ))}
                </div>

                {/* PRODUCT SPOTLIGHT */}

<div className="relative mt-16">

  <img
    src={spotlightImage}
    alt="Cosmocartt Product Spotlight"
    className="
      w-full
      rounded-[32px]
      shadow-2xl
    "
  />

<Link
  to="/products"
  className="absolute left-[5.5%] bottom-[24%] w-[190px] h-[60px] z-10"
>
</Link>
</div>


            </div>

            <Footer />
        </div>
    );
}