import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";


interface ProductCardProps {
    product: any;
}

export default function ProductCard({
    product,
}: ProductCardProps) {
    const { addToCart } = useCart();
    const discount = Math.round(
        ((product.oldPrice - product.price) /
            product.oldPrice) *
        100
    );

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">

            <Link to={`/product/${product.id}`}>

                <div className="relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {discount}% OFF
                </span>
                </div>

                <div className="p-5">

                    <p className="text-xs text-zinc-500">
                        {product.brand}
                    </p>

                    <h3 className="font-semibold text-lg mt-1">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">

    <div className="flex text-yellow-500">
        ⭐⭐⭐⭐⭐
    </div>

    <span className="text-sm text-zinc-600">
        {product.rating}
    </span>

</div>

                    <div className="mt-3 flex items-center gap-3">
                        <span className="text-xl font-bold text-[#4B1E78]">
                            ₹{product.price.toLocaleString()}
                        </span>

                        <span className="line-through text-zinc-400 text-sm">
                            ₹{product.oldPrice.toLocaleString()}
                        </span>
                    </div>

                </div>

            </Link>

            <div className="px-5 pb-5">

                <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#4B1E78] hover:bg-[#39155d] hover:scale-[1.02] active:scale-95 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg"
                >
                    Add To Cart
            </button>

            </div>

        </div>
    );
}