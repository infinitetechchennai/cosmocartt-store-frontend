import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";



export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {

        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => {

                if (data.success) {
                    setProducts(data.products);
                }

            })
            .catch((err) => console.error(err));

    }, []);
    const productsPerPage = 4;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(
        products.length / productsPerPage
    );

    const startIndex =
        (currentPage - 1) * productsPerPage;

    const currentProducts = products.slice(
        startIndex,
        startIndex + productsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">

            <div className="flex items-center justify-between mb-10">

                <div>

                    <p className="text-sm uppercase tracking-wider text-purple-600 font-semibold">
                        Trending Collection
        </p>

                    <h2 className="text-4xl font-black text-zinc-900 mt-1">
                        Featured Products
        </h2>

                    <p className="text-zinc-500 mt-2">
                        Discover our best-selling electronics and latest arrivals.
        </p>

                </div>

                <button
                    className="
            px-5
            py-3
            rounded-2xl
            bg-[#4B1E78]
            text-white
            font-semibold
            hover:scale-105
            transition
        "
                >
                    View All Products →
    </button>

            </div>

            {/* Products Grid */}

            <div
                key={currentPage}
                className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-8
        animate-fadeIn
    "
            >
                {currentProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                ))}
            </div>

            {/* Pagination */}

            <div className="flex justify-center items-center gap-3 mt-12">

                <button
                    onClick={() =>
                        handlePageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="
                        px-4 py-2
                        rounded-xl
                        bg-white
                        shadow-md
                        font-medium
                        transition-all
                        duration-300
                        hover:scale-105
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                    "
                >
                    ←
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() =>
                            handlePageChange(index + 1)
                        }
                        className={`
                            w-11 h-11
                            rounded-xl
                            font-semibold
                            transition-all
                            duration-300
                            hover:scale-110
                            ${currentPage === index + 1
                                ? "bg-purple-700 text-white shadow-lg shadow-purple-500/40"
                                : "bg-white text-gray-700 hover:bg-purple-100"
                            }
                        `}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() =>
                        handlePageChange(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                    className="
                        px-4 py-2
                        rounded-xl
                        bg-white
                        shadow-md
                        font-medium
                        transition-all
                        duration-300
                        hover:scale-105
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                    "
                >
                    →
                </button>

            </div>

        </section>
    );
}