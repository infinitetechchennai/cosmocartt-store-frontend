import { apiPath } from "../config/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import { Search, Package } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { categories } from "../data/categories";

export default function Products() {
    const [popupTop, setPopupTop] = useState(0);
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("latest");

    const [currentPage, setCurrentPage] = useState(1);

    const productsSectionRef = useRef<HTMLDivElement>(null);
    const recommendedRef = useRef<HTMLDivElement>(null);

    const productsPerPage = 6;

    const [products, setProducts] = useState<any[]>([]);
    const [availableBrands, setAvailableBrands] =
        useState<string[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [hoveredCategory, setHoveredCategory] = useState("");

    useEffect(() => {
        const query =
            searchParams.get("search");

        const brand =
            searchParams.get("brand");

        const category =
            searchParams.get("category");

        const subcategory =
            searchParams.get("subcategory");

        if (query) {
            setSearch(query);
        }

        if (brand) {
            setSelectedBrands([brand]);
        }

        if (category) {
            setSelectedCategory(category);
        }

        if (subcategory) {
            setSelectedSubcategory(subcategory);
        }

        fetch(apiPath("/api/products"))
            .then((res) => res.json())
            .then((data) => {
                console.log("API RESPONSE:", data);

                if (data.success) {
                    setProducts(data.products);
                    const brands: string[] = Array.from(
                        new Set<string>(
                            data.products
                                .map((p: any) => String(p.brand))
                                .filter(Boolean)
                        )
                    );

                    console.log("BRANDS:", brands);

                    setAvailableBrands(brands);
                }
            })
            .catch((err) => console.error(err));

    }, [searchParams]);


    const filteredProducts = products.filter((product) => {
        console.log("STORE PRODUCTS:", products);
        const matchesSearch =
            product.name?.toLowerCase().includes(search.toLowerCase()) ||
            product.brand?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            !selectedCategory ||
            product.category === selectedCategory;

        const matchesSubcategory =
            !selectedSubcategory ||
            product.subcategory === selectedSubcategory;

        const matchesBrand =
            selectedBrands.length === 0 ||
            selectedBrands.includes(product.brand);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesSubcategory &&
            matchesBrand
        );
    });

    if (sortBy === "low") {
        filteredProducts.sort(
            (a, b) => a.retailPrice - b.retailPrice
        );
    }

    if (sortBy === "high") {
        filteredProducts.sort(
            (a, b) => b.retailPrice - a.retailPrice
        );
    }
    const indexOfLastProduct =
        currentPage * productsPerPage;

    const indexOfFirstProduct =
        indexOfLastProduct - productsPerPage;

    const currentProducts =
        filteredProducts.slice(
            indexOfFirstProduct,
            indexOfLastProduct
        );

    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    return (
        <div className="min-h-screen bg-[#F7F5FB]">

            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

                {/* Heading */}
                <div className="relative bg-gradient-to-r from-[#1E0B3A] via-[#3D1766] to-[#6F2DBD] rounded-[2rem] p-6 sm:p-8 mb-8 text-white shadow-2xl border border-white/10 overflow-hidden">

                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>

                    <div className="absolute -bottom-24 left-1/2 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">

                        <p className="text-purple-200">
                            Home / Products
        </p>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-2 leading-tight">
                            Discover Products
        </h1>

                        <p className="mt-3 text-purple-100 text-lg">
                            Explore premium products at the best prices.
        </p>

                        <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
                            ✨ Premium Electronics Marketplace
        </div>

                        <div className="mt-6 flex gap-4">

                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
                                <p className="text-sm text-purple-100">
                                    Products
                </p>

                                <h3 className="text-2xl font-bold">
                                    {filteredProducts.length}
                                </h3>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
                                <p className="text-sm text-purple-100">
                                    Brands
                </p>

                                <h3 className="text-2xl font-bold">
                                    4+
                </h3>
                            </div>

                        </div>

                        <p className="mt-5 text-sm text-purple-100">
                            Browse laptops, mobiles, accessories, gaming gear and more.
        </p>

                    </div>

                </div>



                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">

                    {/* Sidebar */}

                    <div className="space-y-5 sticky top-24 h-fit relative z-[9999]">


                        {/* Categories */}

                        <div
                            onMouseLeave={() => setHoveredCategory("")}
                            className="
    relative
    bg-white
    rounded-3xl
    shadow-xl
    border
    border-purple-100
    overflow-visible
    z-[9999]
  "
                        >
                            <div className="p-5 border-b border-slate-100">
                                <h3 className="font-black text-xl text-slate-900">
                                    Categories
    </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Hover to explore collections
    </p>
                            </div>

                            <div className="p-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onMouseEnter={(e) => {
                                            setHoveredCategory(cat.name);
                                            setPopupTop(e.currentTarget.offsetTop);
                                        }}
                                        onClick={() => {
                                            setSelectedCategory(cat.name);
                                            setSelectedSubcategory("");
                                            setCurrentPage(1);
                                        }}
                                        className={`
      group
      w-full
      flex
      items-center
      justify-between
      text-left
      px-4
      py-3
      rounded-2xl
      font-semibold
      transition-all
      duration-300
      ${selectedCategory === cat.name || hoveredCategory === cat.name
                                                ? "bg-[#4B1E78] text-white shadow-lg shadow-purple-400/30"
                                                : "text-slate-700 hover:bg-purple-50 hover:text-[#4B1E78]"
                                            }
    `}
                                    >
                                        <span>{cat.name}</span>

                                        <span
                                            className={`
        transition-transform
        duration-300
        ${selectedCategory === cat.name || hoveredCategory === cat.name
                                                    ? "translate-x-1"
                                                    : "group-hover:translate-x-1"
                                                }
      `}
                                        >
                                            ›
    </span>
                                    </button>
                                ))}
                            </div>

                            {hoveredCategory && (
                                <div
                                    style={{ top: `${popupTop}px` }}
                                    className="
    absolute
    left-[calc(100%+8px)]
    w-[320px]
        bg-white
        rounded-3xl
        shadow-2xl
        border
        border-purple-100
        p-5
        z-[99999]
        opacity-100
        translate-x-0
        transition-all
        duration-300
      "
                                >
                                    <div className="mb-4">
                                        <p className="text-xs font-bold text-purple-500 tracking-wider">
                                            SUBCATEGORIES
        </p>

                                        <h3 className="font-black text-xl text-[#4B1E78] mt-1">
                                            {hoveredCategory}
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        {categories
                                            .find((cat) => cat.name === hoveredCategory)
                                            ?.subcategories.map((sub) => (
                                                <button
                                                    key={sub}
                                                    onClick={() => {
                                                        if (sub === "Cases & Covers") {
                                                            window.location.href = "/backcase-brands";
                                                            return;
                                                        }

                                                        setSelectedCategory(hoveredCategory);
                                                        setSelectedSubcategory(sub);
                                                        setCurrentPage(1);
                                                    }}
                                                    className={`
                group
                w-full
                flex
                items-center
                justify-between
                text-left
                px-4
                py-3
                rounded-2xl
                text-sm
                font-semibold
                transition-all
                duration-300
                ${selectedSubcategory === sub
                                                            ? "bg-[#4B1E78] text-white shadow-md"
                                                            : "bg-slate-50 text-slate-700 hover:bg-purple-50 hover:text-[#4B1E78]"
                                                        }
              `}
                                                >
                                                    <span>{sub}</span>
                                                    <span className="group-hover:translate-x-1 transition-transform">
                                                        →
              </span>
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Brands */}

                        <div className="bg-white p-5 rounded-3xl shadow-lg border border-purple-100">
                            <h3 className="font-semibold mb-3">
                                Brands
                            </h3>

                            <div className="mt-4 space-y-2">

                                {availableBrands.map((brand) => (

                                    <label
                                        key={brand}
                                        className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-purple-50 transition-all duration-200"
                                    >

                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(
                                                brand
                                            )}
                                            onChange={() => {

                                                if (
                                                    selectedBrands.includes(
                                                        brand
                                                    )
                                                ) {

                                                    setSelectedBrands(
                                                        selectedBrands.filter(
                                                            b =>
                                                                b !== brand
                                                        )
                                                    );

                                                } else {

                                                    setSelectedBrands([
                                                        ...selectedBrands,
                                                        brand,
                                                    ]);

                                                }

                                            }}
                                        />

                                        <span className="text-sm font-semibold text-slate-700">
                                            {brand}
                                        </span>

                                    </label>

                                ))}

                            </div>
                        </div>

                        {/* Clear Filters */}

                        <button
                            onClick={() => {
                                setSelectedCategory("");
                                setSelectedBrands([]);
                                setCurrentPage(1);
                            }}
                            className="w-full bg-white text-red-500 border border-red-100 py-3 rounded-2xl font-bold hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-sm"
                        >
                            Clear Filters
                        </button>

                    </div>

                    {/* Products */}

                    <div
                        ref={productsSectionRef}
                        className="lg:col-span-3 relative z-0"
                    >

                        <div className="bg-white rounded-3xl p-4 mb-6 shadow-lg border border-purple-100 flex gap-4 flex-wrap items-center justify-between">

                            <div className="relative w-full md:flex-1">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border border-purple-200 shadow-sm focus:ring-4 focus:ring-[#6F2DBD]/20 focus:border-[#6F2DBD] focus:shadow-[0_0_25px_rgba(111,45,189,0.25)] outline-none font-medium transition-all duration-300"
                                />
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full sm:w-auto border border-purple-100 bg-slate-50 px-4 py-3 rounded-2xl font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-purple-200 outline-none min-w-[180px] transition-all"
                            >
                                <option value="latest">
                                    Latest
                                </option>

                                <option value="low">
                                    Price Low to High
                                </option>

                                <option value="high">
                                    Price High to Low
                                </option>
                            </select>

                        </div>

                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-1">
                                    Products
        </p>

                                <h2 className="text-3xl font-black text-slate-900">
                                    Explore Collection
</h2>
                            </div>

                            <div className="bg-white border border-purple-100 px-4 py-2 rounded-xl shadow-sm">
                                <span className="text-sm font-bold text-[#6F2DBD]">
                                    {filteredProducts.length}
                                </span>
                                <span className="text-sm text-slate-500 ml-1">
                                    items found
    </span>
                            </div>
                        </div>
                        <div
                            key={currentPage}
                            className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 animate-fadeIn"
                        >

                            {filteredProducts.length === 0 ? (

                                <div className="col-span-full bg-white rounded-[2rem] p-10 sm:p-14 text-center shadow-xl border border-purple-100 min-h-[280px] flex flex-col justify-center items-center">

                                    <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-purple-50 flex items-center justify-center shadow-inner border border-purple-100">
                                        <Package
                                            size={48}
                                            className="text-[#6F2DBD]"
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <h2 className="text-3xl font-black text-slate-900">
                                        No Products Found
</h2>

                                    <p className="text-slate-500 mt-3 max-w-md">
                                        We couldn't find products matching your search or filters.
</p>

                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setSelectedCategory("");
                                            setSelectedBrands([]);
                                            setSelectedSubcategory("");
                                        }}
                                        className="mt-6 px-6 py-3 bg-[#4B1E78] text-white rounded-xl font-semibold hover:bg-[#3a165d] transition-all"
                                    >
                                        Reset Filters
</button>
                                </div>

                            ) : (




                                currentProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />
                                ))


                            )}




                        </div>
                        {filteredProducts.length > 0 && (

                            <div className="flex justify-center items-center gap-3 mt-10">

                                <button
                                    onClick={() => {

                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        );

                                        setTimeout(() => {
                                            productsSectionRef.current?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            });
                                        }, 50);

                                    }}
                                    disabled={currentPage === 1}
                                    className="
                w-12 h-12
                rounded-2xl
                bg-white
                border border-purple-100
                shadow-md
                hover:bg-purple-50
                hover:border-purple-300
                hover:shadow-lg
                transition-all
                duration-200
                disabled:opacity-40
                disabled:cursor-not-allowed
            "
                                >
                                    ←
        </button>

                                {[...Array(totalPages)].map((_, index) => (

                                    <button
                                        key={index}
                                        onClick={() => {

                                            setCurrentPage(index + 1);

                                            setTimeout(() => {
                                                productsSectionRef.current?.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "start",
                                                });
                                            }, 50);

                                        }}
                                        className={`
                    w-12 h-12
                    rounded-2xl
                    font-semibold
                    transition-all
                    duration-200
                    ${currentPage === index + 1
                                                ? "bg-gradient-to-r from-[#4B1E78] to-[#6F2DBD] text-white shadow-lg border border-purple-500"
                                                : "bg-white text-slate-700 border border-purple-100 hover:bg-purple-50 hover:border-purple-300"
                                            }
                `}
                                    >
                                        {index + 1}
                                    </button>

                                ))}

                                <button

                                    onClick={() => {

                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        );

                                        setTimeout(() => {
                                            productsSectionRef.current?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            });
                                        }, 50);

                                    }}
                                    disabled={currentPage === totalPages}
                                    className="
        w-12 h-12
        rounded-2xl
        bg-white
        border border-purple-100
        shadow-md
        hover:bg-purple-50
        hover:border-purple-300
        hover:shadow-lg
        transition-all
        duration-200
        disabled:opacity-40
        disabled:cursor-not-allowed
    "
                                >
                                    →
