import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Cart() {

    const {
        cartItems,
        removeFromCart,
        deleteItem,
        addToCart
    } = useCart();

    const total = cartItems.reduce(
        (sum, item) =>
            sum + item.retailPrice * item.quantity,
        0
    );

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold mb-8">
                    Shopping Cart
                </h1>

                {cartItems.length === 0 ? (

                    <div className="bg-white p-10 rounded-2xl text-center">

                        <h2 className="text-2xl font-semibold">
                            Your cart is empty
                        </h2>

                    </div>

                ) : (

                    <div className="grid lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 space-y-4">

                            {cartItems.map((item: any) => (

                                <div
                                    key={item._id}
                                    className="bg-white rounded-2xl p-5 flex gap-5 items-center"
                                >

                                    <img
                                        src={item.image}
                                        className="w-24 h-24 object-cover rounded-xl"
                                    />

                                    <div className="flex-1">

                                        <h3 className="font-bold">
                                            {item.name}
                                        </h3>

                                        <p className="text-[#4B1E78] font-semibold mt-1">
                                            ₹{item.retailPrice.toLocaleString()}
                                        </p>

                                    </div>

                                    <div className="flex items-center gap-3">

                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="w-8 h-8 border rounded"
                                        >
                                            -
    </button>

                                        <span className="font-semibold">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => addToCart(item)}
                                            className="w-8 h-8 border rounded"
                                        >
                                            +
    </button>

                                        <button
                                            onClick={() => deleteItem(item._id)}
                                            className="text-red-500 ml-3"
                                        >
                                            Remove
    </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                        <div className="bg-white rounded-2xl p-6 h-fit">

                            <h3 className="text-xl font-bold mb-5">
                                Order Summary
                            </h3>

                            <div className="flex justify-between">

                                <span>Total</span>

                                <span className="font-bold">
                                    ₹{total.toLocaleString()}
                                </span>

                            </div>

                            <Link
                                to="/checkout"
                                className="block text-center w-full mt-6 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold"
                            >
                                Checkout
</Link>

                        </div>

                    </div>

                )}

            </div>

            <Footer />

        </div>

    );
}