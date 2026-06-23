import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Orders() {

    const { user } = useAuth();

    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const cancelOrder = async (
        orderId: string
    ) => {

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/orders/cancel/${orderId}`,
                    {
                        method: "PUT",
                    }
                );

            const data =
                await response.json();

            if (!data.success) {

                alert(
                    data.message
                );

                return;
            }

            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId
                        ? data.order
                        : o
                )
            );

            setSelectedOrder(
                data.order
            );

        } catch (err) {

            console.error(err);

        }

    };

    const requestRefund = async (
        orderId: string
    ) => {

        const reason =
            prompt(
                "Reason for refund?"
            );

        if (!reason) return;

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/orders/${orderId}/request-refund`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            reason
                        })
                    }
                );

            const data =
                await response.json();

            if (!data.success) {

                alert(
                    data.message
                );

                return;

            }

            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId
                        ? {
                            ...order,
                            refundStatus:
                                "Requested"
                        }
                        : order
                )
            );

            alert(
                "Refund requested successfully"
            );

        } catch (err) {

            console.error(err);

        }

    };

    useEffect(() => {
        fetch(
            `http://localhost:5000/api/orders/user/${user?._id}`
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setOrders(data.orders);
                }
            })
            .catch((err) => console.error(err));
    }, [user]);

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
                                    <p className="text-xl font-bold">
                                        ₹{order.totalAmount?.toLocaleString()}
                                    </p>
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="mt-3 px-4 py-2 text-sm bg-[#4B1E78] text-white rounded hover:opacity-90"
                                    >
                                        View Details
                                    </button>

                                    <Link
                                        to={`/track-order/${order._id}`}
                                        className="block mt-2 text-sm text-[#4B1E78] font-medium"
                                    >
                                        Track Order
                                    </Link>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

            {/* ORDER DETAILS MODAL */}

            {selectedOrder && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold">
                                Order Details
                </h2>

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="
        w-10
        h-10
        rounded-full
        bg-slate-100
        hover:bg-slate-200
        text-xl
        transition
    "
                            >
                                ×
</button>

                        </div>

                        <div className="space-y-3 mb-6">

                            <p>
                                <strong>Order ID:</strong>
                                {" "}
                                {selectedOrder.orderNumber}
                            </p>

                            <p>
                                <strong>Status:</strong>
                                {" "}
                                {selectedOrder.status}
                            </p>

                            <p>
                                <strong>Payment Status:</strong>
                                {" "}
                                {selectedOrder.paymentStatus}
                            </p>

                            <p>
                                <strong>Payment Method:</strong>
                                {" "}
                                {selectedOrder.paymentMethod}
                            </p>

                            <p>
                                <strong>Order Date:</strong>
                                {" "}
                                {new Date(
                                    selectedOrder.createdAt
                                ).toLocaleString()}
                            </p>

                            <p>
                                <strong>Customer:</strong>
                                {" "}
                                {selectedOrder.customerName}
                            </p>

                            <p>
                                <strong>Phone:</strong>
                                {" "}
                                {selectedOrder.phone}
                            </p>

                            <p>
                                <strong>Delivery Address:</strong>
                                {" "}
                                {selectedOrder.address},
        {" "}
                                {selectedOrder.city},
        {" "}
                                {selectedOrder.state}
                                {" - "}
                                {selectedOrder.pincode}
                            </p>

                            <p>
                                <strong>
                                    Refund Status:
    </strong>
                                {" "}
                                {
                                    selectedOrder.refundStatus
                                    ||
                                    "Not Requested"
                                }
                            </p>

                        </div>

                        <div className="border-t pt-4">

                            <h3 className="font-semibold mb-3">
                                Products
                </h3>

                            {selectedOrder.products?.map((item: any) => (

                                <div
                                    key={item.productId}
                                    className="flex justify-between items-center py-3 border-b"
                                >

                                    <div>

                                        <p className="font-medium">
                                            {item.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            ₹{item.price.toLocaleString()}
                                                each
                                                    </p>

                                    </div>

                                    <span className="font-semibold">
                                        ₹{(
                                            item.price *
                                            item.quantity
                                        ).toLocaleString()}
                                    </span>

                                </div>




                            ))}

                        </div>



                        <div className="border-t mt-8 pt-6">

                            <div className="space-y-3">

                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>
                                        ₹{selectedOrder.subtotal?.toLocaleString() || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>
                                        ₹{selectedOrder.shippingCharge?.toLocaleString() || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>
                                        ₹{selectedOrder.tax?.toLocaleString() || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between border-t pt-4 mt-4">

                                    <span className="text-xl font-bold">
                                        Grand Total
            </span>

                                    <span className="text-2xl font-black text-[#4B1E78]">
                                        ₹{selectedOrder.totalAmount?.toLocaleString()}
                                    </span>

                                </div>

                            </div>

                            {(selectedOrder.status === "Order Placed" ||
                                selectedOrder.status === "Processing") && (

                                    <button
                                        onClick={() =>
                                            cancelOrder(selectedOrder._id)
                                        }
                                        className="
                mt-6
                w-full
                py-3
                rounded-xl
                bg-red-600
                hover:bg-red-700
                text-white
                font-semibold
                transition
            "
                                    >
                                        Cancel Order
                                    </button>

                                )}


                            {
                                selectedOrder.status === "Delivered"

                                &&

                                selectedOrder.refundStatus !==
                                "Requested"

                                && (

                                    <div className="mt-6">

                                        <button
                                            onClick={() =>
                                                requestRefund(
                                                    selectedOrder._id
                                                )
                                            }
                                            className="
                    w-full
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    py-3
                    rounded-xl
                    font-medium
                "
                                        >
                                            Request Refund
            </button>

                                    </div>

                                )
                            }



                        </div>



                    </div>




                </div>



            )
            }

            <Footer />

        </div >
    );
}