const brands = [
    "Apple",
    "Samsung",
    "Sony",
    "Dell",
    "HP",
    "Asus"
];

export default function Brands() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-20">

            <div className="text-center mb-12">

                <h2 className="text-4xl font-black text-slate-900">
                    Popular Brands
                </h2>

                <p className="text-slate-500 mt-3">
                    Shop products from the world's leading technology brands
                </p>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

                {brands.map((brand) => (

                    <div
                        key={brand}
                        className="
    group
    bg-gradient-to-br
    from-[#F3E8FF]
    to-[#E9D5FF]
    rounded-3xl
    border
    border-purple-200
    p-8
    text-center
    font-bold
    text-lg
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-2xl
    hover:bg-gradient-to-br
    hover:from-[#6F2DBD]
    hover:to-[#4B1E78]
"
                    >
                        <span className="text-[#4B1E78] group-hover:text-white transition-colors duration-300">
                            {brand}
                        </span>
                    </div>

                ))}

            </div>

        </section>
    );
}