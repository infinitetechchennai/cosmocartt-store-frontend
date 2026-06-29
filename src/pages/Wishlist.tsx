import { API_URL } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { products } from "../data/products";

import {
  Heart,
  ShoppingCart,
  ArrowRight,
  Trash2,
  ShieldCheck,
  Star,
  PackageCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { getImageUrl } from "../utils/imageUrl";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const recommendedProducts = products.slice(0, 4);

  const totalValue = wishlistItems.reduce(
    (total: number, item: any) => total + item.retailPrice,
    0
  );

  const moveAllToCart = () => {
    wishlistItems.forEach((item: any) => addToCart(item));
  };

  return (
    <div className="min-h-screen bg-[#f7f5fb]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#241033] via-[#4B1E78] to-[#8B5CF6] p-8 md:p-10 mb-10 shadow-2xl">
          <div className="absolute -top-24 right-0 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-28 left-0 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-white">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-sm font-black">
                <Heart size={16} fill="currentColor" />
                YOUR SAVED COLLECTION
              </span>

              <h1 className="mt-5 text-4xl md:text-6xl font-black leading-tight">
                Wishlist
              </h1>

              <p className="text-purple-100 mt-4 max-w-2xl text-lg">
                Save your favourite products, compare them later and move them to cart when you are ready.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 min-w-[320px]">
              <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5 border border-white/20">
                <p className="text-purple-100 text-sm">Saved Items</p>
                <h2 className="text-4xl font-black mt-1">
                  {wishlistItems.length}
                </h2>
              </div>

              <div className="rounded-3xl bg-white text-[#4B1E78] p-5 shadow-xl">
                <p className="text-slate-500 text-sm">Total Value</p>
                <h2 className="text-3xl font-black mt-1">
                  ₹{totalValue.toLocaleString()}
                </h2>
              </div>
            </div>
          </div>
        </section>

        {wishlistItems.length === 0 ? (
          <section className="bg-white rounded-[36px] p-16 md:p-24 text-center border border-slate-200 shadow-xl">
            <div className="mx-auto h-28 w-28 rounded-full bg-pink-50 flex items-center justify-center">
              <Heart size={54} className="text-pink-500" />
            </div>

            <h2 className="text-4xl font-black mt-8 text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="text-slate-500 mt-3 text-lg">
              Start adding products you love and find them here anytime.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-2xl bg-[#4B1E78] text-white font-bold hover:bg-[#6F2DBD] hover:gap-4 transition-all"
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </section>
        ) : (
          <div className="grid lg:grid-cols-[1.8fr_0.8fr] gap-8">

            {/* LEFT LIST */}
            <section className="space-y-5">
              {wishlistItems.map((product: any) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-[32px] border border-slate-200 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_22px_70px_rgba(75,30,120,0.16)] transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative h-56 md:h-48 md:w-56 rounded-[28px] bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="absolute top-4 left-4 bg-pink-50 text-pink-600 text-xs font-black px-3 py-1 rounded-full">
                        Saved
                      </span>

                      <img
                        src={getImageUrl(product.images?.[0])}
                        alt={product.name}
                        className="h-40 object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={14} fill="currentColor" />
                            ))}
                            <span className="text-xs text-slate-400 ml-1">
                              Premium Rated
                            </span>
                          </div>

                          <h3 className="mt-3 text-xl md:text-2xl font-black text-slate-900 line-clamp-2">
                            {product.name}
                          </h3>

                          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold">
                            <ShieldCheck size={14} />
                            Best Deal Available
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="h-11 w-11 rounded-full border border-slate-200 flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-5 flex items-end gap-3">
                        <span className="text-4xl font-black text-[#4B1E78]">
                          ₹{product.retailPrice?.toLocaleString()}
                        </span>

                        <span className="text-slate-400 line-through mb-1">
                          ₹{Math.round(product.retailPrice * 1.25).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          onClick={() => addToCart(product)}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#4B1E78] text-white font-bold hover:bg-[#6F2DBD] transition-all"
                        >
                          <ShoppingCart size={18} />
                          Add To Cart
                        </button>

                        <Link
                          to={`/product/${product.slug || product._id}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold hover:border-[#4B1E78] hover:text-[#4B1E78] transition-all"
                        >
                          View Product
                          <ArrowRight size={17} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* RIGHT SUMMARY */}
            <aside className="bg-white rounded-[32px] border border-slate-200 p-6 h-fit sticky top-28 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <h2 className="text-2xl font-black text-slate-900">
                Wishlist Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Total Items</span>
                  <span className="font-black text-slate-900">
                    {wishlistItems.length}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Wishlist Value</span>
                  <span className="font-black text-[#4B1E78]">
                    ₹{totalValue.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={moveAllToCart}
                className="w-full mt-7 py-4 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#7C3AED] text-white font-black hover:scale-[1.02] transition-all"
              >
                Move All To Cart
              </button>

              <Link
                to="/products"
                className="w-full mt-3 py-4 rounded-2xl border border-slate-300 font-black text-slate-700 flex items-center justify-center gap-2 hover:border-[#4B1E78] hover:text-[#4B1E78] transition-all"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </Link>

              <div className="mt-7 rounded-3xl bg-slate-50 p-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck size={17} className="text-[#4B1E78]" />
                  Fast delivery available
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-[#4B1E78]" />
                  Secure checkout
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-[#4B1E78]" />
                  Premium quality products
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* RECOMMENDED */}
        <section className="mt-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-[#4B1E78] text-sm font-black">
                <PackageCheck size={16} />
                RECOMMENDED PICKS
              </span>

              <h2 className="mt-4 text-4xl font-black text-slate-900">
                You May Also Like
              </h2>

              <p className="text-slate-500 mt-2">
                Explore more products selected for your shopping style.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-[#4B1E78] font-black hover:gap-4 transition-all"
            >
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product: any) => (
              <div
                key={product._id}
                className="group bg-white rounded-[28px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-52 bg-slate-50 flex items-center justify-center p-6">
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="h-36 object-contain group-hover:scale-110 transition-all duration-300"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-black text-slate-900 line-clamp-2 min-h-[48px]">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-2xl font-black text-[#4B1E78]">
                    ₹{product.retailPrice?.toLocaleString()}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-[#4B1E78] transition-all"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
