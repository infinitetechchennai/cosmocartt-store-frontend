import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import { getDisplayPrice } from "../utils/pricing";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const { addToCart } = useCart();

  const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const price =
    getDisplayPrice(product, user) || 0;

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
        y: -8,
        scale: 1.015,
      }}
      transition={{ duration: 0.3 }}
      className="
        group
        bg-white
        rounded-[28px]
        overflow-hidden
        border
        border-purple-100
        shadow-[0_8px_25px_rgba(111,45,189,0.08)]
        hover:shadow-[0_15px_40px_rgba(111,45,189,0.14)]
        transition-all
        duration-500
      "
    >
      <Link
        to={`/product/${product.slug || product._id}`}
      >
        {/* IMAGE */}
        <div className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white">

          <img
            src={
              `http://localhost:5000${product.images?.[0]}` ||
              "https://via.placeholder.com/400x400?text=No+Image"
            }
            alt={product.name}
            className="
              h-72
              w-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />

          {/* Discount */}
          <div
            className="
              absolute
              top-4
              left-4
              bg-gradient-to-r
              from-[#4B1E78]
              to-[#6F2DBD]
              text-white
              text-xs
              font-bold
              px-3
              py-1.5
              rounded-full
              shadow-md
            "
          >
            {discount}% OFF
          </div>

          {/* Wishlist */}
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
              bg-white
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

          {/* Quick View */}
          <div
            className="
              absolute
              bottom-4
              left-1/2
              -translate-x-1/2
              opacity-0
              group-hover:opacity-100
              transition
              duration-300
              z-20
            "
          >
            <div
              className="
                bg-white
                rounded-full
                px-4
                py-2
                shadow-xl
                text-sm
                font-medium
                text-[#4B1E78]
              "
            >
              Quick View
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5">

          {/* Brand */}
          <p className="text-sm text-slate-400">
            {product.brand}
          </p>

          {/* Name */}
          <h3
            className="
              font-bold
              text-lg
              mt-1
              text-slate-900
              line-clamp-2
              min-h-[56px]
            "
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">

            <div className="flex text-amber-400">
              ★★★★★
            </div>

            <span className="text-sm text-slate-500">
              ({rating})
            </span>

          </div>

          {/* Premium Badge */}
          <div
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              bg-purple-50
              text-[#4B1E78]
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
            "
          >
            Premium Choice
          </div>

          {/* Stock Status */}
          <div className="mt-3">
            {product.stock <= 0 && (
              <span
                className="
                  inline-block
                  bg-red-50
                  text-red-600
                  text-xs
                  font-medium
                  px-3
                  py-1
                  rounded-full
                "
              >
                Out of Stock
              </span>
            )}

            {product.stock > 0 &&
              product.stock <= 5 && (
                <span
                  className="
                    inline-block
                    bg-purple-50
                    text-[#6F2DBD]
                    text-xs
                    font-medium
                    px-3
                    py-1
                    rounded-full
                  "
                >
                  Only {product.stock} Left
                </span>
              )}
          </div>

          {/* Price */}
          <div
            className="
              mt-4
              flex
              items-end
              gap-3
            "
          >
            <span
              className="
                text-3xl
                font-black
                bg-gradient-to-r
                from-[#2B1055]
                to-[#6F2DBD]
                bg-clip-text
                text-transparent
              "
            >
              ₹{price.toLocaleString()}
            </span>

            <span className="line-through text-slate-400">
              ₹{oldPrice.toLocaleString()}
            </span>
          </div>

          {/* B2B */}
          {user?.customerType === "b2b" &&
            user?.verificationStatus ===
              "Verified" && (
              <div
                className="
                  mt-2
                  text-xs
                  text-green-600
                  font-semibold
                "
              >
                B2B Wholesale Price
              </div>
            )}

          {/* Delivery */}
          <div
            className="
              mt-3
              text-[#4B1E78]
              text-sm
              font-medium
            "
          >
            Free Delivery
          </div>

          {/* Stock */}
          <div
            className="
              mt-2
              text-xs
              text-slate-400
              font-medium
            "
          >
            Stock: {product.stock || 0}
          </div>
        </div>
      </Link>

      {/* BUTTON */}
      <div className="px-5 pb-5">
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
          className="
            w-full
            rounded-xl
            py-3
            font-medium
            text-white
            bg-gradient-to-r
            from-[#4B1E78]
            to-[#6F2DBD]
            hover:opacity-90
            transition-all
            duration-300
          "
        >
          Add To Cart
        </button>
      </div>
    </motion.div>
  );
}