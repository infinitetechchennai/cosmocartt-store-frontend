import { Link } from "react-router-dom";

const brands = [
    {
        name: "Apple",
        logo: "🍎"
    },
    {
        name: "Samsung",
        logo: "📱"
    },
    {
        name: "Sony",
        logo: "🎧"
    },
    {
        name: "Dell",
        logo: "💻"
    },
    {
        name: "HP",
        logo: "🖥️"
    },
    {
        name: "Asus",
        logo: "⚡"
    }
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
                            bg-white
                            rounded-3xl
                            border
                            border-slate-200
                            p-8
                            text-center
                            shadow-lg
                            hover:shadow-2xl
                            hover:-translate-y-2
                            transition-all
                            duration-300
                        "
                    >

                        <div className="text-5xl mb-4">
                            {brand.logo}
                        </div>

                        <h3 className="font-bold">
                            {brand.name}
                        </h3>

                    </Link>

                ))}

            </div>

        </section>

    );
}