import { apiPath } from "../config/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 4;

  useEffect(() => {
    fetch(apiPath("/api/products"))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">

          <div>
            <span className="inline-block px-5 py-2 rounded-full bg-purple-100 text-[#4B1E78] text-sm font-bold">
              TRENDING COLLECTION
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-black text-slate-900">
              Handpicked For You
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl">
              Discover our most-loved mobile cases, TV remotes and AC remotes selected for quality, style and everyday use.
            </p>
          </div>

          <Link
            to="/products"
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-4
              rounded-2xl
              bg-[#4B1E78]
              text-white
              font-bold
              hover:bg-[#6F2DBD]
              hover:gap-4
              transition-all
              w-fit
            "
          >
            View All Products
            <ArrowRight size={18} />
          </Link>

        </div>

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

        {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 rounded-xl border border-purple-200 bg-white text-[#4B1E78] text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹
          </button>

          {[1, currentPage - 1, currentPage, currentPage + 1, totalPages]
            .filter((page, index, arr) =>
              page >= 1 &&
              page <= totalPages &&
              arr.indexOf(page) === index
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-9 h-9 px-3 rounded-xl text-sm font-black transition-all ${
                  currentPage === page
                    ? "bg-[#4B1E78] text-white shadow"
                    : "bg-white text-[#4B1E78] border border-purple-100 hover:bg-purple-50"
                }`}
              >
                {page}
              </button>
            ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 rounded-xl border border-purple-200 bg-white text-[#4B1E78] text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}

      </div>
    </section>
  );
}