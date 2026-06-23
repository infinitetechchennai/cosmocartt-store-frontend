import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 4;

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch((err) =>
        console.error(err)
      );
  }, []);

  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts =
    products.slice(
      startIndex,
      startIndex + productsPerPage
    );

  const handlePageChange = (
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <section
      className="
        py-24
        bg-gradient-to-b
        from-white
        via-purple-50/30
        to-white
      "
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-8
            mb-14
          "
        >
          <div>

            {/* Badge */}
            <span
              className="
                inline-flex
                px-5
                py-2
                rounded-full
                bg-gradient-to-r
                from-[#4B1E78]
                to-[#6F2DBD]
                text-white
                text-sm
                font-semibold
                shadow-lg
                shadow-purple-200
              "
            >
              Featured Collection
            </span>

            {/* Heading */}
            <h2
              className="
                mt-5
                text-4xl
                md:text-5xl
                font-black
                tracking-tight
                text-[#24103d]
              "
            >
              Handpicked For You
            </h2>

            {/* Description */}
            <p
              className="
                text-slate-500
                mt-4
                max-w-2xl
                leading-7
              "
            >
              Explore our premium collection of
              mobile accessories, TV remotes and
              AC remotes selected for quality,
              durability and everyday use.
            </p>
          </div>

          {/* CTA */}
          <Link
            to="/products"
            className="
              inline-flex
              items-center
              gap-2
              px-7
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-[#4B1E78]
              to-[#6F2DBD]
              text-white
              font-semibold
              shadow-lg
              hover:scale-105
              hover:gap-4
              transition-all
              duration-300
              w-fit
            "
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* PRODUCTS GRID */}
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
          {currentProducts.map(
            (product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            )
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div
            className="
              flex
              justify-center
              items-center
              gap-3
              mt-14
            "
          >
            {/* Previous */}
            <button
              onClick={() =>
                handlePageChange(
                  currentPage - 1
                )
              }
              disabled={currentPage === 1}
              className="
                w-12
                h-12
                rounded-full
                bg-white
                border
                border-purple-100
                shadow-md
                flex
                items-center
                justify-center
                hover:bg-purple-50
                hover:text-[#4B1E78]
                transition-all
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              <ChevronLeft size={20} />
            </button>

            {/* Numbers */}
            {[...Array(totalPages)].map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handlePageChange(
                      index + 1
                    )
                  }
                  className={`
                    w-12
                    h-12
                    rounded-full
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      currentPage ===
                      index + 1
                        ? "bg-gradient-to-r from-[#4B1E78] to-[#6F2DBD] text-white shadow-lg shadow-purple-300"
                        : "bg-white text-slate-700 border border-purple-100 hover:bg-purple-50"
                    }
                  `}
                >
                  {index + 1}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() =>
                handlePageChange(
                  currentPage + 1
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="
                w-12
                h-12
                rounded-full
                bg-white
                border
                border-purple-100
                shadow-md
                flex
                items-center
                justify-center
                hover:bg-purple-50
                hover:text-[#4B1E78]
                transition-all
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}