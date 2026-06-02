import Navbar from "../components/Navbar";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { categories } from "../data/categories";

console.log(categories);


export default function Products() {

    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");


    const [selectedBrands, setSelectedBrands] =
        useState<string[]>([]);

    const [sortBy, setSortBy] =
        useState("latest");

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
            !selectedCategory || product.category === selectedCategory;

        const matchesSubcategory =
            !selectedSubcategory || product.subcategory === selectedSubcategory;
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
            (a, b) => a.price - b.price
        );

    }

    if (sortBy === "high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    }

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold mb-8">
                    All Products
      </h1>

                <div className="grid lg:grid-cols-4 gap-8">

                    {/* SIDEBAR */}
                    <div className="space-y-5">

                        {/* Categories */}
                        <div className="bg-white p-5 rounded-xl space-y-5">
                            <h3 className="font-bold text-lg">Categories</h3>

                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => {
                                        setSelectedCategory(cat.name);
                                        setSelectedSubcategory("");
                                    }}
                                    className="block text-left hover:text-[#4B1E78]"
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Subcategories */}
                        {selectedCategory && (
                            <div className="bg-white p-5 rounded-xl space-y-3">
                                <h3 className="font-bold text-lg">Subcategories</h3>

                                {categories
                                    .find((cat) => cat.name === selectedCategory)
                                    ?.subcategories.map((sub) => (
                                        <button
                                            key={sub}
                                            onClick={() => setSelectedSubcategory(sub)}
                                            className="block text-left hover:text-[#4B1E78]"
                                        >
                                            {sub}
                                        </button>
                                    ))}
                            </div>
                        )}

                        {/* Brands */}
                        <div className="bg-white p-5 rounded-xl">
                            <h3 className="font-semibold mb-3">Brands</h3>

                            {["Apple", "Samsung", "Sony", "Dell"].map((brand) => (
                                <label key={brand} className="block">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedBrands([...selectedBrands, brand]);
                                            } else {
                                                setSelectedBrands(
                                                    selectedBrands.filter((b) => b !== brand)
                                                );
                                            }
                                        }}
                                    />
                                    <span className="ml-2">{brand}</span>
                                </label>
                            ))}
                        </div>

                    </div>

                    {/* PRODUCTS */}
                    <div className="lg:col-span-3">

                        <div className="flex gap-4 mb-6">

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border bg-white px-4 py-3 rounded-xl w-full md:w-96"
                            />

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border bg-white px-4 py-3 rounded-xl"
                            >
                                <option value="latest">Latest</option>
                                <option value="low">Price Low to High</option>
                                <option value="high">Price High to Low</option>
                            </select>

                        </div>

                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}

                        </div>

                    </div>

                </div>

            </div>

            {/* ✅ Footer INSIDE main div */}
            <Footer />

        </div>
    );
}