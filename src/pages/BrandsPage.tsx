import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BrandsPage() {

    const [brands, setBrands] =
        useState<string[]>([]);

    useEffect(() => {

        fetch(
            "http://localhost:5000/api/products"
        )
            .then(res => res.json())
            .then(data => {

                if (!data.success) return;

                const uniqueBrands = [
                    ...new Set(
                        data.products
                            .map(
                                (p: any) =>
                                    p.brand
                            )
                            .filter(Boolean)
                    )
                ] as string[];

                setBrands(uniqueBrands);

            })
            .catch(console.error);

    }, []);

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-5xl font-black mb-3">
                    All Brands
                </h1>

                <p className="text-slate-500 mb-10">
                    Explore products from all available brands
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

                    {brands.map((brand) => (

                        <Link
                            key={brand}
                            to={`/products?brand=${encodeURIComponent(brand)}`}
                            className="
                                bg-white
                                rounded-3xl
                                p-6
                                text-center
                                border
                                border-slate-200
                                hover:border-[#4B1E78]
                                hover:shadow-xl
                                transition-all
                            "
                        >

                            <div className="text-5xl mb-4">
                                🏷️
                            </div>

                            <h3 className="font-bold">
                                {brand}
                            </h3>

                            <p className="text-xs text-slate-500 mt-2">
                                View Products →
                            </p>

                        </Link>

                    ))}

                </div>

            </div>

            <Footer />

        </div>

    );

}