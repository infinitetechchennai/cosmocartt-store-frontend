import Navbar from "../components/Navbar";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";


export default function Products() {

    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");

    const [selectedCategories, setSelectedCategories] =
        useState<string[]>([]);

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

    let filteredProducts = products.filter((product) => {

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            product.brand
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            product.category
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category);

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

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold mb-8">
                    All Products
        </h1>

                <div className="grid lg:grid-cols-4 gap-8">

                    {/* Sidebar Filters */}

                    {/* Sidebar Filters */}

                    <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">

                        <h2 className="font-bold text-lg mb-4">
                            Categories
    </h2>

                        <div className="space-y-3">

                            <label className="block">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {

                                        if (e.target.checked) {

                                            setSelectedCategories([
                                                ...selectedCategories,
                                                "Smartphones"
                                            ]);

                                        } else {

                                            setSelectedCategories(
                                                selectedCategories.filter(
                                                    (c) => c !== "Smartphones"
                                                )
                                            );
                                        }
                                    }}
                                />
                                <span className="ml-2">
                                    Smartphones
            </span>
                            </label>

                            <label className="block">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {

                                        if (e.target.checked) {

                                            setSelectedCategories([
                                                ...selectedCategories,
                                                "Laptops"
                                            ]);

                                        } else {

                                            setSelectedCategories(
                                                selectedCategories.filter(
                                                    (c) => c !== "Laptops"
                                                )
                                            );
                                        }
                                    }}
                                />
                                <span className="ml-2">
                                    Laptops
            </span>
                            </label>

                            <label className="block">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {

                                        if (e.target.checked) {

                                            setSelectedCategories([
                                                ...selectedCategories,
                                                "Headphones"
                                            ]);

                                        } else {

                                            setSelectedCategories(
                                                selectedCategories.filter(
                                                    (c) => c !== "Headphones"
                                                )
                                            );
                                        }
                                    }}
                                />
                                <span className="ml-2">
                                    Headphones
            </span>
                            </label>

                            <label className="block">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {

                                        if (e.target.checked) {

                                            setSelectedCategories([
                                                ...selectedCategories,
                                                "Smart Watches"
                                            ]);

                                        } else {

                                            setSelectedCategories(
                                                selectedCategories.filter(
                                                    (c) => c !== "Smart Watches"
                                                )
                                            );
                                        }
                                    }}
                                />
                                <span className="ml-2">
                                    Smart Watches
            </span>
                            </label>

                            {/* BRANDS */}

                            <div className="mt-8">

                                <h3 className="font-semibold mb-3">
                                    Brands
    </h3>

                                <div className="space-y-3">

                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {

                                                if (e.target.checked) {

                                                    setSelectedBrands([
                                                        ...selectedBrands,
                                                        "Apple"
                                                    ]);

                                                } else {

                                                    setSelectedBrands(
                                                        selectedBrands.filter(
                                                            (b) => b !== "Apple"
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                        <span className="ml-2">
                                            Apple
            </span>
                                    </label>

                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {

                                                if (e.target.checked) {

                                                    setSelectedBrands([
                                                        ...selectedBrands,
                                                        "Samsung"
                                                    ]);

                                                } else {

                                                    setSelectedBrands(
                                                        selectedBrands.filter(
                                                            (b) => b !== "Samsung"
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                        <span className="ml-2">
                                            Samsung
            </span>
                                    </label>

                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {

                                                if (e.target.checked) {

                                                    setSelectedBrands([
                                                        ...selectedBrands,
                                                        "Sony"
                                                    ]);

                                                } else {

                                                    setSelectedBrands(
                                                        selectedBrands.filter(
                                                            (b) => b !== "Sony"
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                        <span className="ml-2">
                                            Sony
            </span>
                                    </label>

                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {

                                                if (e.target.checked) {

                                                    setSelectedBrands([
                                                        ...selectedBrands,
                                                        "Dell"
                                                    ]);

                                                } else {

                                                    setSelectedBrands(
                                                        selectedBrands.filter(
                                                            (b) => b !== "Dell"
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                        <span className="ml-2">
                                            Dell
            </span>
                                    </label>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Products Area */}


                    {/* Products Area */}

                    <div className="lg:col-span-3">

                        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border bg-white px-4 py-3 rounded-xl w-full md:w-96"
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

                            {filteredProducts.map((product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />

                            ))}

                        </div>

                    </div>

                </div>

            </div>

            <Footer />

        </div>

    );
}