import { apiPath } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Package, Search } from "lucide-react";

type CatalogItem = {
  name: string;
  productCount: number;
  image?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockProducts?: number;
};

export default function CatalogBrowse() {
  const { category, subcategory, brand, model } = useParams();

  const decodedCategory = category ? decodeURIComponent(category) : "";
  const decodedSubcategory = subcategory ? decodeURIComponent(subcategory) : "";
  const decodedBrand = brand ? decodeURIComponent(brand) : "";
  const decodedModel = model ? decodeURIComponent(model) : "";

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const isProductLevel =
    Boolean(decodedCategory && decodedSubcategory && decodedBrand && decodedModel);

  useEffect(() => {
    setLoading(true);

    if (isProductLevel) {
      fetch(apiPath("/api/products"))
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const filtered = (data.products || []).filter((product: any) => {
              return (
                product.category === decodedCategory &&
                product.subcategory === decodedSubcategory &&
                product.brand === decodedBrand &&
                product.model === decodedModel
              );
            });

            setProducts(filtered);
            setItems([]);
            setLevel("products");
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      return;
    }

    const params = new URLSearchParams();

    if (decodedCategory) params.set("category", decodedCategory);
    if (decodedSubcategory) params.set("subcategory", decodedSubcategory);
    if (decodedBrand) params.set("brand", decodedBrand);

    fetch(apiPath(`/api/products/catalog/children?${params.toString()}`))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.items || []);
          setProducts([]);
          setLevel(data.level || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [
    decodedCategory,
    decodedSubcategory,
    decodedBrand,
    decodedModel,
    isProductLevel,
  ]);

  const title = useMemo(() => {
    if (decodedModel) return `${decodedModel} Products`;
    if (decodedBrand) return `Choose Your ${decodedBrand} Model`;
    if (decodedSubcategory) return `Choose ${decodedSubcategory} Brand`;
    if (decodedCategory) return `Explore ${decodedCategory}`;
    return "Explore Categories";
  }, [decodedCategory, decodedSubcategory, decodedBrand, decodedModel]);

  const subtitle = useMemo(() => {
    if (decodedModel) return `Premium products available for ${decodedModel}.`;
    if (decodedBrand) return `Select a model to view available products.`;
    if (decodedSubcategory) return `Select a brand to continue browsing.`;
    if (decodedCategory) return `Select a subcategory to continue browsing.`;
    return "Browse products by category, subcategory, brand and model.";
  }, [decodedCategory, decodedSubcategory, decodedBrand, decodedModel]);

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Catalog", to: "/catalog" },
    decodedCategory && {
      label: decodedCategory,
      to: `/catalog/${encodeURIComponent(decodedCategory)}`,
    },
    decodedSubcategory && {
      label: decodedSubcategory,
      to: `/catalog/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(decodedSubcategory)}`,
    },
    decodedBrand && {
      label: decodedBrand,
      to: `/catalog/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(decodedSubcategory)}/${encodeURIComponent(decodedBrand)}`,
    },
    decodedModel && {
      label: decodedModel,
      to: `/catalog/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(decodedSubcategory)}/${encodeURIComponent(decodedBrand)}/${encodeURIComponent(decodedModel)}`,
    },
  ].filter(Boolean) as { label: string; to: string }[];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getNextLink = (itemName: string) => {
    const encoded = encodeURIComponent(itemName);

    if (!decodedCategory) return `/catalog/${encoded}`;

    if (!decodedSubcategory) {
      return `/catalog/${encodeURIComponent(decodedCategory)}/${encoded}`;
    }

    if (!decodedBrand) {
      return `/catalog/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(decodedSubcategory)}/${encoded}`;
    }

    return `/catalog/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(decodedSubcategory)}/${encodeURIComponent(decodedBrand)}/${encoded}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F5FB]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-10 pb-10">
        <section className="relative bg-gradient-to-r from-[#1E0B3A] via-[#3D1766] to-[#6F2DBD] rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 mb-6 text-white shadow-2xl border border-white/10 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/2 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-wrap gap-2 text-sm text-purple-100">
              {breadcrumb.map((crumb, index) => (
                <span key={crumb.to} className="flex items-center gap-2">
                  <Link to={crumb.to} className="hover:text-white">
                    {crumb.label}
                  </Link>
                  {index < breadcrumb.length - 1 && <span>/</span>}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mt-3 leading-tight">
              {title}
            </h1>

            <p className="mt-3 text-purple-100 text-sm sm:text-lg max-w-2xl">
              {subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
                <p className="text-sm text-purple-100">
                  {isProductLevel ? "Products" : "Available"}
                </p>
                <h3 className="text-2xl font-bold">
                  {isProductLevel ? products.length : items.length}
                </h3>
              </div>

              {!isProductLevel && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
                  <p className="text-sm text-purple-100">Level</p>
                  <h3 className="text-2xl font-bold capitalize">
                    {level || "Catalog"}
                  </h3>
                </div>
              )}
            </div>
          </div>
        </section>

        {!isProductLevel && (
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <p className="font-bold text-[#4B1E78]">
              Browse automatically generated catalog paths from live product data.
            </p>

            <div className="relative w-full sm:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-purple-100 outline-none focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-4 shadow-md animate-pulse"
              >
                <div className="h-36 bg-slate-100 rounded-2xl" />
                <div className="h-4 bg-slate-100 rounded mt-4" />
                <div className="h-3 bg-slate-100 rounded mt-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : isProductLevel ? (
          products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {filteredItems.map((item) => (
              <Link
                key={item.name}
                to={getNextLink(item.name)}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-purple-100"
              >
                <div className="h-36 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <Package className="text-[#4B1E78]" size={42} />
                  )}
                </div>

                <div className="p-4 text-center">
                  <h3 className="font-black text-slate-900 line-clamp-2">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    {item.productCount} Products
                  </p>

                  {typeof item.minPrice === "number" && (
                    <p className="font-black text-[#4B1E78] mt-2">
                      From ₹{item.minPrice}
                    </p>
                  )}

                  <button className="mt-4 w-full bg-[#4B1E78] text-white py-2 rounded-xl font-semibold group-hover:bg-[#6F2DBD] transition">
                    Explore
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>

      <Footer />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl p-10 text-center shadow-md border border-purple-100">
      <Package className="mx-auto text-[#4B1E78]" size={44} />
      <h3 className="font-black text-2xl mt-4">No items found</h3>
      <p className="text-slate-500 mt-2">
        No live products are currently available for this selection.
      </p>
      <Link
        to="/catalog"
        className="inline-block mt-5 bg-[#4B1E78] text-white px-6 py-3 rounded-xl font-bold"
      >
        Back to Catalog
      </Link>
    </div>
  );
}
