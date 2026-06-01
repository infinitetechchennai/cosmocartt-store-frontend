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

        <section className="max-w-7xl mx-auto px-6 py-16">

            <h2 className="text-3xl font-bold mb-8">
                Popular Brands
      </h2>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

                {brands.map((brand) => (

                    <div
                        key={brand}
                        className="bg-white rounded-2xl border p-6 text-center font-semibold hover:shadow-lg"
                    >
                        {brand}
                    </div>

                ))}

            </div>

        </section>

    );
}