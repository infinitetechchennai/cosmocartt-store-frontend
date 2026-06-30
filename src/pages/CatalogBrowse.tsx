import { apiPath } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import BrandLogo from "../components/BrandLogo";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Layers3,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

type CatalogItem = {
  name: string;
  productCount: number;
  image?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockProducts?: number;
};

const encode = (value: string) => encodeURIComponent(value);

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

  const isProductLevel = Boolean(
    decodedCategory && decodedSubcategory && decodedBrand && decodedModel
  );

  useEffect(() => {
    setLoading(true);
    setSearch("");

    if (isProductLevel) {
      const productParams = new URLSearchParams();

      productParams.set("category", decodedCategory);
      productParams.set("subcategory", decodedSubcategory);
      productParams.set("brand", decodedBrand);
      productParams.set("model", decodedModel);

      fetch(apiPath(`/api/products?${productParams.toString()}`))
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProducts(data.products || []);
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
    if (decodedModel) return `${decodedModel}`;
    if (decodedBrand) return `Choose Your ${decodedBrand} Model`;
    if (decodedSubcategory) return `Shop ${decodedSubcategory} by Brand`;
    if (decodedCategory) return `Explore ${decodedCategory}`;
    return "Explore CosmoCartt Catalog";
  }, [decodedCategory, decodedSubcategory, decodedBrand, decodedModel]);

  const subtitle = useMemo(() => {
    if (decodedModel) return `Premium products available for ${decodedModel}.`;
    if (decodedBrand) return `Select your model to view matching products.`;
    if (decodedSubcategory) return `Choose a brand and continue to available models.`;
    if (decodedCategory) return `Browse live subcategories generated from product data.`;
    return "Browse categories, subcategories, brands and models directly from the live catalog.";
  }, [decodedCategory, decodedSubcategory, decodedBrand, decodedModel]);

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Catalog", to: "/catalog" },
    decodedCategory && {
      label: decodedCategory,
      to: `/catalog/${encode(decodedCategory)}`,
    },
    decodedSubcategory && {
      label: decodedSubcategory,
      to: `/catalog/${encode(decodedCategory)}/${encode(decodedSubcategory)}`,
    },
    decodedBrand && {
      label: decodedBrand,
      to: `/catalog/${encode(decodedCategory)}/${encode(decodedSubcategory)}/${encode(decodedBrand)}`,
    },
    decodedModel && {
      label: decodedModel,
      to: `/catalog/${encode(decodedCategory)}/${encode(decodedSubcategory)}/${encode(decodedBrand)}/${encode(decodedModel)}`,
    },
  ].filter(Boolean) as { label: string; to: string }[];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = isProductLevel
    ? products.length
    : items.reduce((sum, item) => sum + Number(item.productCount || 0), 0);

  const startingPrice = !isProductLevel
    ? items
        .map((item) => item.minPrice)
        .filter((price): price is number => typeof price === "number")
        .sort((a, b) => a - b)[0]
    : products
        .map((product) => Number(product.retailPrice || 0))
        .filter(Boolean)
        .sort((a, b) => a - b)[0];

  const getNextLabel = () => {
    if (!decodedCategory) return "Subcategories";
    if (!decodedSubcategory) return "Brands";
    if (!decodedBrand) return "Models";
    return "Products";
  };

  const getNextLink = (itemName: string) => {
    const encoded = encode(itemName);

    if (!decodedCategory) return `/catalog/${encoded}`;

    if (!decodedSubcategory) {
      return `/catalog/${encode(decodedCategory)}/${encoded}`;
    }

    if (!decodedBrand) {
      return `/catalog/${encode(decodedCategory)}/${encode(decodedSubcategory)}/${encoded}`;
    }

    return `/catalog/${encode(decodedCategory)}/${encode(decodedSubcategory)}/${encode(decodedBrand)}/${encoded}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F5FB]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-10 pb-10">
        <section className="relative rounded-[1.75rem] sm:rounded-[2.25rem] overflow-hidden bg-gradient-to-r from-[#1E0B3A] via-[#3D1766] to-[#6F2DBD] text-white shadow-2xl border border-white/10 mb-6">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-28 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-5 sm:p-8 lg:p-10">
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-purple-100">
              {breadcrumb.map((crumb, index) => (
                <span key={crumb.to} className="flex items-center gap-2">
                  <Link to={crumb.to} className="hover:text-white">
                    {crumb.label}
                  </Link>
                  {index < breadcrumb.length - 1 && <span>/</span>}
                </span>
              ))}
            </div>

            <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-end mt-4">
              <div>
                <p className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-purple-100">
                  <Sparkles size={14} />
                  Live Catalog
                </p>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mt-4 leading-tight">
                  {title}
                </h1>

                <p className="mt-4 text-purple-100 text-sm sm:text-lg max-w-2xl">
                  {subtitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard label={isProductLevel ? "Products" : getNextLabel()} value={isProductLevel ? products.length : items.length} />
                <StatCard label="Total Items" value={totalProducts} />
                <StatCard label="Starting" value={startingPrice ? `₹${startingPrice}` : "—"} />
                <StatCard label="Level" value={level || "Catalog"} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 mb-6">
          <InfoCard icon={<Truck size={22} />} title="Fast Delivery" text="Reliable dispatch for available products." />
          <InfoCard icon={<ShieldCheck size={22} />} title="Secure Checkout" text="COD and online payment support." />
          <InfoCard icon={<Layers3 size={22} />} title="Dynamic Catalog" text="Updated automatically from admin imports." />
        </section>

        {!isProductLevel && (
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between border border-purple-100">
            <div>
              <p className="font-black text-slate-900">
                Browse {getNextLabel()}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                These options are generated from live product data.
              </p>
            </div>

            <div className="relative w-full lg:w-96">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder={`Search ${getNextLabel().toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-purple-100 outline-none focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>
        )}

        {loading ? (
          <SkeletonGrid />
        ) : isProductLevel ? (
          products.length > 0 ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-1">
                    Products
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Available Collection
                  </h2>
                </div>

                <Link
                  to={`/products?category=${encode(decodedCategory)}&subcategory=${encode(decodedSubcategory)}&brand=${encode(decodedBrand)}&model=${encode(decodedModel)}`}
                  className="hidden sm:inline-flex items-center gap-2 bg-white border border-purple-100 text-[#4B1E78] px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-purple-50"
                >
                  Open in Products
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState />
          )
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <Link
                key={item.name}
                to={getNextLink(item.name)}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-purple-100"
              >
                <div className="h-36 sm:h-40 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center overflow-hidden">
                  {level === "brand" ? (
                    <BrandLogo
                      brandName={item.name}
                      fallbackImage={item.image}
                      className="max-h-24 max-w-[130px] object-contain group-hover:scale-105 transition duration-500"
                    />
                  ) : item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <Package className="text-[#4B1E78]" size={44} />
                  )}
                </div>

                <div className="p-4 text-center">
                  <h3 className="font-black text-slate-900 line-clamp-2 min-h-[44px]">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    {item.productCount} Products
                  </p>

                  {typeof item.inStockProducts === "number" && (
                    <p className="text-xs text-green-600 font-bold mt-1">
                      {item.inStockProducts} in stock
                    </p>
                  )}

                  {typeof item.minPrice === "number" && (
                    <p className="font-black text-[#4B1E78] mt-2">
                      From ₹{item.minPrice}
                    </p>
                  )}

                  <div className="mt-4 w-full bg-[#4B1E78] text-white py-2 rounded-xl font-semibold group-hover:bg-[#6F2DBD] transition inline-flex items-center justify-center gap-2">
                    Explore
                    <ArrowRight size={15} />
                  </div>
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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-lg">
      <p className="text-xs text-purple-100">{label}</p>
      <h3 className="text-xl font-black capitalize mt-1">{value}</h3>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#4B1E78] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{text}</p>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
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
