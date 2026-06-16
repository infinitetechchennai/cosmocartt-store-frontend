import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams, Link } from "react-router-dom";

export default function BackcaseModels() {
    const { brand, model } = useParams();

    const caseTypes = [
        `Back Cover for ${model}`,
        `Transparent Mobile Back Case for ${model}`,
        `MagSafe Magnetic Phone Case for ${model}`,
        `Nature TPU Pro Border Case for ${model}`,
        `Nillkin Case for ${model}`,
        `Clear Transparent Case for ${model}`,
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                <Link
                    to={`/brand-models/${brand}`}
                    className="text-[#4B1E78] font-semibold hover:underline"
                >
                    ← Back to {brand} Models
                </Link>

                <div className="bg-gradient-to-r from-[#2B1055] to-[#6F2DBD] rounded-3xl p-10 mt-6 mb-8 text-white shadow-xl">
                    <p className="text-purple-200">
                        Mobile Cases / {brand}
                    </p>

                    <h1 className="text-5xl font-black mt-3">
                        {model} Backcases
                    </h1>

                    <p className="mt-3 text-purple-100">
                        Premium back covers and cases for {model}.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {caseTypes.map((type, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                        >
                            <div className="h-48 bg-purple-50 flex items-center justify-center text-7xl">
                                📱
                            </div>

                            <div className="p-5">
                                <h2 className="font-black text-slate-900">
                                    {type}
                                </h2>

                                <p className="text-sm text-slate-500 mt-2">
                                    Scratch resistant • Premium grip
                                </p>

                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-yellow-500">
                                        ★★★★★
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        4.8
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <p className="text-2xl font-black text-[#4B1E78]">
                                            ₹499
                                        </p>
                                        <p className="text-xs text-green-600 font-semibold">
                                            Free Delivery
                                        </p>
                                    </div>

                                    <button className="bg-[#4B1E78] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#6F2DBD]">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <Footer />
        </div>
    );
}