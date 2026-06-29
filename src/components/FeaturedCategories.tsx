import { Link } from "react-router-dom";
import { categories } from "../data/categories";

const categoryImages: Record<string, string> = {
    Mobiles:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

    Laptops:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",

    Audio:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",

    Gaming:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575",

    Storage:
        "https://images.unsplash.com/photo-1591488320449-011701bb6704",

    Accessories:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90",
};

export default function FeaturedCategories() {

    return (

        <section className="max-w-7xl mx-auto px-6 py-12">

            <div className="flex items-center justify-between mb-8">

                <h2 className="text-3xl font-black text-zinc-900">
                    Shop By Category
                </h2>

                <Link
                    to="/products"
                    className="text-[#4B1E78] font-semibold"
                >
                    View All →
                </Link>

            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

                {categories.slice(0, 6).map((category) => (

                    <Link
                        key={category.name}
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        className="
                            group
                            relative
                            h-72
                            rounded-3xl
                            overflow-hidden
                            shadow-lg
                        "
                    >

                        <img
                            src={
                                categoryImages[
                                category.name
                                ]
                            }
                            alt={category.name}
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
                                bg-gradient-to-t
                                from-black/90
                                via-black/40
                                to-transparent
                            "
                        />

                        <div
                            className="
                                absolute
                                bottom-6
                                left-6
                                text-white
                            "
                        >

                            <p className="text-sm text-purple-200">
                                {
                                    category.subcategories.length
                                } Subcategories
                            </p>

                            <h3 className="text-3xl font-bold mt-1">
                                {category.name}
                            </h3>

                            <div
                                className="
                                    mt-3
                                    opacity-0
                                    group-hover:opacity-100
                                    transition
                                "
                            >
                                Shop Now →
                            </div>

                        </div>

                    </Link>

                ))}

            </div>

        </section>

    );
}