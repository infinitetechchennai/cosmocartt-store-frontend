import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { categories } from "../data/categories";


export default function Products() {
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("latest");

    const [currentPage, setCurrentPage] = useState(1);

    const productsSectionRef = useRef<HTMLDivElement>(null);

    const productsPerPage = 4;

    const [products, setProducts] = useState<any[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [hoveredCategory, setHoveredCategory] = useState("");

    useEffect(() => {
        const query = searchParams.get("search");

        if (query) {
            setSearch(query);
        }

        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => {
                console.log("API RESPONSE:", data);

                if (data.success) {
                    setProducts(data.products);
                }
            })
            .catch((err) => console.error(err));

    }, [searchParams]);


    const filteredProducts = products.filter((product) => {
        console.log("STORE PRODUCTS:", products);
        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.brand.toLowerCase().includes(search.toLowerCase());

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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-purple-50">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Heading */}

                <div className="bg-gradient-to-r from-[#2B1055] to-[#6F2DBD] rounded-3xl p-8 mb-8 text-white shadow-xl">

                    <p className="text-purple-200">
                        Home / Products
    </p>

                    <h1 className="text-5xl font-black mt-2">
                        Discover Products
    </h1>

                    <p className="mt-3 text-purple-100">
                        Explore premium products at the best prices.
    </p>

                    <div className="mt-6 flex gap-4">

                        <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl">
                            <p className="text-sm text-purple-100">
                                Products
        </p>

                            <h3 className="text-2xl font-bold">
                                {filteredProducts.length}
                            </h3>
                        </div>

                        <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl">
                            <p className="text-sm text-purple-100">
                                Brands
        </p>

                            <h3 className="text-2xl font-bold">
                                4+
        </h3>
                        </div>

                    </div>

                </div>

               <div className="grid lg:grid-cols-4 gap-8 relative z-10">

                    {/* Sidebar */}

                    <div className="space-y-5 sticky top-24 h-fit relative z-[9999]">

                        
{/* Categories */}

<div
    onMouseLeave={() => setHoveredCategory("")}
    className="relative bg-white p-5 rounded-2xl shadow-sm border border-slate-200"
>
    <h3 className="font-bold text-lg mb-4">
        Categories
    </h3>

    {categories.map((cat) => (
        <button
            key={cat.name}
            onMouseEnter={() => setHoveredCategory(cat.name)}
            onClick={() => {
                setSelectedCategory(cat.name);
                setSelectedSubcategory("");
                setCurrentPage(1);
            }}
            className={`w-full flex justify-between items-center text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                selectedCategory === cat.name || hoveredCategory === cat.name
                    ? "bg-[#4B1E78] text-white shadow-lg"
                    : "hover:bg-purple-50 text-slate-700"
            }`}
        >
            <span>{cat.name}</span>
            <span>›</span>
        </button>
    ))}

    {hoveredCategory && (
        <div
            className="
absolute
left-[calc(100%+12px)]
top-0
w-72
bg-white/95
backdrop-blur-xl
rounded-2xl
shadow-2xl
border
border-purple-100
p-5
z-[99999]
animate-fadeIn
"
        >
            <h3 className="font-bold text-[#4B1E78] mb-4">
                {hoveredCategory}
            </h3>

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
                            className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                                selectedSubcategory === sub
                                    ? "bg-purple-600 text-white"
                                    : "hover:bg-purple-50 hover:text-[#4B1E78]"
                            }`}
                        >
                            {sub}
                        </button>
                    ))}
            </div>
        </div>
    )}
</div>
                           
                                {/* Brands */}      

                        <div className="bg-white p-5 rounded-xl">
                            <h3 className="font-semibold mb-3">
                                Brands
                            </h3>

                            {["Apple", "Samsung", "Sony", "Dell"].map(
                                (brand) => (
                                    <label
                                        key={brand}
                                        className="block mb-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(
                                                brand
                                            )}
                                            onChange={(e) => {
                                                if (
                                                    e.target.checked
                                                ) {
                                                    setSelectedBrands([
                                                        ...selectedBrands,
                                                        brand,
                                                    ]);
                                                } else {
                                                    setSelectedBrands(
                                                        selectedBrands.filter(
                                                            (b) =>
                                                                b !==
                                                                brand
                                                        )
                                                    );
                                                }
                                            }}
                                        />

                                        <span className="ml-2">
                                            {brand}
                                        </span>
                                    </label>
                                )
                            )}
                        </div>

                        {/* Clear Filters */}

                        <button
                            onClick={() => {
                                setSelectedCategory("");
                                setSelectedBrands([]);
                                setCurrentPage(1);
                            }}
                            className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                        >
                            Clear Filters
                        </button>

                    </div>

                    {/* Products */}

                    <div
                        ref={productsSectionRef}
                       className="lg:col-span-3 relative z-0"
                    >

                        <div className="flex gap-4 mb-6 flex-wrap">

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full md:w-96 px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-lg border border-white shadow-lg focus:ring-4 focus:ring-purple-200 outline-none"
                            />

                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border bg-white px-4 py-3 rounded-xl"
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


                        <div
                            key={currentPage}
                            className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn"
                        >

                            {filteredProducts.length === 0 ? (

                                <div className="col-span-full bg-white rounded-3xl p-12 text-center shadow-lg">

                                    <h2 className="text-3xl font-bold">
                                        No Products Found
            </h2>

                                    <p className="text-slate-500 mt-3">
                                        Try changing filters or search.
            </p>

                                </div>

                            ) : (




                                currentProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />
                                ))


                            )}


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
                w-11 h-11
                rounded-full
                bg-white
                shadow-md
                hover:shadow-xl
                hover:scale-105
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
                    w-11 h-11
                    rounded-full
                    font-semibold
                    transition-all
                    duration-200
                    ${currentPage === index + 1
                                                    ? "bg-[#6F2DBD] text-white scale-110 shadow-lg"
                                                    : "bg-white text-gray-700 hover:bg-purple-100"
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
        w-11 h-11
        rounded-full
        bg-white
        shadow-md
        hover:shadow-xl
        hover:scale-105
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

            </div>

            <Footer />

        </div >
    );
}