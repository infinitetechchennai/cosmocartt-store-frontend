import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { products } from "../data/products";
import { useState } from "react";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    deleteItem,
    addToCart,
  } = useCart();

  const subtotal = cartItems.reduce(
  (sum: number, item: any) =>
    sum + item.retailPrice * item.quantity,
  0
);

  const shipping = subtotal > 0 ? 0 : 0;
  const discount = 0;
  const total = subtotal - discount + shipping;
  const [recommendPage, setRecommendPage] =
  useState(1);

const recommendPerPage = 4;

const recommendedProducts =
  products.filter(
    (product) =>
      !cartItems.some(
        (item: any) =>
          item._id === product._id
      )
  );

const recommendTotalPages = Math.ceil(
  recommendedProducts.length /
    recommendPerPage
);

const visibleRecommended =
  recommendedProducts.slice(
    (recommendPage - 1) *
      recommendPerPage,
    recommendPage * recommendPerPage
  );
  

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-10 text-slate-900">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[32px] p-16 text-center border border-slate-200">
            <h2 className="text-3xl font-bold">
              Your Cart Is Empty
            </h2>

            <p className="text-slate-500 mt-3">
              Add products to continue shopping.
            </p>

            <Link
              to="/products"
              className="inline-flex mt-8 px-8 py-4 rounded-full bg-[#6F2DBD] text-white font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.8fr_0.8fr] gap-8">
            {/* LEFT */}

            <div className="bg-white rounded-[32px] border border-slate-200 p-8">
              {/* HEADER */}

              <div className="grid grid-cols-4 pb-4 border-b text-sm font-semibold text-slate-500">
                <div>Product</div>
                <div className="text-center">
                  Quantity
                </div>
                <div className="text-center">
                  Total
                </div>
                <div className="text-center">
                  Action
                </div>
              </div>

              {/* ITEMS */}

              <div className="divide-y">
                {cartItems.map((item: any) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-4 items-center py-6"
                  >
                    {/* PRODUCT */}

                    <div className="flex items-center gap-4">
                      <div className="h-24 w-24 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 object-contain"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg">
                          {item.name}
                        </h3>

                        <p className="text-slate-500 text-sm">
                          Premium Product
                        </p>

                        <p className="font-semibold text-[#6F2DBD] mt-1">
                          ₹
                          {item.retailPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* QUANTITY */}

                    <div className="flex justify-center">
                      <div className="flex items-center border rounded-full overflow-hidden">
                        <button
                          onClick={() =>
                            removeFromCart(item._id)
                          }
                          className="h-10 w-10 hover:bg-slate-100"
                        >
                          -
                        </button>

                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            addToCart(item)
                          }
                          className="h-10 w-10 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* TOTAL */}

                    <div className="text-center font-bold text-xl">
                      ₹
                      {(
                        item.retailPrice *
                        item.quantity
                      ).toLocaleString()}
                    </div>

                    {/* DELETE */}

                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          deleteItem(item._id)
                        }
                        className="text-red-500 hover:scale-110 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>

            {/* RIGHT */}

            <div
              className="
                bg-white
                rounded-[32px]
                border
                border-slate-200
                p-6
                h-fit
                sticky
                top-24
              "
            >
              <h2 className="text-xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Discount voucher"
                  className="
                    flex-1
                    border
                    rounded-full
                    px-4
                    py-2
                    outline-none
                  "
                />

                <button
                  className="
                    px-5
                    rounded-full
                    border
                  "
                >
                  Apply
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sub Total</span>

                  <span className="font-semibold">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>

                  <span>
                    ₹{discount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>

                  <span>
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping}`}
                  </span>
                </div>
              </div>

              <div className="border-t mt-5 pt-5">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>

                  <span>
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-sm text-slate-500">
                ✓ Secure Payment
                <br />
                ✓ Fast Delivery
                <br />
                ✓ Easy Returns
              </div>

              <Link
                to="/checkout"
                className="
  block
  text-center
  mt-8
  py-4
  rounded-2xl
  bg-gradient-to-r
  from-[#4B1E78]
  to-[#6F2DBD]
  text-white
  font-bold
  shadow-lg
  hover:scale-[1.02]
  transition-all
"
              >
                Checkout Now
              </Link>
            </div>
          </div>
        )}
      </div>

{/* RECOMMENDED PRODUCTS */}

<div className="max-w-7xl mx-auto px-6 pb-16">

  <div className="flex items-center justify-between mb-8">

    <div>
      <h2 className="text-3xl font-bold">
        You May Also Like
      </h2>

      <p className="text-slate-500 mt-2">
        Recommended products for you
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

  {visibleRecommended.map((product: any) => (

    <div
      key={product._id}
      className="
  group
  bg-white
  rounded-3xl
  border
  border-slate-200
  overflow-hidden
  hover:shadow-2xl
  hover:-translate-y-2
  transition-all
  duration-300
"
    >

      <div className="h-52 bg-slate-50 flex items-center justify-center p-6">

        <img
          src={product.image}
          alt={product.name}
          className="
  h-40
  object-contain
  group-hover:scale-110
  transition-all
  duration-300
"
        />

      </div>

      <div className="p-5">

        <h3 className="font-semibold line-clamp-2">
          {product.name}
        </h3>

        <p className="mt-3 text-2xl font-bold text-[#6F2DBD]">
          ₹{product.retailPrice}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="
            w-full
            mt-4
            py-3
            rounded-xl
            bg-[#6F2DBD]
            text-white
          "
        >
          Add To Cart
        </button>

      </div>

    </div>

  ))}

</div>
<div className="flex justify-center gap-3 mt-10">

  <button
    onClick={() =>
      setRecommendPage((p) =>
        Math.max(1, p - 1)
      )
    }
    disabled={recommendPage === 1}
    className="px-4 py-2 border rounded-xl"
  >
    ←
  </button>

  <span
    className="
      px-5
      py-2
      bg-[#6F2DBD]
      text-white
      rounded-xl
    "
  >
    {recommendPage}
  </span>

  <button
    onClick={() =>
      setRecommendPage((p) =>
        Math.min(
          recommendTotalPages,
          p + 1
        )
      )
    }
    disabled={
      recommendPage ===
      recommendTotalPages
    }
    className="px-4 py-2 border rounded-xl"
  >
    →
  </button>

</div>
    </div>

  </div>

</div>

<Footer />
    </div>
  );
}
