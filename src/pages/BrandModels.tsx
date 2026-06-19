import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function BrandModels() {
    const { brand } = useParams();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const [modelsData, setModelsData] =
        useState<string[]>([]);

    useEffect(() => {

        fetch(
            `http://localhost:5000/api/products/models/${brand}`
        )
            .then(res => res.json())
            .then(data => {

                if (data.success) {

                    setModelsData(
                        data.models
                    );

                }

            })
            .catch(console.error);

    }, [brand]);

    const selectedModels =
        modelsData || [];

    const filteredModels = selectedModels.filter((model) => {
        const matchesSearch = model.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "All" ||
            (filter === "Latest" && (model.includes("17") || model.includes("16") || model.includes("15"))) ||
            (filter === "Pro" && model.includes("Pro")) ||
            (filter === "Plus" && model.includes("Plus")) ||
            (filter === "Mini" && model.includes("Mini"));

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-purple-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <Link
                    to="/backcase-brands"
                    className="text-[#4B1E78] font-semibold hover:underline"
                >
                    ← Back to Brands
                </Link>

                <div className="mt-6 bg-gradient-to-r from-[#2B1055] via-[#4B1E78] to-[#6F2DBD] rounded-3xl p-10 text-white shadow-2xl">

                    <p className="text-purple-200">
                        Home / Mobile Cases / {brand}
                    </p>

                    <h1 className="text-5xl font-black mt-3">
                        Choose Your {brand} Model
                    </h1>

                    <p className="mt-3 text-purple-100 max-w-xl">
                        Select your phone model to explore premium back covers,
                        transparent cases, MagSafe cases and shockproof cases.
                    </p>

                    <div className="mt-6 flex gap-4">
                        <div className="bg-white/20 px-5 py-3 rounded-2xl">
                            <p className="text-sm text-purple-100">Models</p>
                            <h3 className="text-2xl font-bold">
                                {selectedModels.length}+
                            </h3>
                        </div>

                        <div className="bg-white/20 px-5 py-3 rounded-2xl">
                            <p className="text-sm text-purple-100">Starting</p>
                            <h3 className="text-2xl font-bold">₹499</h3>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-2xl shadow-md p-5 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <p className="font-bold text-[#4B1E78]">
                        🔥 Backcase Sale | Starting ₹199 | Free Delivery | 10% OFF
                    </p>

                    <input
                        type="text"
                        placeholder={`Search ${brand} model...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full lg:w-80 px-5 py-3 rounded-xl border border-purple-200 outline-none focus:ring-4 focus:ring-purple-100"
                    />
                </div>

                <div className="flex gap-3 flex-wrap mt-6">
                    {["All", "Latest", "Pro", "Plus", "Mini"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            className={`px-5 py-2 rounded-full font-semibold transition-all ${filter === item
                                    ? "bg-[#4B1E78] text-white shadow-lg"
                                    : "bg-white text-slate-600 hover:bg-purple-100"
                                }`}
                        >
                            {item} Models
                        </button>
                    ))}
                </div>

                <h2 className="text-3xl font-black mt-10 mb-6">
                    Available Models
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {filteredModels.map((model, index) => (
                        <div
                            key={model}
                            onClick={() =>
                                navigate(
                                    `/backcase-models/${brand}/${encodeURIComponent(model)}`
                                )
                            }
                            className="
                                bg-white
                                rounded-3xl
                                overflow-hidden
                                shadow-lg
                                hover:shadow-2xl
                                hover:-translate-y-2
                                transition-all
                                duration-300
                                cursor-pointer
                                border
                                border-purple-100
                                group
                            "
                        >
                            <div className="relative h-40 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                                    Popular
                                </span>

                                <div className="text-6xl group-hover:scale-110 transition-all duration-300">
                                    📱
                                </div>
                            </div>

                            <div className="p-5 text-center">
                                <h3 className="font-black text-slate-900">
                                    {model}
                                </h3>

                                <p className="text-sm text-slate-500 mt-2">
                                    {20 + index} Cases Available
                                </p>

                                <div className="flex justify-center items-center gap-1 mt-3">
                                    <span className="text-yellow-500 text-sm">
                                        ★★★★★
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        4.8
                                    </span>
                                </div>

                                <button className="mt-4 w-full bg-[#4B1E78] text-white py-2 rounded-xl font-semibold group-hover:bg-[#6F2DBD] transition">
                                    View Cases
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <Footer />
        </div>
    );
}