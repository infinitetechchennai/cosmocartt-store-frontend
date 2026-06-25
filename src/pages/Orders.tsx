import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
    Package,
    Truck,
    CreditCard,
    Banknote,
    X,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

export default function Orders() {
    const { user } = useAuth();

    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<any>(null);

    const [refundModalOrder, setRefundModalOrder] = useState<any>(null);
    const [exchangeModalOrder, setExchangeModalOrder] = useState<any>(null);
    const [reason, setReason] = useState("");

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value || 0);

    const loadOrders = async () => {
        try {
            setLoading(true);

            if (!user?._id) {
                setOrders([]);
                return;
            }

            const res = await fetch(
                `http://localhost:5000/api/orders/user/${user._id}`
            );

            const data = await res.json();

            if (data.success) {
                setOrders(data.orders || []);
            } else {
                setMessage({
                    type: "error",
                    title: "Orders Failed",
                    text: data.message || "Could not load your orders."
                });
            }
        } catch (error) {
            console.error(error);

            setMessage({
                type: "error",
                title: "Orders Failed",
                text: "Something went wrong while loading orders."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [user?._id]);

    const cancelOrder = async (orderId: string) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/orders/cancel/${orderId}`,
                {
                    method: "PUT"
                }
            );

            const data = await response.json();

            if (!data.success) {
                setMessage({
                    type: "error",
                    title: "Cancel Failed",
                    text: data.message || "Could not cancel this order."
                });

                return;
            }

            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId
                        ? data.order
                        : o
                )
            );

            setSelectedOrder(data.order);

            setMessage({
                type: "success",
                title: "Order Cancelled",
                text: "Your order has been cancelled successfully."
            });
        } catch (error) {
            console.error(error);

            setMessage({
                type: "error",
                title: "Cancel Failed",
                text: "Something went wrong while cancelling this order."
            });
        }
    };

    const requestRefund = async () => {
        if (!refundModalOrder || !reason.trim()) {
            setMessage({
                type: "warning",
                title: "Reason Required",
                text: "Please enter a reason for refund."
            });

            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/orders/${refundModalOrder._id}/request-refund`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        reason
                    })
                }
            );

            const data = await response.json();

            if (!data.success) {
                setMessage({
                    type: "error",
                    title: "Refund Failed",
                    text: data.message || "Could not request refund."
                });

                return;
            }

            await loadOrders();

            setRefundModalOrder(null);
            setReason("");

            setMessage({
                type: "success",
                title: "Refund Requested",
                text: "Your refund request was submitted successfully."
            });
        } catch (error) {
            console.error(error);

            setMessage({
                type: "error",
                title: "Refund Failed",
                text: "Something went wrong while requesting refund."
            });
        }
    };

    const requestExchange = async () => {
        if (!exchangeModalOrder || !reason.trim()) {
            setMessage({
                type: "warning",
                title: "Reason Required",
                text: "Please enter a reason for exchange."
            });

            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/orders/${exchangeModalOrder._id}/request-exchange`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        reason
                    })
                }
            );

            const data = await response.json();

            if (!data.success) {
                setMessage({
                    type: "error",
                    title: "Exchange Failed",
                    text: data.message || "Could not request exchange."
                });

                return;
            }

            await loadOrders();

            setExchangeModalOrder(null);
            setReason("");

            setMessage({
                type: "success",
                title: "Exchange Requested",
                text: "Your exchange request was submitted successfully."
            });
        } catch (error) {
            console.error(error);

            setMessage({
                type: "error",
                title: "Exchange Failed",
                text: "Something went wrong while requesting exchange."
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                {message && (
                    <div
                        className={`mb-6 border rounded-2xl p-4 flex items-start gap-3 ${message.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : message.type === "warning"
                                ? "bg-amber-50 border-amber-200 text-amber-800"
                                : "bg-red-50 border-red-200 text-red-800"
                            }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 mt-0.5" />
                        )}

                        <div className="flex-1">
                            <h3 className="font-bold text-sm">
                                {message.title}
                            </h3>
                            <p className="text-sm opacity-80 mt-1">
                                {message.text}
                            </p>
                        </div>

                        <button onClick={() => setMessage(null)}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <h1 className="text-4xl font-black text-zinc-950 mb-8">
                    My Orders
        </h1>

                {loading && (
                    <div className="bg-white border border-zinc-100 rounded-3xl p-12 text-center text-zinc-500">
                        Loading your orders...
                    </div>
                )}

                {!loading && orders.length === 0 && (
                    <div className="bg-white border border-zinc-100 rounded-3xl p-16 text-center">
                        <Package className="w-14 h-14 mx-auto text-zinc-300" />
                        <h2 className="text-2xl font-black mt-4">
                            No orders yet
            </h2>
                        <p className="text-zinc-500 mt-2">
                            Start shopping to place your first order.
            </p>
                        <Link
                            to="/products"
                            className="inline-flex mt-6 bg-[#4B1E78] text-white px-6 py-3 rounded-2xl font-bold"
                        >
                            Browse Products
            </Link>
                    </div>
                )}

                <div className="space-y-6">
                    {!loading &&
                        orders.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                formatCurrency={formatCurrency}
                                onView={() => setSelectedOrder(order)}
                            />
                        ))}
                </div>
            </div>

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    formatCurrency={formatCurrency}
                    onClose={() => setSelectedOrder(null)}
                    onCancel={() => cancelOrder(selectedOrder._id)}
                    onRefund={() => {
                        setRefundModalOrder(selectedOrder);
                        setReason("");
                    }}
                    onExchange={() => {
                        setExchangeModalOrder(selectedOrder);
                        setReason("");
                    }}
                />
            )}

            {refundModalOrder && (
                <ReasonModal
                    title="Request Refund"
                    description="Tell us why you want to request a refund for this order."
                    reason={reason}
                    setReason={setReason}
                    onClose={() => {
                        setRefundModalOrder(null);
                        setReason("");
                    }}
                    onSubmit={requestRefund}
                    submitText="Submit Refund Request"
                />
            )}

            {exchangeModalOrder && (
                <ReasonModal
                    title="Request Exchange"
                    description="Tell us why you want to request an exchange or replacement."
                    reason={reason}
                    setReason={setReason}
                    onClose={() => {
                        setExchangeModalOrder(null);
                        setReason("");
                    }}
                    onSubmit={requestExchange}
                    submitText="Submit Exchange Request"
                />
            )}

            <Footer />
        </div>
    );
}

