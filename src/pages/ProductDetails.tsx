import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductDetails() {

    const { id } = useParams();

    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);

    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProduct(data.product);
                }
            })
            .catch((err) => console.error(err));
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading Product...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="grid lg:grid-cols-2 gap-12">

                    {/* LEFT */}

                    <div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm">

                            <img
                                src={product.image}
                                alt="product"
                                className="w-full h-[500px] object-contain"
                            />

                        </div>

                        <div className="grid grid-cols-4 gap-3 mt-4">

                            {[1, 2, 3, 4].map((item) => (

                                <div
                                    key={item}
                                    className="bg-white border rounded-xl p-2 cursor-pointer hover:border-[#4B1E78]"
                                >

                                    <img
                                        src={product.image}
                                        alt=""
                                        className="w-full h-20 object-cover rounded-lg"
                                    />

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div>

                        <p className="text-[#4B1E78] font-semibold">
                            {product.brand}
                        </p>

                        <h1 className="text-4xl font-bold mt-2">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-3 mt-4">

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                ★ 4.8
              </span>

                            <span className="text-zinc-500">
                                326 Reviews
              </span>

                        </div>

                        <div className="mt-6 flex items-center gap-4">

                            <span className="text-4xl font-bold text-[#4B1E78]">
                                ₹{product.retailPrice?.toLocaleString()}
                            </span>

                            <span className="text-xl text-zinc-400 line-through">
                                ₹{(product.retailPrice + 5000).toLocaleString()}
                            </span>

                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                                10% OFF
              </span>

                        </div>

                        <div className="mt-6">

                            <span
                                className={`font-semibold ${product.stock > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {product.stock > 0
                                    ? `${product.stock} In Stock`
                                    : "Out Of Stock"}
                            </span>

                        </div>

                        <div className="mt-8">

                            <h3 className="font-semibold text-lg mb-3">
                                {product.description}
                            </h3>

                            <p className="text-zinc-600 leading-7">
                                Product ID: {id}.</p>
                            <p >Premium flagship smartphone
                            with advanced camera system, titanium build,
                            powerful processor and all-day battery life.
              </p>

                        </div>

                        {/* QUANTITY */}

                        <div className="mt-8">

                            <h3 className="font-semibold mb-3">
                                Quantity
              </h3>

                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() =>
                                        setQuantity((prev) =>
                                            prev > 1 ? prev - 1 : 1
                                        )
                                    }
                                    className="w-10 h-10 border rounded-lg"
                                >
                                    -
</button>

                                <span className="font-semibold">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                    }
                                    className="w-10 h-10 border rounded-lg"
                                >
                                    +
</button>

                            </div>

                        </div>

                        {/* BUTTONS */}

                        <div className="grid grid-cols-2 gap-4 mt-10">

                            <button
                                onClick={() => {
                                    for (let i = 0; i < quantity; i++) {
                                        addToCart(product);
                                    }
                                }}
                                className="bg-[#4B1E78] hover:bg-[#39155d] text-white py-4 rounded-xl font-semibold"
                            >
                                Add To Cart
</button>

                            <button className="bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold">
                                Buy Now
              </button>

                        </div>

                    </div>

                </div>

                {/* SPECIFICATIONS */}

                <div className="bg-white rounded-3xl p-8 shadow-sm mt-12">

                    <h2 className="text-2xl font-bold mb-6">
                        Specifications
          </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>
                            <strong>Display:</strong> 6.9" OLED
            </div>

                        <div>
                            <strong>Processor:</strong> A18 Pro
            </div>

                        <div>
                            <strong>Storage:</strong> 256GB
            </div>

                        <div>
                            <strong>RAM:</strong> 8GB
            </div>

                        <div>
                            <strong>Camera:</strong> 48MP Triple Camera
            </div>

                        <div>
                            <strong>Battery:</strong> 5000mAh
            </div>

                    </div>

                </div>

            </div>

            <Footer />
        </div>
    );
}