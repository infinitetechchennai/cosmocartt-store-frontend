import { useState } from "react";
import ProductCard from "./ProductCard";
import { products } from "../data/products";

export default function FeaturedProducts() {
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

        const handlePageChange = (page: number) => {
    setCurrentPage(page);
};
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">

            <h2 className="text-3xl font-bold mb-8">
                Featured Products
            </h2>

            {/* Products Grid */}

            <div
                key={currentPage}
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-6
                    animate-fadeIn
                "
            >
                {currentProducts.map((product) => (
                    <ProductCard
                        key={product.id}
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
                            ${
                                currentPage === index + 1
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