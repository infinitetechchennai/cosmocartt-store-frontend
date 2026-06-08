import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";

export default function Wishlist() {
const {
wishlistItems,
removeFromWishlist,
} = useWishlist();

const totalValue = wishlistItems.reduce(
    (total: number, item: any) =>
        total + item.retailPrice,
    0
);

return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-purple-50">

        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-10">

            {/* Hero Section */}

            <div className="bg-gradient-to-r from-[#2B1055] to-[#6F2DBD] rounded-3xl p-8 mb-8 text-white shadow-xl">

                <div className="flex items-center gap-4">

                    <div className="bg-white/20 p-4 rounded-2xl">
                        <Heart size={40} />
                    </div>

                    <div>
                        <h1 className="text-5xl font-black">
                            My Wishlist
                        </h1>

                        <p className="text-purple-100 mt-2">
                            Save products you love and buy them later.
                        </p>
                    </div>

                </div>

                <div className="mt-6 flex gap-4 flex-wrap">

                    <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl">
                        <p className="text-sm text-purple-100">
                            Saved Products
                        </p>

                        <h3 className="text-2xl font-bold">
                            {wishlistItems.length}
                        </h3>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl">
                        <p className="text-sm text-purple-100">
                            Total Value
                        </p>

                        <h3 className="text-2xl font-bold">
                            ₹{totalValue.toLocaleString()}
                        </h3>
                    </div>

                </div>

            </div>

            {/* Empty State */}

            {wishlistItems.length === 0 ? (

                <div className="bg-white rounded-3xl p-16 text-center shadow-lg">

                    <Heart
                        size={80}
                        className="mx-auto text-pink-500"
                    />

                    <h2 className="text-3xl font-bold mt-6">
                        Your Wishlist is Empty
                    </h2>

                    <p className="text-slate-500 mt-3">
                        Save products you love and they'll appear here.
                    </p>

                    <Link
                        to="/products"
                        className="
                            inline-block
                            mt-8
                            bg-[#6F2DBD]
                            hover:bg-[#4B1E78]
                            text-white
                            px-8
                            py-3
                            rounded-2xl
                            transition-all
                        "
                    >
                        Browse Products
                    </Link>

                </div>

            ) : (

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {wishlistItems.map((product: any) => (

                        <div
                            key={product._id}
                            className="
                                bg-white
                                rounded-3xl
                                overflow-hidden
                                shadow-lg
                                hover:shadow-2xl
                                hover:-translate-y-2
                                transition-all
                                duration-300
                            "
                        >

                            <div className="bg-slate-50 p-6">

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="
                                        h-60
                                        w-full
                                        object-contain
                                    "
                                />

                            </div>

                            <div className="p-6">

                                <h3 className="font-bold text-xl text-slate-800">
                                    {product.name}
                                </h3>

                                <p className="text-3xl font-black text-[#6F2DBD] mt-3">
                                    ₹{product.retailPrice}
                                </p>

                                <div className="flex gap-3 mt-6">

                                    <Link
                                        to={`/product/${product._id}`}
                                        className="
                                            flex-1
                                            bg-[#6F2DBD]
                                            hover:bg-[#4B1E78]
                                            text-white
                                            text-center
                                            py-3
                                            rounded-2xl
                                            transition-all
                                        "
                                    >
                                        View Product
                                    </Link>

                                    <button
                                        onClick={() =>
                                            removeFromWishlist(
                                                product._id
                                            )
                                        }
                                        className="
                                            px-5
                                            py-3
                                            rounded-2xl
                                            bg-red-50
                                            text-red-600
                                            hover:bg-red-100
                                            transition-all
                                        "
                                    >
                                        Remove
                                    </button>

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
