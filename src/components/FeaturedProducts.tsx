import { apiPath } from "../config/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
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
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-pulse"
                >
                  <div className="h-56 bg-slate-100 rounded-2xl mb-5"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2 mb-6"></div>
                  <div className="h-10 bg-slate-100 rounded-xl"></div>
                </div>
              ))
            : currentProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
        </div>

        {!loading && products.length === 0 && (
          <div className="mt-8 bg-white rounded-3xl border border-purple-100 shadow-sm p-10 text-center">
            <p className="font-bold text-slate-700">No featured products available right now.</p>
          </div>
        )}

        {!loading && totalPages > 1 && (
  <div className="mt-12 flex justify-center">
    <div className="flex items-center gap-2 rounded-full border border-purple-100 bg-white px-3 py-2 shadow-[0_15px_40px_rgba(76,29,149,0.12)]">

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-[#4B1E78] transition-all hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={18} />
        Prev
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
            className={`h-10 min-w-10 rounded-full px-4 text-sm font-black transition-all duration-300 ${
              currentPage === page
                ? "bg-gradient-to-r from-[#4B1E78] to-[#6F2DBD] text-white shadow-lg shadow-purple-300/50"
                : "text-[#4B1E78] hover:bg-purple-50"
            }`}
          >
            {page}
          </button>
        ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-[#4B1E78] transition-all hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight size={18} />
      </button>

    </div>
  </div>
)}

      </div>
    </section>
  );
}