function OrderCard({
    order,
    formatCurrency,
    onView
}: any) {
    return (
        <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b bg-slate-50">
                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400 font-bold">
                        Order Reference
          </p>
                    <p className="font-black text-zinc-950 mt-1">
                        {order.orderNumber || order._id}
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                        {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "-"}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <StatusBadge status={order.status} />
                    <PaymentBadge order={order} />
                </div>
            </div>

            <div className="px-6 py-5 border-b">
                <div className="flex flex-wrap gap-3">
                    {["Order Placed", "Processing", "Shipped", "Delivered"].map(
                        (step) => {
                            const completed =
                                order.status === step ||
                                order.trackingTimeline?.some(
                                    (t: any) => t.status === step
                                );

                            return (
                                <span
                                    key={step}
                                    className={`px-3 py-2 rounded-full text-xs font-bold ${completed
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-zinc-100 text-zinc-500"
                                        }`}
                                >
                                    {completed ? "✓" : "○"} {step}
                                </span>
                            );
                        }
                    )}
                </div>
            </div>

            <div className="px-6 py-5 space-y-4">
                {order.products?.slice(0, 3).map((item: any) => (
                    <div
                        key={item._id || item.productId}
                        className="flex justify-between gap-4"
                    >
                        <div>
                            <p className="font-bold text-zinc-800">
                                {item.name}
                            </p>
                            <p className="text-sm text-zinc-500">
                                Qty: {item.quantity}
                            </p>
                        </div>

                        <p className="font-black">
                            {formatCurrency(order.totalAmount)}
                        </p>
                    </div>
                ))}

                {order.products?.length > 3 && (
                    <p className="text-sm text-zinc-400">
                        + {order.products.length - 3} more items
                    </p>
                )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-t">
                <div>
                    <p className="text-sm text-zinc-500">
                        Total Amount
          </p>
                    <p className="text-2xl font-black text-[#4B1E78]">
                        {formatCurrency(order.totalAmount)}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onView}
                        className="px-5 py-3 rounded-2xl bg-[#4B1E78] text-white text-sm font-bold"
                    >
                        View Details
          </button>

                    <Link
                        to={`/track-order/${order._id}`}
                        className="px-5 py-3 rounded-2xl border border-purple-200 text-[#4B1E78] bg-white text-sm font-bold"
                    >
                        Track Order
          </Link>
                </div>
            </div>
        </div>
    );
}

