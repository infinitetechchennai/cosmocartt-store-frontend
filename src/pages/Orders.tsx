import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  PackageOpen,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
} from "lucide-react";

export default function Orders() {
  const orders = [];
  const [products, setProducts] = useState<any[]>([]);

useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setProducts(data.products.slice(0, 4));
      }
    })
    .catch(console.error);
}, []);

  return (
    <>
      <Navbar />

      <div className="bg-[#F7F3FF] pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="bg-gradient-to-r from-[#2B1055] via-[#4B1E78] to-[#6F2DBD] rounded-[28px] p-8 md:p-10 text-white shadow-xl mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center">
                  <PackageOpen size={38} />
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold">
                    My Orders
                  </h1>
                  <p className="text-purple-100 mt-2">
                    View and track all your purchases in one place
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl px-8 py-5 min-w-[190px]">
                <p className="text-purple-100 text-sm">Total Orders</p>
                <p className="text-3xl font-extrabold">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] shadow-xl border border-purple-100 p-10 md:p-16 text-center">
            <div className="w-28 h-28 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-6">
              <PackageOpen size={58} className="text-[#6F2DBD]" />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              No Orders Yet
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Looks like you haven&apos;t placed any orders yet. Start shopping
              and your orders will appear here.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-[#4B1E78] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#2B1055] transition shadow-lg"
            >
              <ShoppingBag size={20} />
              Browse Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <Truck className="text-[#6F2DBD]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Fast Delivery</h3>
                <p className="text-sm text-gray-500">Quick doorstep delivery</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <ShieldCheck className="text-[#6F2DBD]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Secure Payments</h3>
                <p className="text-sm text-gray-500">Safe checkout process</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <RotateCcw className="text-[#6F2DBD]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Easy Returns</h3>
                <p className="text-sm text-gray-500">Hassle-free returns</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <BadgeCheck className="text-[#6F2DBD]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Genuine Products</h3>
                <p className="text-sm text-gray-500">Trusted quality items</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[28px] shadow-lg border border-purple-100 mt-10 overflow-hidden">
  <div className="flex items-center justify-between px-6 py-5 border-b border-purple-100">
    <div>
      <p className="text-xs font-bold tracking-[0.25em] text-[#8B3DFF] uppercase">
        Recommended
      </p>
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
        Products You May Like
      </h2>
      <p className="text-gray-500 mt-1">
        Handpicked electronics based on popular choices
      </p>
    </div>

    <Link
      to="/products"
      className="hidden sm:inline-flex items-center px-6 py-3 rounded-xl border-2 border-purple-300 text-[#6F2DBD] font-bold hover:bg-[#6F2DBD] hover:text-white transition"
    >
      View All →
    </Link>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
    {products.map((product) => (
      <Link
        key={product._id}
        to={`/product/${product._id}`}
        className="group bg-[#FCFAFF] rounded-2xl border border-purple-100 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="h-40 bg-white rounded-xl flex items-center justify-center mb-4 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-3 group-hover:scale-105 transition duration-300"
          />
        </div>

        <h3 className="font-bold text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-1">
          {product.brand}
        </p>

        <p className="text-lg font-extrabold text-[#4B1E78] mt-2">
          ₹{product.price}
        </p>
      </Link>
    ))}
  </div>
</div>
                </div>
      </div>

      <div className="-mt-px bg-[#F7F3FF]">
        <Footer />
      </div>
    </>
  );
}