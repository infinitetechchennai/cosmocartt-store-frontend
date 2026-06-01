import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

export default function Checkout() {
    const { cartItems } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="max-w-4xl mx-auto px-6 py-20 text-center">

                    <h1 className="text-4xl font-bold mb-4">
                        Your cart is empty
                </h1>

                    <p className="text-zinc-500">
                        Add products before checkout.
                </p>

                </div>

                <Footer />
            </div>
        );
    }

    const total = cartItems.reduce(
        (sum: number, item: any) =>
            sum + item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold mb-8">
                    Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* CUSTOMER FORM */}

                    <div className="lg:col-span-2 bg-white rounded-2xl p-6">

                        <h2 className="text-2xl font-semibold mb-6">
                            Shipping Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">

                            <input
                                type="text"
                                placeholder="First Name"
                                className="border p-3 rounded-xl"
                            />

                            <input
                                type="text"
                                placeholder="Last Name"
                                className="border p-3 rounded-xl"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                className="border p-3 rounded-xl"
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="border p-3 rounded-xl"
                            />

                        </div>

                        <textarea
                            placeholder="Address"
                            className="border p-3 rounded-xl w-full mt-4 h-28"
                        />

                        <div className="grid md:grid-cols-3 gap-4 mt-4">

                            <input
                                type="text"
                                placeholder="City"
                                className="border p-3 rounded-xl"
                            />

                            <input
                                type="text"
                                placeholder="State"
                                className="border p-3 rounded-xl"
                            />

                            <input
                                type="text"
                                placeholder="Pincode"
                                className="border p-3 rounded-xl"
                            />

                        </div>

                    </div>

                    {/* ORDER SUMMARY */}

                    <div className="bg-white rounded-2xl p-6 h-fit">

                        <h2 className="text-2xl font-semibold mb-5">
                            Order Summary
                        </h2>

                        <div className="space-y-4">

                            {cartItems.map((item: any) => (

                                <div
                                    key={item.id}
                                    className="flex justify-between"
                                >

                                    <span>
                                        {item.name} x {item.quantity}
                                    </span>

                                    <span>
                                        ₹{(
                                            item.price *
                                            item.quantity
                                        ).toLocaleString()}
                                    </span>

                                </div>

                            ))}

                        </div>

                        <hr className="my-5" />

                        <div className="flex justify-between font-bold text-lg">

                            <span>Total</span>

                            <span>
                                ₹{total.toLocaleString()}
                            </span>

                        </div>

                        <button className="w-full mt-6 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold">
                            Place Order
                        </button>

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
}