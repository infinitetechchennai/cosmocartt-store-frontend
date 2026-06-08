import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";

export default function Wishlist() {

    const {
        wishlistItems,
        removeFromWishlist
    } = useWishlist();

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold mb-8">
                    My Wishlist
                </h1>

                {wishlistItems.length === 0 ? (

                    <div className="text-center py-20">

                        <h2 className="text-2xl font-semibold">
                            Wishlist is Empty
                        </h2>

                    </div>

                ) : (

                    <div className="grid md:grid-cols-3 gap-6">

                        {wishlistItems.map(
                            (product: any) => (

                                <div
                                    key={product._id}
                                    className="bg-white rounded-2xl p-5"
                                >

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-52 w-full object-contain"
                                    />

                                    <h3 className="font-bold mt-4">
                                        {product.name}
                                    </h3>

                                    <p className="mt-2">
                                        ₹
                                        {product.retailPrice}
                                    </p>

                                    <div className="flex gap-2 mt-4">

                                        <Link
                                            to={`/product/${product._id}`}
                                            className="bg-[#4B1E78] text-white px-4 py-2 rounded-xl"
                                        >
                                            View
                                        </Link>

                                        <button
                                            onClick={() =>
                                                removeFromWishlist(
                                                    product._id
                                                )
                                            }
                                            className="border px-4 py-2 rounded-xl"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                )}

            </div>

            <Footer />

        </div>
    );
}