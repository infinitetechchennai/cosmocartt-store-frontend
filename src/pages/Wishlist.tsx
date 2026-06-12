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
} from "lucide-react";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const recommendedProducts = products.slice(0,4);

  const totalValue = wishlistItems.reduce(
    (total: number, item: any) => total + item.retailPrice,
    0
  );

  
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}

        <div
  className="
  bg-white
  rounded-[32px]
  border
  border-slate-200
  p-10
  mb-10
  shadow-[0_15px_50px_rgba(0,0,0,0.06)]
"
>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                My Wishlist
              </h1>

              <p className="text-slate-500 mt-2">
                Save products you love and buy them later.
              </p>
            </div>

            <div className="flex gap-4">

  <div
    className="
      bg-purple-50
      rounded-2xl
      px-6
      py-4
    "
  >
    <p className="text-sm text-slate-500">
      Saved Products
    </p>

    <h2 className="text-3xl font-bold text-[#6F2DBD]">
      {wishlistItems.length}
    </h2>
  </div>

  <div
    className="
      bg-gradient-to-r
      from-purple-50
      to-purple-100
      rounded-2xl
      px-6
      py-4
      border
      border-purple-200
    "
  >
    <p className="text-sm text-slate-500">
      Wishlist Value
    </p>

    <h2 className="text-3xl font-bold text-[#6F2DBD]">
      ₹{totalValue.toLocaleString()}
    </h2>
  </div>

</div>
          </div>
        </div>

        {/* EMPTY */}

        {wishlistItems.length === 0 ? (

<>
<div className="bg-white rounded-[32px] border border-slate-200 p-20 text-center shadow-xl">

    <Heart
        size={90}
        className="mx-auto text-pink-500"
    />

    <h2 className="text-4xl font-bold mt-8">
        Your Wishlist is Empty
    </h2>

    <p className="text-slate-500 mt-3 text-lg">
        Save products you love and purchase them later.
    </p>

    <Link
        to="/products"
        className="
        inline-flex
        items-center
        gap-2
        mt-8
        px-8
        py-4
        rounded-2xl
        bg-[#6F2DBD]
        text-white
        hover:bg-[#4B1E78]
        transition-all
        "
    >
        Browse Products
        <ArrowRight size={18} />
    </Link>

</div>

{/* TRENDING PRODUCTS */}

<div className="mt-16">

    <div className="flex items-center justify-between mb-8">

        <div>
            <h2 className="text-3xl font-bold text-slate-900">
                Trending Collection
            </h2>

            <p className="text-slate-500 mt-2">
                Discover our best-selling electronics and latest arrivals.
            </p>
        </div>

        <Link
            to="/products"
            className="
            text-[#6F2DBD]
            font-semibold
            hover:underline
            "
        >
            View All Products →
        </Link>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {[1,2,3,4].map((item) => (

            <div
                key={item}
                className="
                bg-white
                rounded-3xl
                border
                border-slate-200
                overflow-hidden
                hover:shadow-xl
                transition-all
                duration-300
                "
            >

                <div className="h-56 bg-slate-100 animate-pulse"></div>

                <div className="p-5">

                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>

                    <div className="h-4 bg-slate-200 rounded w-1/2 mt-3 animate-pulse"></div>

                    <div className="h-10 bg-purple-100 rounded-xl mt-5 animate-pulse"></div>

                </div>

            </div>

        ))}

    </div>

</div>

</>

) : (

<div className="grid lg:grid-cols-3 gap-8">

{wishlistItems.map((product:any) => (

<div
key={product._id}
className="
group
bg-white
rounded-[32px]
overflow-hidden
border
border-slate-200
hover:border-purple-300
shadow-[0_10px_40px_rgba(0,0,0,0.06)]
hover:shadow-[0_20px_70px_rgba(111,45,189,0.18)]
transition-all
duration-500
hover:-translate-y-2
"
>

{/* IMAGE */}

<div
className="
relative
h-[320px]
bg-gradient-to-b
from-purple-50
via-white
to-white
flex
items-center
justify-center
"
>

<button
onClick={() =>
removeFromWishlist(product._id)
}
className="
absolute
top-5
right-5
h-11
w-11
rounded-full
bg-white
shadow-lg
flex
items-center
justify-center
text-red-500
hover:scale-110
transition-all
"
>
<Trash2 size={18}/>
</button>

<div
className="
absolute
top-5
left-5
bg-[#6F2DBD]
text-white
text-xs
font-semibold
px-3
py-1
rounded-full
"
>
Wishlist
</div>

<img
src={product.image}
alt={product.name}
className="
h-64
object-contain
group-hover:scale-110
transition-all
duration-500
"
/>

</div>

{/* CONTENT */}

<div className="p-7">

<div className="flex items-center gap-2 text-amber-500">

<Star
size={14}
fill="currentColor"
/>

<Star
size={14}
fill="currentColor"
/>

<Star
size={14}
fill="currentColor"
/>

<Star
size={14}
fill="currentColor"
/>

<Star
size={14}
fill="currentColor"
/>

<span className="text-xs text-slate-500 ml-1">
Premium Rated
</span>

</div>

<h3
className="
mt-4
font-bold
text-xl
text-slate-800
line-clamp-2
min-h-[60px]
"
>
{product.name}
</h3>

<div className="mt-5">

<span
className="
text-4xl
font-black
text-[#6F2DBD]
"
>
₹{product.retailPrice}
</span>

<span
className="
ml-3
text-slate-400
line-through
"
>
₹{Math.round(product.retailPrice * 1.25)}
</span>

</div>

<div
className="
mt-3
inline-flex
items-center
gap-2
bg-green-50
text-green-700
px-3
py-2
rounded-xl
text-sm
font-medium
"
>
<ShieldCheck size={16}/>
Best Deal
</div>

<div className="grid grid-cols-2 gap-3 mt-7">

<button
onClick={() =>
addToCart(product)
}
className="
flex
items-center
justify-center
gap-2
py-4
rounded-2xl
bg-[#6F2DBD]
text-white
font-semibold
hover:bg-[#4B1E78]
transition-all
"
>
<ShoppingCart size={18}/>
Add To Cart
</button>

<Link
to={`/product/${product._id}`}
className="
flex
items-center
justify-center
rounded-2xl
border
border-slate-300
font-medium
hover:bg-slate-50
transition-all
"
>
View Product
</Link>

</div>

</div>

</div>

))}
</div>
)}

</div>
<Footer />
</div>
);
}