</button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-8">
                {/* Products You May Like Slider */}
                <section className="mt-4 bg-white rounded-3xl p-4 shadow-lg border border-purple-100">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-100">
                        <div>
                            <p className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-1">
                                Recommended
        </p>

                            <h2 className="text-3xl font-black text-slate-900">
                                Products You May Like
        </h2>

                            <p className="text-slate-500 text-sm mt-1">
                                Handpicked electronics based on popular choices
        </p>
                        </div>

                        <Link
                            to="/products"
                            className="
        hidden md:flex
        items-center
        gap-3
        px-8
        py-4
        rounded-2xl
        border-2
        border-purple-300
        bg-white
        text-purple-700
        font-bold
        shadow-sm
        hover:shadow-lg
        hover:border-purple-500
        hover:-translate-y-0.5
        transition-all
        duration-300
    "
                        >
                            View All
    <span className="text-lg">→</span>
                        </Link>
                    </div>

                    <div ref={recommendedRef} className="flex gap-6 overflow-x-auto pb-5 pt-2 snap-x snap-mandatory scroll-smooth">
                        {products.slice(0, 8).map((product) => (
                            <div
                                key={product._id || product.id}
                                className="min-w-[220px] max-w-[220px] snap-start shrink-0"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />

        </div >
    );
}