import { apiPath } from "../config/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { useState, useEffect, useMemo } from "react";
import { Search, Package, X, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { categories } from "../data/categories";

export default function Products() {
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("latest");
    const [visibleCount, setVisibleCount] = useState(24);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const LOAD_STEP = 24;

    useEffect(() => {
        const query = searchParams.get("search");
        const brand = searchParams.get("brand");
        const category = searchParams.get("category");
        const subcategory = searchParams.get("subcategory");
        const model = searchParams.get("model");

        if (query) setSearch(query);
        if (brand) setSelectedBrands([brand]);
        if (category) setSelectedCategory(category);
        if (subcategory) setSelectedSubcategory(subcategory);
        if (model) setSelectedModels([model]);

        setLoading(true);

        fetch(apiPath("/api/products"))
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProducts(data.products || []);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [searchParams]);

    const availableBrands = useMemo(() => {
        return Array.from(
            new Set(
                products
                    .map((p) => String(p.brand || "").trim())
                    .filter(Boolean)
            )
        ).sort();
    }, [products]);

    const availableModels = useMemo(() => {
        return Array.from(
            new Set(
                products
                    .filter((p) => {
                        if (selectedBrands.length === 0) return true;
                        return selectedBrands.includes(p.brand);
                    })
                    .map((p) => String(p.model || "").trim())
                    .filter(Boolean)
            )
        ).sort();
    }, [products, selectedBrands]);

    const activeSubcategories = useMemo(() => {
        if (!selectedCategory) return [];

        return (
            categories.find((cat) => cat.name === selectedCategory)?.subcategories ||
            []
        );
    }, [selectedCategory]);

    const filteredProducts = useMemo(() => {
        let result = products.filter((product) => {
            const name = String(product.name || "").toLowerCase();
            const brand = String(product.brand || "").toLowerCase();
            const model = String(product.model || "").toLowerCase();
            const sku = String(product.sku || "").toLowerCase();
            const query = search.toLowerCase();

            const matchesSearch =
                !query ||
                name.includes(query) ||
                brand.includes(query) ||
                model.includes(query) ||
                sku.includes(query);

            const matchesCategory =
                !selectedCategory || product.category === selectedCategory;

            const matchesSubcategory =
                !selectedSubcategory || product.subcategory === selectedSubcategory;

            const matchesBrand =
                selectedBrands.length === 0 ||
                selectedBrands.includes(product.brand);

            const matchesModel =
                selectedModels.length === 0 ||
                selectedModels.includes(product.model);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesSubcategory &&
                matchesBrand &&
                matchesModel
            );
        });

        if (sortBy === "low") {
            result = [...result].sort(
                (a, b) => Number(a.retailPrice || 0) - Number(b.retailPrice || 0)
            );
        }

        if (sortBy === "high") {
            result = [...result].sort(
                (a, b) => Number(b.retailPrice || 0) - Number(a.retailPrice || 0)
            );
        }

        if (sortBy === "latest") {
            result = [...result].sort((a, b) => {
                const aDate = new Date(a.createdAt || 0).getTime();
                const bDate = new Date(b.createdAt || 0).getTime();
                return bDate - aDate;
            });
        }

        return result;
    }, [
        products,
        search,
        selectedCategory,
        selectedSubcategory,
        selectedBrands,
        selectedModels,
        sortBy,
    ]);

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    const resetFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSelectedSubcategory("");
        setSelectedBrands([]);
        setSelectedModels([]);
        setSortBy("latest");
        setVisibleCount(LOAD_STEP);
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) => {
            const updated = prev.includes(brand)
                ? prev.filter((item) => item !== brand)
                : [...prev, brand];

            setSelectedModels([]);
            setVisibleCount(LOAD_STEP);
            return updated;
        });
    };

    const toggleModel = (model: string) => {
        setSelectedModels((prev) => {
            const updated = prev.includes(model)
                ? prev.filter((item) => item !== model)
                : [...prev, model];

            setVisibleCount(LOAD_STEP);
            return updated;
        });
    };

    return (
        <div className="min-h-screen bg-[#F7F5FB]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-10 pb-10">
                <section className="relative bg-gradient-to-r from-[#1E0B3A] via-[#3D1766] to-[#6F2DBD] rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 mb-5 sm:mb-8 text-white shadow-2xl border border-white/10 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 left-1/2 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <p className="text-purple-200">Home / Products</p>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mt-2 leading-tight">
                            Discover Products
            </h1>

                        <p className="mt-3 text-purple-100 text-sm sm:text-lg">
                            Explore premium products at the best prices.
            </p>

                        <div className="mt-6 flex flex-wrap gap-4">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
                                <p className="text-sm text-purple-100">Products</p>
                                <h3 className="text-2xl font-bold">
                                    {filteredProducts.length}
                                </h3>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
                                <p className="text-sm text-purple-100">Brands</p>
                                <h3 className="text-2xl font-bold">
                                    {availableBrands.length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-purple-100 rounded-2xl py-3 font-black text-[#4B1E78] shadow-sm"
                    >
                        <SlidersHorizontal size={18} />
                        Filters & Sort
                    </button>
                </div>

                <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="lg:sticky lg:top-24 space-y-5">
                            <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                                <div className="p-5 border-b border-slate-100">
                                    <h3 className="font-black text-xl text-slate-900">
                                        Categories
                  </h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Filter by product category
                  </p>
                                </div>

                                <div className="p-3 space-y-2 max-h-[420px] overflow-y-auto">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.name}
                                            onClick={() => {
                                                setSelectedCategory(
                                                    selectedCategory === cat.name ? "" : cat.name
                                                );
                                                setSelectedSubcategory("");
                                                setVisibleCount(LOAD_STEP);
                                            }}
                                            className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${selectedCategory === cat.name
                                                ? "bg-[#4B1E78] text-white shadow-md"
                                                : "text-slate-700 hover:bg-purple-50 hover:text-[#4B1E78]"
                                                }`}
                                        >
                                            <span>{cat.name}</span>
                                            <span>›</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedCategory && (
                                <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100">
                                        <h3 className="font-black text-xl text-slate-900">
                                            Subcategories
                    </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {selectedCategory}
                                        </p>
                                    </div>

                                    <div className="p-3 space-y-2 max-h-[360px] overflow-y-auto">
                                        {activeSubcategories.map((sub) => (
                                            <button
                                                key={sub}
                                                onClick={() => {
                                                    setSelectedSubcategory(
                                                        selectedSubcategory === sub ? "" : sub
                                                    );
                                                    setVisibleCount(LOAD_STEP);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${selectedSubcategory === sub
                                                    ? "bg-[#4B1E78] text-white shadow-md"
                                                    : "bg-slate-50 text-slate-700 hover:bg-purple-50 hover:text-[#4B1E78]"
                                                    }`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                                <div className="p-5 border-b border-slate-100">
                                    <h3 className="font-black text-xl text-slate-900">Brands</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Select one or more brands
                  </p>
                                </div>

                                <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
                                    {availableBrands.map((brand) => (
                                        <label
                                            key={brand}
                                            className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-purple-50 transition-all"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleBrand(brand)}
                                                className="accent-[#4B1E78]"
                                            />
                                            <span className="text-sm font-semibold text-slate-700">
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {availableModels.length > 0 && (
                                <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100">
                                        <h3 className="font-black text-xl text-slate-900">
                                            Models
                    </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Filter by device model
                    </p>
                                    </div>

                                    <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
                                        {availableModels.map((model) => (
                                            <label
                                                key={model}
                                                className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-purple-50 transition-all"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedModels.includes(model)}
                                                    onChange={() => toggleModel(model)}
                                                    className="accent-[#4B1E78]"
                                                />
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {model}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={resetFilters}
                                className="w-full bg-white text-red-500 border border-red-100 py-3 rounded-2xl font-bold hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                            >
                                Clear Filters
              </button>
                        </div>
                    </aside>

                    <section className="lg:col-span-3">
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-5 sm:mb-6 shadow-lg border border-purple-100 flex gap-3 sm:gap-4 flex-wrap items-center justify-between">
                            <div className="relative w-full md:flex-1">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                                <input
                                    type="text"
                                    placeholder="Search products, brand, model or SKU..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setVisibleCount(LOAD_STEP);
                                    }}
                                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-4 rounded-2xl bg-white border border-purple-200 shadow-sm focus:ring-4 focus:ring-[#6F2DBD]/20 focus:border-[#6F2DBD] outline-none font-medium transition-all text-sm sm:text-base"
                                />
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setVisibleCount(LOAD_STEP);
                                }}
                                className="w-full sm:w-auto border border-purple-100 bg-slate-50 px-4 py-3 rounded-2xl font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-purple-200 outline-none min-w-[190px]"
                            >
                                <option value="latest">Latest</option>
                                <option value="low">Price Low to High</option>
                                <option value="high">Price High to Low</option>
                            </select>
                        </div>

                        {(selectedCategory ||
                            selectedSubcategory ||
                            selectedBrands.length > 0 ||
                            selectedModels.length > 0 ||
                            search) && (
                                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4 mb-6 flex flex-wrap gap-2 items-center">
                                    <span className="text-sm font-bold text-slate-500 mr-1">
                                        Active Filters:
                </span>

                                    {search && (
                                        <button
                                            onClick={() => setSearch("")}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold"
                                        >
                                            Search: {search}
                                            <X size={12} />
                                        </button>
                                    )}

                                    {selectedCategory && (
                                        <button
                                            onClick={() => {
                                                setSelectedCategory("");
                                                setSelectedSubcategory("");
                                            }}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold"
                                        >
                                            {selectedCategory}
                                            <X size={12} />
                                        </button>
                                    )}

                                    {selectedSubcategory && (
                                        <button
                                            onClick={() => setSelectedSubcategory("")}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold"
                                        >
                                            {selectedSubcategory}
                                            <X size={12} />
                                        </button>
                                    )}

                                    {selectedBrands.map((brand) => (
                                        <button
                                            key={brand}
                                            onClick={() => toggleBrand(brand)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold"
                                        >
                                            {brand}
                                            <X size={12} />
                                        </button>
                                    ))}

                                    {selectedModels.map((model) => (
                                        <button
                                            key={model}
                                            onClick={() => toggleModel(model)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold"
                                        >
                                            {model}
                                            <X size={12} />
                                        </button>
                                    ))}
                                </div>
                            )}

                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-1">
                                    Products
                </p>

                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
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

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm animate-pulse"
                                    >
                                        <div className="h-44 sm:h-56 bg-slate-100 rounded-2xl mb-4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-2/3 mb-3"></div>
                                        <div className="h-4 bg-slate-100 rounded w-1/2 mb-5"></div>
                                        <div className="h-10 bg-slate-100 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-[2rem] p-10 sm:p-14 text-center shadow-xl border border-purple-100 min-h-[280px] flex flex-col justify-center items-center">
                                <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-purple-50 flex items-center justify-center shadow-inner border border-purple-100">
                                    <Package
                                        size={48}
                                        className="text-[#6F2DBD]"
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                                    No Products Found
                </h2>

                                <p className="text-slate-500 mt-3 max-w-md">
                                    We couldn't find products matching your search or filters.
                </p>

                                <button
                                    onClick={resetFilters}
                                    className="mt-6 px-6 py-3 bg-[#4B1E78] text-white rounded-xl font-semibold hover:bg-[#3a165d] transition-all"
                                >
                                    Reset Filters
                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                                    {visibleProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {visibleCount < filteredProducts.length && (
                                    <div className="flex justify-center mt-10">
                                        <button
                                            onClick={() =>
                                                setVisibleCount((prev) => prev + LOAD_STEP)
                                            }
                                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#6F2DBD] text-white font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                        >
                                            Load More Products
                    </button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </section>
            {showMobileFilters && (
                <div className="fixed inset-0 z-[99999] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowMobileFilters(false)}
                    />

                    <div className="absolute left-0 top-0 h-full w-[88%] max-w-sm bg-[#F7F5FB] shadow-2xl overflow-y-auto p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black text-slate-900">
                                Filters
                            </h3>

                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-10 h-10 rounded-full bg-white border flex items-center justify-center"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                                <div className="p-5 border-b border-slate-100">
                                    <h3 className="font-black text-xl text-slate-900">
                                        Categories
                                    </h3>
                                </div>

                                <div className="p-3 space-y-2 max-h-[360px] overflow-y-auto">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.name}
                                            onClick={() => {
                                                setSelectedCategory(selectedCategory === cat.name ? "" : cat.name);
                                                setSelectedSubcategory("");
                                                setVisibleCount(LOAD_STEP);
                                            }}
                                            className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${selectedCategory === cat.name
                                                ? "bg-[#4B1E78] text-white shadow-md"
                                                : "text-slate-700 hover:bg-purple-50 hover:text-[#4B1E78]"
                                                }`}
                                        >
                                            <span>{cat.name}</span>
                                            <span>›</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedCategory && (
                                <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100">
                                        <h3 className="font-black text-xl text-slate-900">
                                            Subcategories
                                        </h3>
                                    </div>

                                    <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
                                        {activeSubcategories.map((sub) => (
                                            <button
                                                key={sub}
                                                onClick={() => {
                                                    setSelectedSubcategory(selectedSubcategory === sub ? "" : sub);
                                                    setVisibleCount(LOAD_STEP);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${selectedSubcategory === sub
                                                    ? "bg-[#4B1E78] text-white shadow-md"
                                                    : "bg-slate-50 text-slate-700 hover:bg-purple-50 hover:text-[#4B1E78]"
                                                    }`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                                <div className="p-5 border-b border-slate-100">
                                    <h3 className="font-black text-xl text-slate-900">Brands</h3>
                                </div>

                                <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
                                    {availableBrands.map((brand) => (
                                        <label
                                            key={brand}
                                            className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-purple-50 transition-all"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleBrand(brand)}
                                                className="accent-[#4B1E78]"
                                            />
                                            <span className="text-sm font-semibold text-slate-700">
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {availableModels.length > 0 && (
                                <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100">
                                        <h3 className="font-black text-xl text-slate-900">
                                            Models
                                        </h3>
                                    </div>

                                    <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
                                        {availableModels.map((model) => (
                                            <label
                                                key={model}
                                                className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-purple-50 transition-all"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedModels.includes(model)}
                                                    onChange={() => toggleModel(model)}
                                                    className="accent-[#4B1E78]"
                                                />
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {model}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={resetFilters}
                                className="w-full bg-white text-red-500 border border-red-100 py-3 rounded-2xl font-bold hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                            >
                                Clear Filters
                            </button>

                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full bg-[#4B1E78] text-white py-3 rounded-2xl font-black shadow-lg"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            </main>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <section className="mt-4 bg-white rounded-3xl p-4 shadow-lg border border-purple-100">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-100">
                        <div>
                            <p className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-1">
                                Recommended
              </p>

                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                                Products You May Like
              </h2>

                            <p className="text-slate-500 text-sm mt-1">
                                Handpicked electronics based on popular choices
              </p>
                        </div>

                        <Link
                            to="/products"
                            className="hidden md:flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-purple-300 bg-white text-purple-700 font-bold shadow-sm hover:shadow-lg hover:border-purple-500 hover:-translate-y-0.5 transition-all"
                        >
                            View All <span className="text-lg">→</span>
                        </Link>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-5 pt-2 snap-x snap-mandatory scroll-smooth">
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
        </div>
    );
}