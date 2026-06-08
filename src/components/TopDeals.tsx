import { Link } from "react-router-dom";

const deals = [
    {
        title: "Gaming Zone",
        subtitle: "RTX Laptops & Accessories",
        discount: "UP TO 50% OFF",
        image:
            "https://images.unsplash.com/photo-1593305841991-05c297ba4575",
    },

    {
        title: "Premium Audio",
        subtitle: "Headphones & Speakers",
        discount: "STARTING ₹999",
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    },

    {
        title: "Smartphones",
        subtitle: "Latest Flagship Devices",
        discount: "EXCHANGE BONUS",
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    }
];

export default function TopDeals() {

    return (

        <section className="max-w-7xl mx-auto px-6 py-16">

            <div className="flex justify-between items-center mb-10">

                <div>

                    <p className="text-purple-600 font-semibold uppercase tracking-wider">
                        Limited Time
                    </p>

                    <h2 className="text-4xl font-black mt-1">
                        Top Deals
                    </h2>

                </div>

                <Link
                    to="/products"
                    className="font-semibold text-[#4B1E78]"
                >
                    View All →
                </Link>

            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {deals.map((deal) => (

                    <div
                        key={deal.title}
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-[32px]
                            h-[300px]
                            shadow-xl
                        "
                    >

                        <img
                            src={deal.image}
                            alt={deal.title}
                            className="
                                w-full
                                h-full
                                object-cover
                                group-hover:scale-110
                                transition
                                duration-700
                            "
                        />

                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-r
                                from-black/90
                                via-black/60
                                to-transparent
                            "
                        />

                        <div
                            className="
                                absolute
                                inset-0
                                p-8
                                text-white
                                flex
                                flex-col
                                justify-center
                            "
                        >

                            <span
                                className="
                                    bg-red-500
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-bold
                                    w-fit
                                "
                            >
                                {deal.discount}
                            </span>

                            <h3 className="text-3xl font-black mt-4">
                                {deal.title}
                            </h3>

                            <p className="text-gray-200 mt-2">
                                {deal.subtitle}
                            </p>

                            <button
                                className="
                                    mt-6
                                    bg-white
                                    text-[#4B1E78]
                                    px-5
                                    py-3
                                    rounded-xl
                                    font-bold
                                    w-fit
                                    hover:scale-105
                                    transition
                                "
                            >
                                Shop Now
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </section>

    );
}