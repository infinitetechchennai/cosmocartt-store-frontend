import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useCatalog } from "../context/CatalogContext";

const encode = (value: string) => encodeURIComponent(value);

export default function FeaturedCategories() {
    const { catalog, loading } = useCatalog();

    const featuredCategories = catalog.slice(0, 6);

    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-zinc-900">
                    Shop By Category
                </h2>

                <Link
                    to="/catalog"
                    className="text-[#4B1E78] font-semibold"
                >
                    View All →
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-72 rounded-3xl bg-white shadow-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCategories.map((category) => (
                        <Link
                            key={category.name}
                            to={`/catalog/${encode(category.name)}`}
                            className="group relative h-72 rounded-3xl overflow-hidden shadow-lg bg-white"
                        >
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                    <Package
                                        size={56}
                                        className="text-[#4B1E78]"
                                    />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="text-sm text-purple-200">
                                    {category.subcategories.length} Subcategories · {category.productCount} Products
                                </p>

                                <h3 className="text-2xl sm:text-3xl font-bold mt-1 line-clamp-2">
                                    {category.name}
                                </h3>

                                <div className="mt-3 opacity-0 group-hover:opacity-100 transition">
                                    Explore Category →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
