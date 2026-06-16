import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const brands = ["Apple", "Samsung", "Vivo", "Oppo", "OnePlus"];

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

                    <h1 className="text-5xl font-black mt-3">
                        Premium Mobile Cases
                    </h1>

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

                {/* FEATURES */}
                <div className="grid md:grid-cols-4 gap-4 mt-8">
                    {["🚚 Free Shipping", "🛡 Secure Payments", "⭐ Trusted Quality", "⚡ Fast Delivery"].map((item) => (
                        <div className="bg-white rounded-2xl p-5 shadow-md text-center font-semibold">
                            {item}
                        </div>
                    ))}
                </div>

                {/* BRAND CATEGORIES */}
                <h2 className="text-3xl font-black mt-12 mb-6">
                    Choose Your Brand
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {brands.map((brand) => (
                        <Link
                            key={brand}
                            to={`/backcase-models/${brand}`}
                            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all text-center"
                        >
                            <div className="h-32 bg-purple-50 rounded-2xl flex items-center justify-center text-5xl">
                                📱
                            </div>

                            <h3 className="font-black mt-4">
                                {brand}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Backcases
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

                {/* SPOTLIGHT */}
                <div className="bg-white rounded-3xl p-8 mt-12 shadow-xl grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-4xl font-black">
                            Product Spotlight
                        </h2>

                        <p className="text-slate-500 mt-4">
                            Premium shockproof cases with camera protection, matte finish and perfect grip.
                        </p>

                        <button className="mt-6 bg-[#4B1E78] text-white px-6 py-3 rounded-xl font-bold">
                            Shop Now
                        </button>
                    </div>

                    <div className="h-72 bg-purple-50 rounded-3xl flex items-center justify-center text-8xl">
                        📱
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}