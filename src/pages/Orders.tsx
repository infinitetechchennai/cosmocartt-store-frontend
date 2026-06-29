import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import {
    AlertCircle,
    ArrowRight,
    Banknote,
    CalendarDays,
    CheckCircle2,
    Clock,
    CreditCard,
    Eye,
    Loader2,
    MapPin,
    Package,
    PackageCheck,
    ReceiptText,
    RefreshCcw,
    RotateCcw,
    Search,
    ShieldCheck,
    ShoppingBag,
    Truck,
    X
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
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value || 0);

    const loadOrders = async () => {
        try {
            setLoading(true);

            if (!user?._id) {
                setOrders([]);
                return;
            }

            const res = await fetch(`${API_URL}/api/orders/user/${user._id}`);
            const data = await res.json();

            if (data.success) {
                setOrders(data.orders || []);
            } else {
                setMessage({
                    type: "error",
                    title: "Orders Failed",
                    text: data.message || "Could not load your orders.",
                });
            }
        } catch (error) {
            console.error(error);
            setMessage({
                type: "error",
                title: "Orders Failed",
                text: "Something went wrong while loading orders.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [user?._id]);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const query = search.toLowerCase();

            const matchesSearch =
                !query ||
                String(order.orderNumber || order._id || "")
                    .toLowerCase()
                    .includes(query) ||
                order.products?.some((item: any) =>
                    String(item.name || "").toLowerCase().includes(query)
                );

            const matchesStatus =
                statusFilter === "All" ||
                order.status === statusFilter ||
                order.paymentStatus === statusFilter ||
                order.refundStatus === statusFilter ||
                order.exchangeStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    const stats = useMemo(() => {
        const active = orders.filter(
            (order) => !["Delivered", "Cancelled"].includes(order.status)
        ).length;

        const delivered = orders.filter(
            (order) => order.status === "Delivered"
        ).length;

        const spent = orders.reduce(
            (sum, order) => sum + Number(order.totalAmount || 0),
            0
        );

        return {
            total: orders.length,
            active,
            delivered,
            spent,
        };
    }, [orders]);

    const cancelOrder = async (orderId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/orders/cancel/${orderId}`, {
                method: "PUT",
            });

            const data = await response.json();

            if (!data.success) {
                setMessage({
                    type: "error",
                    title: "Cancel Failed",
                    text: data.message || "Could not cancel this order.",
                });
                return;
            }

            setOrders((prev) =>
                prev.map((o) => (o._id === orderId ? data.order : o))
            );

            setSelectedOrder(data.order);

            setMessage({
                type: "success",
                title: "Order Cancelled",
                text: "Your order has been cancelled successfully.",
            });
        } catch (error) {
            console.error(error);
            setMessage({
                type: "error",
                title: "Cancel Failed",
                text: "Something went wrong while cancelling this order.",
            });
        }
    };

    const requestRefund = async () => {
        if (!refundModalOrder || !reason.trim()) {
            setMessage({
                type: "warning",
                title: "Reason Required",
                text: "Please enter a reason for refund.",
            });
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/orders/${refundModalOrder._id}/request-refund`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reason }),
                }
            );

            const data = await response.json();

            if (!data.success) {
                setMessage({
                    type: "error",
                    title: "Refund Failed",
                    text: data.message || "Could not request refund.",
                });
                return;
            }

            await loadOrders();
            setRefundModalOrder(null);
            setReason("");

            setMessage({
                type: "success",
                title: "Refund Requested",
                text: "Your refund request was submitted successfully.",
            });
        } catch (error) {
            console.error(error);
            setMessage({
                type: "error",
                title: "Refund Failed",
                text: "Something went wrong while requesting refund.",
            });
        }
    };

    const requestExchange = async () => {
        if (!exchangeModalOrder || !reason.trim()) {
            setMessage({
                type: "warning",
                title: "Reason Required",
                text: "Please enter a reason for exchange.",
            });
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/orders/${exchangeModalOrder._id}/request-exchange`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reason }),
                }
            );

            const data = await response.json();

            if (!data.success) {
                setMessage({
                    type: "error",
                    title: "Exchange Failed",
                    text: data.message || "Could not request exchange.",
                });
                return;
            }

            await loadOrders();
            setExchangeModalOrder(null);
            setReason("");

            setMessage({
                type: "success",
                title: "Exchange Requested",
                text: "Your exchange request was submitted successfully.",
            });
        } catch (error) {
            console.error(error);
            setMessage({
                type: "error",
                title: "Exchange Failed",
                text: "Something went wrong while requesting exchange.",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F7F3FF] via-white to-purple-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <section className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-[#18072d] via-[#4B1E78] to-[#7C3AED] p-7 md:p-12 text-white shadow-[0_35px_100px_rgba(76,29,149,0.28)]">
                    <div className="absolute -top-28 -right-20 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
                    <div className="absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl" />

                    <div className="relative z-10 grid lg:grid-cols-[1.35fr_0.85fr] gap-10 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur-md">
                                <PackageCheck size={18} />
                                My Orders
                            </span>

                            <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight tracking-tight">
                                Track and manage every order.
                            </h1>

                            <p className="mt-5 max-w-3xl text-lg leading-8 text-purple-100">
                                View your order history, payment status, delivery progress,
                                refund requests and exchange updates in one clean dashboard.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-[#4B1E78] transition-all hover:gap-4"
                                >
                                    Continue Shopping
                                    <ArrowRight size={18} />
                                </Link>

                                <button
                                    onClick={loadOrders}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-6 py-3 font-black text-white transition-all hover:bg-white/20"
                                >
                                    Refresh Orders
                                    <RefreshCcw size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="rounded-[36px] border border-white/20 bg-white/15 p-6 backdrop-blur-xl shadow-2xl">
                                <div className="grid grid-cols-2 gap-4">
                                    <HeroStat label="Total Orders" value={stats.total} />
                                    <HeroStat label="Active" value={stats.active} />
                                    <HeroStat label="Delivered" value={stats.delivered} />
                                    <HeroStat label="Spent" value={formatCurrency(stats.spent)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {message && (
                    <MessageToast
                        message={message}
                        onClose={() => setMessage(null)}
                    />
                )}

                <section className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <DashboardStat
                        icon={<ShoppingBag />}
                        title="Total Orders"
                        value={String(stats.total)}
                        text="All purchases"
                    />

                    <DashboardStat
                        icon={<Truck />}
                        title="Active Orders"
                        value={String(stats.active)}
                        text="In progress"
                    />

                    <DashboardStat
                        icon={<CheckCircle2 />}
                        title="Delivered"
                        value={String(stats.delivered)}
                        text="Completed"
                    />

                    <DashboardStat
                        icon={<ReceiptText />}
                        title="Total Spent"
                        value={formatCurrency(stats.spent)}
                        text="Order value"
                    />
                </section>

                <section className="mt-8 rounded-[34px] bg-white border border-purple-100 p-5 md:p-6 shadow-sm">
                    <div className="grid lg:grid-cols-[1fr_260px] gap-4">
                        <div className="relative">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by order ID or product name..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 font-semibold text-slate-900 outline-none transition focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold text-slate-700 outline-none transition focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100"
                        >
                            <option value="All">All Orders</option>
                            <option value="Order Placed">Order Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Payment Pending</option>
                        </select>
                    </div>
                </section>

                {loading && (
                    <section className="mt-8 rounded-[36px] bg-white border border-purple-100 p-10 shadow-sm">
                        <div className="flex items-center justify-center gap-3 text-[#4B1E78] font-black">
                            <Loader2 size={22} className="animate-spin" />
                            Loading your orders...
                        </div>
                    </section>
                )}

                {!loading && orders.length === 0 && <EmptyOrders />}

                {!loading && orders.length > 0 && filteredOrders.length === 0 && (
                    <section className="mt-8 rounded-[36px] bg-white border border-purple-100 p-12 text-center shadow-sm">
                        <Search className="w-14 h-14 mx-auto text-slate-300" />

                        <h2 className="text-3xl font-black text-slate-950 mt-5">
                            No matching orders
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Try changing your search or filter.
                        </p>
                    </section>
                )}

                <section className="mt-8 space-y-6">
                    {!loading &&
                        filteredOrders.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                formatCurrency={formatCurrency}
                                onView={() => setSelectedOrder(order)}
                            />
                        ))}
                </section>
            </main>

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
                    type="refund"
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
                    type="exchange"
                />
            )}

            <Footer />
        </div>
    );
}

function OrderCard({ order, formatCurrency, onView }: any) {
    const products = order.products || [];
    const firstProducts = products.slice(0, 3);

    return (
        <article className="overflow-hidden rounded-[36px] bg-white border border-purple-100 shadow-[0_20px_70px_rgba(76,29,149,0.08)] hover:shadow-[0_25px_90px_rgba(76,29,149,0.14)] transition-all">
            <div className="bg-gradient-to-r from-slate-950 via-[#2B1055] to-[#4B1E78] px-6 md:px-8 py-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-purple-200 font-black">
                            Order Reference
                        </p>

                        <h2 className="mt-2 text-xl md:text-2xl font-black break-all">
                            {order.orderNumber || order._id}
                        </h2>

                        <p className="mt-2 text-sm text-purple-100 flex items-center gap-2">
                            <CalendarDays size={15} />
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
            </div>

            <div className="px-6 md:px-8 py-6 border-b border-purple-100">
                <OrderTimeline order={order} />
            </div>

            <div className="px-6 md:px-8 py-6">
                <div className="grid lg:grid-cols-[1fr_240px] gap-6 items-start">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-black mb-4">
                            Products
                        </p>

                        <div className="space-y-3">
                            {firstProducts.map((item: any, index: number) => (
                                <ProductMiniRow
                                    key={item._id || item.productId || index}
                                    item={item}
                                    formatCurrency={formatCurrency}
                                />
                            ))}

                            {products.length > 3 && (
                                <p className="text-sm font-bold text-slate-400">
                                    + {products.length - 3} more item
                                    {products.length - 3 > 1 ? "s" : ""}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-purple-50 border border-purple-100 p-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#4B1E78] font-black">
                            Total Amount
                        </p>

                        <p className="mt-2 text-3xl font-black text-[#4B1E78]">
                            {formatCurrency(order.totalAmount)}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            {products.length} item{products.length !== 1 ? "s" : ""} in this order
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 md:px-8 py-5 border-t border-purple-100 bg-slate-50">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <ShieldCheck size={18} className="text-[#4B1E78]" />

                    <span className="font-semibold">
                        Secure order support available for this purchase.
                    </span>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onView}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#4B1E78] px-5 py-3 text-sm font-black text-white transition hover:bg-[#6F2DBD]"
                    >
                        View Details
                        <Eye size={17} />
                    </button>

                    <Link
                        to={`/track-order/${order._id}`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-purple-200 bg-white px-5 py-3 text-sm font-black text-[#4B1E78] transition hover:bg-purple-50"
                    >
                        Track Order
                        <Truck size={17} />
                    </Link>
                </div>
            </div>
        </article>
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
        (order.refundStatus === "Not Requested" || !order.refundStatus);

    const canRequestExchange =
        order.status === "Delivered" &&
        (order.exchangeStatus === "Not Requested" || !order.exchangeStatus);

    const address = [
        order.address,
        order.city,
        order.state,
        order.pincode
    ].filter(Boolean).join(", ");

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-[36px] bg-white shadow-2xl">
                <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-950 via-[#2B1055] to-[#4B1E78] px-6 md:px-8 py-6 text-white">
                    <div className="flex items-start justify-between gap-5">
                        <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-purple-200 font-black">
                                Order Details
                            </p>

                            <h2 className="mt-2 text-2xl md:text-3xl font-black break-all">
                                {order.orderNumber || order._id}
                            </h2>

                            <p className="mt-2 text-sm text-purple-100">
                                Full order information, payment, address and support actions.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="h-11 w-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="grid md:grid-cols-3 gap-5">
                        <InfoCard label="Order Status" value={order.status} />
                        <InfoCard label="Payment Method" value={order.paymentMethod} />
                        <InfoCard
                            label="Payment Status"
                            value={order.paymentMethod === "COD" ? "COD Pending" : order.paymentStatus}
                        />
                        <InfoCard label="Shipping Status" value={order.shippingStatus || "-"} />
                        <InfoCard label="Courier" value={order.courierName || "-"} />
                        <InfoCard label="AWB Code" value={order.awbCode || "-"} />
                    </div>

                    {order.trackingUrl && (
                        <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#4B1E78] px-5 py-3 font-black text-white transition hover:bg-[#6F2DBD]"
                        >
                            Open Courier Tracking
                            <ArrowRight size={17} />
                        </a>
                    )}

                    <div className="mt-7 grid lg:grid-cols-[1fr_360px] gap-7">
                        <div className="space-y-7">
                            <section className="rounded-[32px] border border-purple-100 bg-white p-6 shadow-sm">
                                <SectionTitle
                                    icon={<Truck />}
                                    title="Tracking Timeline"
                                    text="Latest progress updates for your order."
                                />

                                <div className="mt-6">
                                    <OrderTimeline order={order} large />
                                </div>
                            </section>

                            <section className="rounded-[32px] border border-purple-100 bg-white p-6 shadow-sm">
                                <SectionTitle
                                    icon={<ShoppingBag />}
                                    title="Products Ordered"
                                    text={`${order.products?.length || 0} product${order.products?.length !== 1 ? "s" : ""} included.`}
                                />

                                <div className="mt-6 divide-y divide-slate-100 rounded-3xl border border-slate-100 overflow-hidden">
                                    {order.products?.map((item: any, index: number) => (
                                        <div
                                            key={item._id || item.productId || index}
                                            className="flex items-center justify-between gap-5 bg-slate-50 p-5"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#4B1E78] shrink-0">
                                                    <Package size={26} />
                                                </div>

                                                <div>
                                                    <p className="font-black text-slate-950">
                                                        {item.name}
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Qty: {item.quantity} • {formatCurrency(item.price)} each
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="font-black text-[#4B1E78]">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <aside className="space-y-6">
                            <section className="rounded-[32px] border border-purple-100 bg-purple-50 p-6">
                                <SectionTitle
                                    icon={<MapPin />}
                                    title="Delivery Address"
                                    text="Shipping destination selected for this order."
                                />

                                <p className="mt-5 text-slate-700 leading-7 font-semibold">
                                    {order.customerName}
                                    <br />
                                    {order.phone}
                                    <br />
                                    {address || "-"}
                                </p>
                            </section>

                            <section className="rounded-[32px] border border-purple-100 bg-white p-6 shadow-sm">
                                <SectionTitle
                                    icon={<ReceiptText />}
                                    title="Payment Summary"
                                    text="Complete price breakdown."
                                />

                                <div className="mt-6 space-y-3">
                                    <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
                                    <SummaryRow label="Shipping" value={formatCurrency(order.shippingCharge)} />
                                    <SummaryRow label="Tax" value={formatCurrency(order.tax)} />

                                    <div className="border-t border-slate-100 pt-4 flex justify-between">
                                        <span className="text-xl font-black text-slate-950">
                                            Grand Total
                                        </span>

                                        <span className="text-2xl font-black text-[#4B1E78]">
                                            {formatCurrency(order.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-[32px] border border-purple-100 bg-white p-6 shadow-sm">
                                <div className="grid gap-4">
                                    <InfoCard label="Refund Status" value={order.refundStatus || "Not Requested"} />
                                    <InfoCard label="Exchange Status" value={order.exchangeStatus || "Not Requested"} />
                                </div>
                            </section>
                        </aside>
                    </div>

                    <div className="mt-7 flex flex-col md:flex-row gap-3">
                        {canCancel && (
                            <button
                                onClick={onCancel}
                                className="flex-1 rounded-2xl bg-red-600 py-4 font-black text-white transition hover:bg-red-700"
                            >
                                Cancel Order
                            </button>
                        )}

                        {canRequestRefund && (
                            <button
                                onClick={onRefund}
                                className="flex-1 rounded-2xl border border-red-100 bg-red-50 py-4 font-black text-red-700 transition hover:bg-red-100"
                            >
                                Request Refund
                            </button>
                        )}

                        {canRequestExchange && (
                            <button
                                onClick={onExchange}
                                className="flex-1 rounded-2xl border border-purple-100 bg-purple-50 py-4 font-black text-[#4B1E78] transition hover:bg-purple-100"
                            >
                                Request Exchange
                            </button>
                        )}
                    </div>
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
    submitText,
    type
}: any) {
    const isRefund = type === "refund";

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[34px] bg-white p-6 md:p-8 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div
                            className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                                isRefund
                                    ? "bg-red-50 text-red-600"
                                    : "bg-purple-50 text-[#4B1E78]"
                            }`}
                        >
                            {isRefund ? <RotateCcw size={28} /> : <RefreshCcw size={28} />}
                        </div>

                        <h2 className="mt-5 text-2xl font-black text-slate-950">
                            {title}
                        </h2>

                        <p className="mt-2 text-slate-500 leading-7">
                            {description}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                    >
                        <X size={20} />
                    </button>
                </div>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter your reason..."
                    className="mt-6 w-full min-h-[140px] resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100"
                />

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSubmit}
                        className={`rounded-2xl px-5 py-3 font-black text-white transition ${
                            isRefund
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-[#4B1E78] hover:bg-[#6F2DBD]"
                        }`}
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </div>
    );
}

