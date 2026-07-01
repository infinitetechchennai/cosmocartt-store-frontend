import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import {
  ArrowRight,
  Home,
  Search,
  ShoppingBag,
  Sparkles,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F3FF]">
      <SEO title="Page Not Found - Cosmocartt" description="The page you were looking for is not available. Explore Cosmocartt products, brands and support pages instead." canonical="https://www.cosmocartt.com/404" noIndex />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <section className="relative overflow-hidden rounded-[2.2rem] bg-white border border-purple-100 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,45,189,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(75,30,120,0.16),transparent_35%)]" />

          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center p-6 sm:p-10 lg:p-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-100 px-4 py-2 text-sm font-black text-[#4B1E78]">
                <Sparkles size={16} />
                Lost in the CosmoCartt galaxy
              </div>

              <h1 className="mt-8 text-[7rem] sm:text-[9rem] lg:text-[11rem] leading-none font-black tracking-tight text-[#4B1E78]">
                404
              </h1>

              <h2 className="mt-4 text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
                This product aisle does not exist.
              </h2>

              <p className="mt-5 max-w-xl text-slate-500 text-base sm:text-lg leading-8">
                The page may have moved, the link may be broken, or the item may no longer be available. Let’s get you back to shopping.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4B1E78] px-7 py-4 font-black text-white shadow-xl hover:bg-[#35145a] hover:scale-[1.02] transition"
                >
                  <Home size={18} />
                  Go Home
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-purple-200 px-7 py-4 font-black text-[#4B1E78] hover:bg-purple-50 hover:scale-[1.02] transition"
                >
                  Browse Products
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                {[
                  { icon: Truck, text: "Fast Delivery" },
                  { icon: ShieldCheck, text: "Secure Checkout" },
                  { icon: Headphones, text: "Support Ready" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-2xl bg-white/80 border border-purple-100 px-4 py-3 shadow-sm"
                  >
                    <item.icon size={18} className="text-[#6F2DBD]" />
                    <span className="text-sm font-bold text-slate-700">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 bg-gradient-to-br from-purple-300/30 to-violet-300/30 rounded-[2.5rem] blur-2xl" />

              <div className="relative rounded-[2rem] bg-gradient-to-br from-[#2B1055] via-[#4B1E78] to-[#6F2DBD] p-6 sm:p-8 text-white shadow-2xl">
                <div className="rounded-[1.6rem] bg-white/10 border border-white/15 p-6 backdrop-blur-xl">
                  <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center shadow-xl">
                    <ShoppingBag className="text-[#4B1E78]" size={38} />
                  </div>

                  <h3 className="mt-6 text-2xl font-black">
                    Looking for something?
                  </h3>

                  <p className="mt-3 text-purple-100 leading-7">
                    Try searching from the products page or jump into our popular shopping routes.
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      ["Mobile Accessories", "/products?category=Mobile%20Accessories"],
                      ["TV Remotes", "/products?search=TV%20Remote"],
                      ["AC Remotes", "/products?search=AC%20Remote"],
                      ["All Products", "/products"],
                    ].map(([label, path]) => (
                      <Link
                        key={label}
                        to={path}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#4B1E78] hover:scale-[1.02] transition"
                      >
                        <span>{label}</span>
                        <Search size={16} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
