import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

export default function BackcaseProducts() {

    const { brand, model } = useParams();

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-5xl font-black">
                    {brand} {model}
                </h1>

                <p className="mt-3 text-slate-500">
                    All available backcases
                </p>

            </div>

            <Footer />

        </div>
    );
}