function OrderTimeline({ order, large }: any) {
    const steps = ["Order Placed", "Processing", "Shipped", "Delivered"];
    const currentIndex = getOrderStepIndex(order);

    if (order.status === "Cancelled") {
        return (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-5 flex items-center gap-4 text-red-700">
                <AlertCircle size={24} />

                <div>
                    <p className="font-black">Order Cancelled</p>
                    <p className="text-sm opacity-80">
                        This order has been cancelled.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={large ? "grid gap-4" : "grid grid-cols-2 md:grid-cols-4 gap-3"}>
            {steps.map((step, index) => {
                const completed =
                    index <= currentIndex ||
                    order.trackingTimeline?.some((item: any) => item.status === step);

                return (
                    <div
                        key={step}
                        className={`rounded-2xl border p-4 ${
                            completed
                                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                : "border-slate-100 bg-slate-50 text-slate-400"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                                    completed
                                        ? "bg-emerald-500 text-white"
                                        : "bg-white text-slate-400"
                                }`}
                            >
                                {completed ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                            </div>

                            <div>
                                <p className="text-sm font-black">
                                    {step}
                                </p>

                                {large && (
                                    <p className="text-xs mt-1 opacity-80">
                                        {completed ? "Completed" : "Pending update"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ProductMiniRow({ item, formatCurrency }: any) {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 1);

    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#4B1E78] shrink-0">
                    <Package size={24} />
                </div>

                <div className="min-w-0">
                    <p className="font-black text-slate-900 truncate">
                        {item.name}
                    </p>

                    <p className="text-sm text-slate-500">
                        Qty: {qty}
                    </p>
                </div>
            </div>

            <p className="font-black text-slate-900 shrink-0">
                {formatCurrency(price * qty)}
            </p>
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
                <Banknote className="w-3.5 h-3.5" />
                COD Pending
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${
                isPaid
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
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
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : status === "Shipped"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : status === "Cancelled"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-amber-50 text-amber-700 border-amber-200";

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${cls}`}>
            <Truck className="w-3.5 h-3.5" />
            {status || "Order Placed"}
        </span>
    );
}

function getOrderStepIndex(order: any) {
    const status = order.status || "Order Placed";

    if (status === "Delivered") return 3;
    if (status === "Shipped") return 2;
    if (status === "Processing") return 1;
    return 0;
}

function MessageToast({ message, onClose }: any) {
    const isSuccess = message.type === "success";
    const isWarning = message.type === "warning";

    return (
        <div
            className={`mt-8 rounded-3xl border p-5 flex items-start gap-4 shadow-sm ${
                isSuccess
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : isWarning
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-red-50 border-red-200 text-red-800"
            }`}
        >
            {isSuccess ? (
                <CheckCircle2 className="w-6 h-6 mt-0.5" />
            ) : (
                <AlertCircle className="w-6 h-6 mt-0.5" />
            )}

            <div className="flex-1">
                <h3 className="font-black">
                    {message.title}
                </h3>

                <p className="text-sm opacity-80 mt-1">
                    {message.text}
                </p>
            </div>

            <button onClick={onClose}>
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}

function EmptyOrders() {
    return (
        <section className="mt-8 rounded-[42px] bg-white border border-purple-100 p-10 md:p-16 text-center shadow-[0_20px_70px_rgba(76,29,149,0.08)]">
            <div className="mx-auto h-24 w-24 rounded-[30px] bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                <Package size={52} />
            </div>

            <h2 className="mt-7 text-3xl md:text-4xl font-black text-slate-950">
                No orders yet
            </h2>

            <p className="mt-3 max-w-xl mx-auto text-slate-500 leading-7">
                Once you place an order, you can track delivery status, payment updates,
                refunds and exchanges here.
            </p>

            <Link
                to="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#4B1E78] px-7 py-4 font-black text-white transition hover:bg-[#6F2DBD]"
            >
                Browse Products
                <ArrowRight size={18} />
            </Link>
        </section>
    );
}

function HeroStat({ label, value }: { label: string; value: any }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-purple-200 font-black">
                {label}
            </p>

            <p className="mt-2 text-2xl font-black text-white">
                {value}
            </p>
        </div>
    );
}

function DashboardStat({
    icon,
    title,
    value,
    text
}: {
    icon: ReactNode;
    title: string;
    value: string;
    text: string;
}) {
    return (
        <div className="rounded-[30px] bg-white border border-purple-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                {icon}
            </div>

            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-400 font-black">
                {title}
            </p>

            <h3 className="mt-2 text-2xl font-black text-slate-950">
                {value}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
                {text}
            </p>
        </div>
    );
}

function SectionTitle({
    icon,
    title,
    text
}: {
    icon: ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="flex gap-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center shrink-0">
                {icon}
            </div>

            <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-950">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-slate-500 leading-6">
                    {text}
                </p>
            </div>
        </div>
    );
}

function InfoCard({ label, value }: any) {
    return (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400 font-black">
                {label}
            </p>

            <p className="mt-2 font-black text-slate-900 break-words">
                {value || "-"}
            </p>
        </div>
    );
}

function SummaryRow({ label, value }: any) {
    return (
        <div className="flex justify-between gap-4 text-slate-600">
            <span className="font-semibold">
                {label}
            </span>

            <span className="font-black text-slate-900">
                {value}
            </span>
        </div>
    );
}