const categories = [
    {
        name: "Smartphones",
        icon: "📱",
    },
    {
        name: "Laptops",
        icon: "💻",
    },
    {
        name: "Headphones",
        icon: "🎧",
    },
    {
        name: "Smart Watches",
        icon: "⌚",
    },
    {
        name: "Gaming",
        icon: "🎮",
    },
    {
        name: "Monitors",
        icon: "🖥️",
    },
    {
        name: "Accessories",
        icon: "🎒",
    },
    {
        name: "Cameras",
        icon: "📷",
    },
];

export default function Categories() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16">

            <div className="text-center mb-12">

                <h2 className="text-4xl font-bold">
                    Shop By Category
                </h2>

                <p className="text-zinc-500 mt-3">
                    Explore products across popular categories
                </p>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                {categories.map((category) => (

                    <div
                        key={category.name}
                        className="
                        bg-white
                        rounded-3xl
                        p-8
                        text-center
                        shadow-sm
                        border
                        hover:shadow-2xl
                        hover:-translate-y-2
                        transition-all
                        duration-300
                        cursor-pointer
                    "
                    >

                        <div className="text-5xl mb-4">
                            {category.icon}
                        </div>

                        <h3 className="font-bold text-lg">
                            {category.name}
                        </h3>

                        <p className="text-sm text-zinc-500 mt-2">
                            Browse Collection
                        </p>

                    </div>

                ))}

            </div>

        </section>
    );
}