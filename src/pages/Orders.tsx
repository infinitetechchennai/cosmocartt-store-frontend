import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Orders() {

    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/orders")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setOrders(data.orders);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold mb-8">
                    My Orders
        </h1>

                {/* EMPTY STATE */}
                {orders.length === 0 && (
                    <div className="text-center py-24">
                        <h2 className="text-xl font-semibold">
                            No orders yet
            </h2>
                        <p className="text-gray-500 mt-2">
                            Start shopping to place your first order
</p>
                    </div>
                )}

                {/* ORDERS LIST */}
                <div className="space-y-6">

                    {orders.map((order) => (

                        <div key={order._id} className="bg-white border rounded-lg">

                            {/* HEADER */}
                            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">

                                <div className="text-sm text-gray-600">
                                    <p>
                                        <span className="font-semibold text-black">Order ID:</span> #{order.orderNumber.slice(-8)}
                                    </p>
                                    <p>
                                        {order.createdAt
                                            ? new Date(order.createdAt).toLocaleDateString()
                                            : "No date"}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-medium ${order.status === "Placed"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {order.status}
                                    </span>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Payment: {order.paymentStatus}
                                    </p>
                                </div>



                            </div>


                            {/* ITEMS */}
                            {/* TRACKING TIMELINE */}

                            <div className="px-6 py-4 border-b bg-slate-50">

                                <div className="flex flex-wrap gap-3">

                                    {[
                                        "Order Placed",
                                        "Processing",
                                        "Shipped",
                                        "Delivered"
                                    ].map((step) => {

                                        const completed =
                                            order.trackingTimeline?.some(
                                                (t: any) => t.status === step
                                            );

                                        return (

                                            <div
                                                key={step}
                                                className={`px-3 py-2 rounded-full text-xs font-medium ${completed
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {completed ? "✓" : "○"} {step}
                                            </div>

                                        );

                                    })}

                                </div>

                            </div>

                            {/* ITEMS */}
                            <div className="px-6 py-4 space-y-4">

                                {order.products?.map((item: any) => (


                                    <div
                                        key={item.productId}
                                        className="flex justify-between items-center"
                                    >

                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-semibold">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </p>

                                    </div>

                                ))}

                            </div>

                            {/* FOOTER */}
                            <div className="flex justify-end px-6 py-4 border-t">

                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-xl font-bold text-[#4B1E78]">
                                        ₹{order.totalAmount?.toLocaleString()}
                                    </p>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

            <Footer />

        </div>
    );
}