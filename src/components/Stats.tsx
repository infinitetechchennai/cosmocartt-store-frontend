const stats = [
    {
        value: "5000+",
        label: "Products",
    },
    {
        value: "10000+",
        label: "Customers",
    },
    {
        value: "50+",
        label: "Brands",
    },
    {
        value: "24/7",
        label: "Support",
    },
];

export default function Stats() {
    return (
        <section className="bg-white py-16">

            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                    {stats.map((stat) => (

                        <div
                            key={stat.label}
                            className="text-center"
                        >

                            <h2 className="text-4xl font-bold text-[#4B1E78]">
                                {stat.value}
                            </h2>

                            <p className="text-zinc-500 mt-2">
                                {stat.label}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}