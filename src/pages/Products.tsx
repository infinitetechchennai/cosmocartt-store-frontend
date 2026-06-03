import Navbar from "../components/Navbar";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { categories } from "../data/categories";

export default function Products() {
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("latest");

    useEffect(() => {
        const query = searchParams.get("search");

        if (query) {
            setSearch(query);
        }
    }, [searchParams]);

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.brand.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            !selectedCategory ||
            product.category === selectedCategory;

        const matchesBrand =
            selectedBrands.length === 0 ||
            selectedBrands.includes(product.brand);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesBrand
        );
    });

    if (sortBy === "low") {
        filteredProducts.sort(
            (a, b) => a.price - b.price
        );
    }

    if (sortBy === "high") {
        filteredProducts.sort(
            (a, b) => b.price - a.price
        );
    }

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

                <div className="grid lg:grid-cols-4 gap-8">

                    {/* Sidebar */}

                    <div className="space-y-5 sticky top-24 h-fit">

                        {/* Categories */}

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-lg mb-4">
                                Categories
                            </h3>

                            {categories.map((cat) => (
    <button
        key={cat.name}
        onClick={() => {
            setSelectedCategory(cat.name);
        }}
        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
            selectedCategory === cat.name
                ? "bg-[#4B1E78] text-white shadow-xl ring-4 ring-purple-200"
                : "hover:bg-slate-100"
        }`}
    >
        {cat.name}
    </button>
))}
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
                                setSearch("");
                            }}
                            className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                        >
                            Clear Filters
                        </button>

                    </div>

                    {/* Products */}

                    <div className="lg:col-span-3">

                        <div className="flex gap-4 mb-6 flex-wrap">

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full md:w-96 px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-lg border border-white shadow-lg focus:ring-4 focus:ring-purple-200 outline-none"
                            />

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value)
                                }
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

                                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

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

        filteredProducts.map((product) => (
            <ProductCard
                key={product.id}
                product={product}
            />
        ))

    )}

</div>

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
}