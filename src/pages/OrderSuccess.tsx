import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";



export default function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    console.log(location.state);
    console.log(orderId);

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-20">

                <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">

                    {/* SUCCESS ICON */}
                    <div className="text-6xl mb-6">
                        🎉
                    </div>

                    {/* TITLE */}
                    <h1 className="text-3xl font-bold text-green-600 mb-3">
                        Order Confirmed!
                    </h1>

                    {/* SUBTEXT */}
                    <p className="text-gray-600 mb-6">
                        Your order has been placed successfully.
                    </p>

                    {/* ORDER ID */}
                    <div className="bg-slate-100 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="text-lg font-semibold text-[#4B1E78]">
                            {orderId}
                        </p>
                    </div>

                    {/* DELIVERY INFO */}
                    <div className="text-sm text-gray-600 space-y-2 mb-8">
                        <p>🚚 Expected delivery: 3 - 5 days</p>
                        <p>📦 You will receive tracking updates</p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col md:flex-row gap-4">

                        <button
                            onClick={() => navigate("/orders")}
                            className="flex-1 bg-[#4B1E78] hover:bg-[#3a155d] transition text-white py-3 rounded-xl font-semibold"
                        >
                            View Orders
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 border hover:bg-gray-100 transition py-3 rounded-xl font-semibold"
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
}