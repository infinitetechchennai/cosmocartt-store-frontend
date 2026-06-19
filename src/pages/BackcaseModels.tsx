import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    useParams,
    Link
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";
import ProductCard from "../components/ProductCard";




export default function BackcaseModels() {
    const { brand, model } = useParams();
    const [products, setProducts] =
        useState<any[]>([]);
    useEffect(() => {

        fetch(
            "http://localhost:5000/api/products"
        )
            .then(res => res.json())
            .then(data => {

                if (data.success) {

                    const filtered =
                        data.products.filter(
                            (p: any) =>
                                p.brand === brand &&
                                p.model === model
                        );

                    setProducts(filtered);

                }

            })
            .catch(console.error);

    }, [brand, model]);



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

                    {products.map((product) => (

                        <ProductCard
                            key={product._id}
                            product={product}
                        />

                    ))}

                </div>

            </div>

            <Footer />
        </div>
    );
}