function OrderDetailsModal({
    order,
    formatCurrency,
    onClose,
    onCancel,
    onRefund,
    onExchange
}: any) {
    const canCancel =
        order.status === "Order Placed" ||
        order.status === "Processing";

    const canRequestRefund =
        order.status === "Delivered" &&
        order.refundStatus === "Not Requested";

    const canRequestExchange =
        order.status === "Delivered" &&
        order.exchangeStatus === "Not Requested";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black">
                            Order Details
            </h2>
                        <p className="text-sm text-zinc-500 mt-1">
                            {order.orderNumber || order._id}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-xl"
                    >
                        ×
          </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <InfoCard label="Order Status" value={order.status} />
                    <InfoCard
                        label="Payment Method"
                        value={order.paymentMethod}
                    />
                    <InfoCard
                        label="Payment Status"
                        value={
                            order.paymentMethod === "COD"
                                ? "COD Pending"
                                : order.paymentStatus
                        }
                    />
                    <InfoCard
                        label="Shipping Status"
                        value={order.shippingStatus || "-"}
                    />
                    <InfoCard
                        label="Courier"
                        value={order.courierName || "-"}
                    />
                    <InfoCard
                        label="AWB Code"
                        value={order.awbCode || "-"}
                    />
                </div>

                {order.trackingUrl && (
                    <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex mb-6 bg-[#4B1E78] text-white px-5 py-3 rounded-2xl font-bold"
                    >
                        Open Courier Tracking
                    </a>
                )}

                <div className="bg-slate-50 border border-zinc-100 rounded-2xl p-5 mb-6">
                    <h3 className="font-black mb-3">
                        Delivery Address
          </h3>
                    <p className="text-zinc-600 leading-7">
                        {order.customerName}
                        <br />
                        {order.phone}
                        <br />
                        {order.address}, {order.city}, {order.state} - {order.pincode}
                    </p>
                </div>

                <div className="border rounded-2xl overflow-hidden">
                    {order.products?.map((item: any) => (
                        <div
                            key={item._id || item.productId}
                            className="flex justify-between items-center p-4 border-b last:border-b-0"
                        >
                            <div>
                                <p className="font-bold">
                                    {item.name}
                                </p>
                                <p className="text-sm text-zinc-500">
                                    Qty: {item.quantity} • {formatCurrency(item.price)} each
                </p>
                            </div>

                            <p className="font-black">
                                {formatCurrency(item.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 bg-slate-50 rounded-2xl p-5">
                    <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
                    <SummaryRow label="Shipping" value={formatCurrency(order.shippingCharge)} />
                    <SummaryRow label="Tax" value={formatCurrency(order.tax)} />
                    <div className="border-t mt-4 pt-4 flex justify-between">
                        <span className="text-xl font-black">Grand Total</span>
                        <span className="text-2xl font-black text-[#4B1E78]">
                            {formatCurrency(order.totalAmount)}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <InfoCard
                        label="Refund Status"
                        value={order.refundStatus || "Not Requested"}
                    />
                    <InfoCard
                        label="Exchange Status"
                        value={order.exchangeStatus || "Not Requested"}
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-6">
                    {canCancel && (
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold"
                        >
                            Cancel Order
                        </button>
                    )}

                    {canRequestRefund && (
                        <button
                            onClick={onRefund}
                            className="flex-1 py-3 rounded-2xl bg-red-50 text-red-700 border border-red-100 font-bold"
                        >
                            Request Refund
                        </button>
                    )}

                    {canRequestExchange && (
                        <button
                            onClick={onExchange}
                            className="flex-1 py-3 rounded-2xl bg-purple-50 text-[#4B1E78] border border-purple-100 font-bold"
                        >
                            Request Exchange
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function ReasonModal({
    title,
    description,
    reason,
    setReason,
    onClose,
    onSubmit,
    submitText
}: any) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">
                <h2 className="text-xl font-black text-zinc-950">
                    {title}
                </h2>

                <p className="text-sm text-zinc-500 mt-2">
                    {description}
                </p>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="mt-5 w-full border border-zinc-200 rounded-2xl px-4 py-3 min-h-[130px] outline-none focus:border-[#4B1E78]"
                />

                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-2xl border font-bold"
                    >
                        Cancel
          </button>

                    <button
                        onClick={onSubmit}
                        className="px-5 py-3 rounded-2xl bg-[#4B1E78] text-white font-bold"
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </div>
    );
}

function PaymentBadge({ order }: any) {
    const isCOD = order.paymentMethod === "COD";
    const isPaid =
        order.paymentStatus === "Paid" ||
        order.paymentStatus === "Completed" ||
        order.paymentStatus === "Success";

    if (isCOD) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold">
                <Banknote className="w-3.5 h-3.5" />
        COD Pending
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${isPaid
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-red-50 text-red-700 border-red-100"
                }`}
        >
            <CreditCard className="w-3.5 h-3.5" />
            {isPaid ? "Paid" : order.paymentStatus || "Pending"}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const cls =
        status === "Delivered"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : status === "Shipped"
                ? "bg-blue-50 text-blue-700 border-blue-100"
                : status === "Cancelled"
                    ? "bg-red-50 text-red-700 border-red-100"
                    : "bg-amber-50 text-amber-700 border-amber-100";

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cls}`}
        >
            <Truck className="w-3.5 h-3.5" />
            {status}
        </span>
    );
}

function InfoCard({ label, value }: any) {
    return (
        <div className="bg-slate-50 border border-zinc-100 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400 font-black">
                {label}
            </p>
            <p className="font-bold text-zinc-800 mt-2">
                {value || "-"}
            </p>
        </div>
    );
}

function SummaryRow({ label, value }: any) {
    return (
        <div className="flex justify-between text-zinc-600 mb-2">
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}