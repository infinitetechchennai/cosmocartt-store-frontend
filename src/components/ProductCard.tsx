import { API_URL } from "../config/api";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import {
    getDisplayPrice
} from "../utils/pricing";

interface ProductCardProps {
    product: any;
}

const getProductImage = (image?: string) => {
    if (!image) {
        return "https://via.placeholder.com/400x400?text=No+Image";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    return `${API_URL}${image}`;
};

export default function ProductCard({
    product,
}: ProductCardProps) {
    const user =
        JSON.parse(
            localStorage.getItem("user") || "null"
        );
    const { addToCart } = useCart();

    const {
        wishlistItems,
        addToWishlist,
        removeFromWishlist
    } = useWishlist();

    const price =
        getDisplayPrice(
            product,
            user
        ) || 0;

    const oldPrice =
        product.oldPrice || price + 5000;

    const rating =
        product.rating || 4.8;

    const discount =
        oldPrice > 0
            ? Math.round(
                ((oldPrice - price) / oldPrice) * 100
            )
            : 0;
    const isWishlisted =
        wishlistItems.some(
            (item: any) =>
                item._id === product._id
        );

    return (
        <motion.div
            whileHover={{
                y: -10,
                scale: 1.02,
            }}
            transition={{ duration: 0.25 }}
            className="group bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/50 shadow-lg hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500"
        >
            <Link to={`/product/${product.slug || product._id}`}>

                {/* IMAGE */}

                <div className="relative overflow-hidden">

                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition duration-1000" />

                    <img
                        src={getProductImage(product.images?.[0])}
                        alt={product.name}
                        className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {discount}% OFF
          </div>

                    <div className="absolute top-4 left-24 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⭐ Bestseller
          </div>

                    <button
                        onClick={(e) => {

                            e.preventDefault();

                            e.stopPropagation();

                            if (isWishlisted) {

                                removeFromWishlist(
                                    product._id
                                );

                            } else {

                                addToWishlist(product);

                            }

                        }}
                        className="
        absolute
        top-4
        right-4
        z-20
        bg-white/90
        backdrop-blur-sm
        w-10
        h-10
        rounded-full
        shadow-lg
        hover:scale-110
        transition
    "
                    >
                        {isWishlisted ? "❤️" : "♡"}
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-300 z-20">
                        <div className="bg-white rounded-full px-4 py-2 shadow-xl text-sm font-semibold">
                            Quick View
            </div>
                    </div>

                </div>

                {/* CONTENT */}

                <div className="p-5">

                    <p className="text-sm text-slate-500">
                        {product.brand}
                    </p>

                    <h3 className="font-bold text-lg mt-1 line-clamp-2 min-h-[56px]">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-3">

                        <div className="flex text-yellow-400">
                            ★★★★★
            </div>

                        <span className="text-sm text-slate-500">
                            ({rating})
            </span>

                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 text-[#4B1E78] px-3 py-1 rounded-full text-xs font-bold">
                        ✓ Premium Choice
          </div>
                    {product.stock <= 0 && (
                        <span className="inline-block bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                            Out of Stock
                        </span>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                        <span className="inline-block bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                            Only {product.stock} Left
                        </span>
                    )}

                    <div className="mt-4 flex items-end gap-3">

                        <span className="text-3xl font-black bg-gradient-to-r from-[#2B1055] to-[#6F2DBD] bg-clip-text text-transparent">
                            ₹{price.toLocaleString()}
                        </span>

                        <span className="line-through text-slate-400">
                            ₹{oldPrice.toLocaleString()}
                        </span>

                    </div>

                    {
                        user?.customerType === "b2b" &&
                        user?.verificationStatus === "Verified" && (

                            <div className="mt-2 text-xs text-green-600 font-semibold">
                                B2B Wholesale Price
                            </div>

                        )
                    }

                    <div className="mt-3 text-green-600 text-sm font-medium">
                        🚚 Free Delivery
          </div>

                    <div className="mt-2 text-xs text-orange-500 font-semibold">
                        Stock: {product.stock || 0}
                    </div>

                </div>

            </Link>



            <div className="px-5 pb-5">
                {/* {product.stock <= 0
                    ? "Out of Stock"
                    : "Add to Cart"} */}

                <button
                    onClick={() => {

                        if (product.stock <= 0) {

                            toast.error(
                                "This product is currently out of stock"
                            );

                            return;
                        }

                        addToCart(product);

                        toast.success(
                            "Added to cart"
                        );

                    }}
                    className="w-full rounded-xl py-2 font-medium bg-[#4B1E78] text-white hover:bg-[#39155d]"
                >
                    Add To Cart
</button>


            </div>

        </motion.div>
    );
}