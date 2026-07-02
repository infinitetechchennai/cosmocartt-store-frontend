import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Plus,
  Minus,
} from "lucide-react";
import { products } from "../data/products";
import { useState } from "react";
import { getDisplayPrice } from "../utils/pricing";
import { getImageUrl } from "../utils/imageUrl";
import SEO from "../components/SEO";
import { seoPages } from "../config/seo";

export default function Cart() {
  const { cartItems, removeFromCart, deleteItem, addToCart } = useCart();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const priceOf = (item: any) => {
    return Number(
      getDisplayPrice(item, user) ||
      item.retailPrice ||
      item.price ||
      0
    );
  };

  const subtotal = cartItems.reduce(
    (sum: number, item: any) =>
      sum + priceOf(item) * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 0 : 0;
  const discount = 0;
  const total = subtotal - discount + shipping;

  const [recommendPage, setRecommendPage] = useState(1);
  const recommendPerPage = 4;

  const recommendedProducts = products.filter(
    (product: any) =>
      !cartItems.some(
        (item: any) =>
          (item._id || item.id) === (product._id || product.id)
      )
  );

  const recommendTotalPages = Math.ceil(
    recommendedProducts.length / recommendPerPage
  );

  const visibleRecommended = recommendedProducts.slice(
    (recommendPage - 1) * recommendPerPage,
    recommendPage * recommendPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
      <SEO title={seoPages.cart.title} description={seoPages.cart.description} canonical={seoPages.cart.canonical} noIndex />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        <section className="relative overflow-hidden rounded-[38px] bg-gradient-to-br from-[#241033] via-[#4B1E78] to-[#7C3AED] p-8 md:p-10 mb-10 shadow-2xl">
          <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
          <div className="absolute -bottom-28 left-0 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-white">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-sm font-black">
                <ShoppingBag size={16} />
                YOUR SHOPPING BAG
              </span>

              <h1 className="mt-5 text-4xl md:text-6xl font-black">
                Shopping Cart
              </h1>

              <p className="text-purple-100 mt-4 max-w-2xl text-lg">
                Review your selected products, update quantities and checkout securely.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 min-w-[320px]">
              <div className="rounded-3xl bg-white/15 backdrop-blur-md p-5 border border-white/20">
                <p className="text-purple-100 text-sm">Cart Items</p>
                <h2 className="text-4xl font-black mt-1">
                  {cartItems.length}
                </h2>
              </div>

              <div className="rounded-3xl bg-white text-[#4B1E78] p-5 shadow-xl">
                <p className="text-slate-500 text-sm">Cart Value</p>
                <h2 className="text-3xl font-black mt-1">
                  ₹{subtotal.toLocaleString()}
                </h2>
              </div>
            </div>
          </div>
        </section>

        {cartItems.length === 0 ? (
          <section className="bg-white rounded-[36px] p-16 md:p-24 text-center border border-slate-200 shadow-xl">
            <div className="mx-auto h-28 w-28 rounded-full bg-purple-50 flex items-center justify-center">
              <ShoppingBag size={54} className="text-[#4B1E78]" />
            </div>

            <h2 className="text-4xl font-black mt-8 text-slate-900">
              Your cart is empty
            </h2>

            <p className="text-slate-500 mt-3 text-lg">
              Add your favourite products and come back here to checkout.
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

            <section className="bg-white rounded-[34px] border border-slate-200 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Cart Items
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {cartItems.length} products added to your cart
                  </p>
                </div>

                <Link
                  to="/products"
                  className="hidden md:inline-flex items-center gap-2 text-[#4B1E78] font-black hover:gap-4 transition-all"
                >
                  Continue Shopping
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {cartItems.map((item: any) => (
                  <div key={item._id} className="py-6">
                    <div className="flex flex-col md:flex-row gap-5">
                      <Link
                        to={`/product/${item.slug || item._id || item.id}`}
                        className="h-40 md:h-36 md:w-36 rounded-[26px] bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0"
                      >
                        <img
                          src={getImageUrl(item.images?.[0])}
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/600x600?text=CosmoCartt";
                          }}
                          className="h-28 object-contain hover:scale-110 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-black text-slate-900 line-clamp-2">
                              {item.name}
                            </h3>

                            <p className="text-slate-500 text-sm mt-2">
                              Premium Quality Product
                            </p>

                            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold">
                              <ShieldCheck size={14} />
                              In Stock
                            </div>
                          </div>

                          <button
                            onClick={() => deleteItem(item._id)}
                            className="h-11 w-11 rounded-full border border-slate-200 flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                          <div>
                            <p className="text-sm text-slate-500">Unit Price</p>
                            <p className="text-2xl font-black text-[#4B1E78]">
                              ₹{priceOf(item).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 overflow-hidden">
                              <button
                                onClick={() => removeFromCart(item._id)}
                                className="h-11 w-11 flex items-center justify-center hover:bg-white transition-all"
                              >
                                <Minus size={16} />
                              </button>

                              <span className="w-12 text-center font-black">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => addToCart(item)}
                                className="h-11 w-11 flex items-center justify-center hover:bg-white transition-all"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-slate-500">Item Total</p>
                              <p className="text-2xl font-black text-slate-900">
                                ₹{(
                                  priceOf(item) * item.quantity
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="bg-white rounded-[34px] border border-slate-200 p-6 h-fit sticky top-28 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <h2 className="text-2xl font-black text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 rounded-2xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-sm font-bold text-slate-700">
                  Offers & Coupons
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Campaign discounts are applied automatically when available.
                </p>
              </div>

              <div className="mt-6 space-y-4 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-black text-slate-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-black text-emerald-600">
                    ₹{discount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-black text-emerald-600">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 mt-6 pt-6">
                <div className="flex justify-between items-end">
                  <span className="text-xl font-black text-slate-900">
                    Total
                  </span>

                  <span className="text-3xl font-black text-[#4B1E78]">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block text-center mt-7 py-4 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#7C3AED] text-white font-black shadow-lg hover:scale-[1.02] transition-all"
              >
                Proceed To Checkout
              </Link>

              <div className="mt-6 rounded-3xl bg-slate-50 p-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-[#4B1E78]" />
                  Secure payment
                </div>

                <div className="flex items-center gap-2">
                  <Truck size={17} className="text-[#4B1E78]" />
                  Fast delivery available
                </div>

                <div className="flex items-center gap-2">
                  <RotateCcw size={17} className="text-[#4B1E78]" />
                  Easy returns
                </div>

                <div className="flex items-center gap-2">
                  <Tag size={17} className="text-[#4B1E78]" />
                  Best price guaranteed
                </div>
              </div>
            </aside>
          </div>
        )}

        <section className="mt-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-[#4B1E78] text-sm font-black">
                <ShoppingBag size={16} />
                RECOMMENDED PICKS
              </span>

              <h2 className="mt-4 text-4xl font-black text-slate-900">
                You May Also Like
              </h2>

              <p className="text-slate-500 mt-2">
                Products picked to match your shopping style.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleRecommended.map((product: any) => (
              <div
                key={product._id || product.id}
                className="group bg-white rounded-[28px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Link
                  to={`/product/${product.slug || product._id || product.id}`}
                  className="h-52 bg-slate-50 flex items-center justify-center p-6"
                >
                  <img
                    src={
                      product.images?.[0]?.startsWith("http")
                        ? product.images[0]
                        : getImageUrl(product.images?.[0])
                    }
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/600x600?text=CosmoCartt";
                    }}
                    className="h-36 object-contain group-hover:scale-110 transition-all duration-300"
                  />
                </Link>

                <div className="p-5">
                  <h3 className="font-black text-slate-900 line-clamp-2 min-h-[48px]">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-2xl font-black text-[#4B1E78]">
                    ₹{priceOf(product).toLocaleString()}
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

          {recommendTotalPages > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={() => setRecommendPage((p) => Math.max(1, p - 1))}
                disabled={recommendPage === 1}
                className="px-4 py-2 border rounded-xl bg-white disabled:opacity-40"
              >
                ←
              </button>

              <span className="px-5 py-2 bg-[#4B1E78] text-white rounded-xl font-black">
                {recommendPage}
              </span>

              <button
                onClick={() =>
                  setRecommendPage((p) =>
                    Math.min(recommendTotalPages, p + 1)
                  )
                }
                disabled={recommendPage === recommendTotalPages}
                className="px-4 py-2 border rounded-xl bg-white disabled:opacity-40"
              >
                →
              </button>
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
