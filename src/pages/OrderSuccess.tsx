import { apiPath } from "../config/api";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
    ArrowRight,
    Banknote,
    CalendarDays,
    Check,
    CheckCircle2,
    ClipboardCheck,
    Copy,
    CreditCard,
    Home,
    Loader2,
    MapPin,
    Package,
    PackageCheck,
    ReceiptText,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Truck
} from "lucide-react";

export default function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    const orderId =
        location.state?.orderId ||
        localStorage.getItem("lastOrderId");

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                if (!orderId) {
                    setLoading(false);
                    return;
                }

                const res = await fetch(apiPath("/api/orders"));
                const data = await res.json();

                if (data.success) {
                    const found = (data.orders || []).find(
                        (item: any) =>
                            item._id === orderId ||
                            item.orderNumber === orderId
                    );

                    setOrder(found || null);
                }
            } catch (error) {
                console.error("Order success load error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId]);

    const paymentMethod =
        order?.paymentMethod || location.state?.paymentMethod || "COD";

    const paymentStatus =
        order?.paymentStatus || location.state?.paymentStatus || "Pending";

    const isCOD = paymentMethod === "COD";

    const isPaid =
        paymentStatus === "Paid" ||
        paymentStatus === "Completed" ||
        paymentStatus === "Success";

    const orderStatus = order?.status || "Order Placed";

    const orderNumber =
        order?.orderNumber || orderId || "Order Created";

    const totalAmount =
        order?.totalAmount ||
        order?.total ||
        location.state?.totalAmount ||
        0;

    const products =
        Array.isArray(order?.products)
            ? order.products
            : [];

    const customerAddress = useMemo(() => {
        if (!order) return "";

        const parts = [
            order.address,
            order.city,
            order.state,
            order.pincode
        ].filter(Boolean);

        return parts.join(", ");
    }, [order]);

    const copyOrderNumber = async () => {
        try {
            await navigator.clipboard.writeText(orderNumber);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };

    const paymentCard = isCOD
        ? {
            title: "Payment Pending",
            text: "Cash on Delivery",
            subText: "Payment will be collected at the time of delivery.",
            style: "bg-amber-50 border-amber-100 text-amber-700",
            icon: <Banknote size={24} />
        }
        : isPaid
            ? {
                title: "Payment Verified",
                text: "Paid Successfully",
                subText: "Your online payment has been verified.",
                style: "bg-emerald-50 border-emerald-100 text-emerald-700",
                icon: <CreditCard size={24} />
            }
            : {
                title: "Payment Review",
                text: paymentStatus || "Pending",
                subText: "Payment verification is currently pending.",
                style: "bg-rose-50 border-rose-100 text-rose-700",
                icon: <CreditCard size={24} />
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
                                <CheckCircle2 size={18} />
                                Order Confirmed
                            </span>

                            <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight tracking-tight">
                                Thank you for your order.
                            </h1>

                            <p className="mt-5 max-w-3xl text-lg leading-8 text-purple-100">
                                Your order has been placed successfully. We have received your request and will begin processing it shortly.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate("/orders")}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-[#4B1E78] transition-all hover:gap-4"
                                >
                                    View My Orders
                                    <ArrowRight size={18} />
                                </button>

                                <button
                                    onClick={() => navigate("/products")}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-6 py-3 font-black text-white transition-all hover:bg-white/20"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>

                        <div className="hidden lg:flex justify-center">
                            <div className="relative h-[330px] w-[340px] rounded-[46px] border border-white/20 bg-white/15 p-6 backdrop-blur-xl shadow-2xl">
                                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/25 blur-2xl" />

                                <div className="h-full rounded-[36px] border border-white/10 bg-white/10 flex flex-col items-center justify-center text-center">
                                    <div className="h-24 w-24 rounded-[30px] bg-white text-[#4B1E78] flex items-center justify-center shadow-xl">
                                        <CheckCircle2 size={56} />
                                    </div>

                                    <h3 className="mt-6 text-3xl font-black text-white">
                                        Confirmed
                                    </h3>

                                    <p className="mt-3 max-w-[240px] text-purple-100 leading-7">
                                        Secure order confirmation from CosmoCartt.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <section className="mt-10 rounded-[36px] bg-white border border-purple-100 p-10 shadow-sm">
                        <div className="flex items-center justify-center gap-3 text-[#4B1E78] font-black">
                            <Loader2 size={22} className="animate-spin" />
                            Loading order details...
                        </div>
                    </section>
                ) : (
                    <div className="mt-10 grid lg:grid-cols-[1fr_410px] gap-8 items-start">
                        <div className="space-y-8">
                            <section className="rounded-[36px] bg-white border border-purple-100 p-7 md:p-9 shadow-[0_20px_70px_rgba(76,29,149,0.08)]">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    <div className="flex gap-5">
                                        <div className="h-16 w-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={34} />
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-[0.22em] text-[#4B1E78] font-black">
                                                Order Reference
                                            </p>

                                            <h2 className="mt-2 text-2xl md:text-4xl font-black text-slate-950 break-all">
                                                {orderNumber}
                                            </h2>

                                            <p className="mt-2 text-slate-500 leading-7">
                                                Keep this reference number for order tracking and support.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={copyOrderNumber}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-100 bg-purple-50 px-5 py-3 font-black text-[#4B1E78] transition hover:bg-[#4B1E78] hover:text-white"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={18} />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={18} />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </section>

                            <section className="grid md:grid-cols-3 gap-5">
                                <StatusCard
                                    icon={<PackageCheck />}
                                    title="Order Status"
                                    value={orderStatus}
                                    text="Your order has entered our processing queue."
                                />

                                <StatusCard
                                    icon={<Truck />}
                                    title="Estimated Delivery"
                                    value="3–5 Business Days"
                                    text="Delivery updates will be available after dispatch."
                                />

                                <StatusCard
                                    icon={<ShieldCheck />}
                                    title="Secure Checkout"
                                    value="Protected"
                                    text="Your order details are processed securely."
                                />
                            </section>

                            <section className="rounded-[36px] bg-white border border-purple-100 p-7 md:p-9 shadow-sm">
                                <SectionTitle
                                    icon={<Truck />}
                                    title="Order Progress"
                                    text="Track the important stages of your order."
                                />

                                <div className="mt-8 space-y-6">
                                    <TimelineStep
                                        active
                                        done
                                        title="Order Placed"
                                        text="Your order has been received successfully."
                                        date="Just now"
                                    />

                                    <TimelineStep
                                        active={false}
                                        done={false}
                                        title="Processing"
                                        text="Our team will verify and prepare your products."
                                        date="Next update"
                                    />

                                    <TimelineStep
                                        active={false}
                                        done={false}
                                        title="Shipped"
                                        text="Tracking details will be available once dispatched."
                                        date="Pending"
                                    />

                                    <TimelineStep
                                        active={false}
                                        done={false}
                                        title="Delivered"
                                        text="Your order will be delivered to your selected address."
                                        date="Estimated 3–5 business days"
                                        last
                                    />
                                </div>
                            </section>

                            {products.length > 0 && (
                                <section className="rounded-[36px] bg-white border border-purple-100 p-7 md:p-9 shadow-sm">
                                    <SectionTitle
                                        icon={<ShoppingBag />}
                                        title="Items Ordered"
                                        text={`${products.length} product${products.length > 1 ? "s" : ""} included in this order.`}
                                    />

                                    <div className="mt-7 space-y-4">
                                        {products.map((item: any, index: number) => (
                                            <div
                                                key={item.productId || item._id || index}
                                                className="flex gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4"
                                            >
                                                <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#4B1E78] shrink-0">
                                                    <Package size={26} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-black text-slate-950 line-clamp-2">
                                                        {item.name || "Product"}
                                                    </h3>

                                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                                        <span>Qty: {item.quantity || 1}</span>

                                                        {item.brand && (
                                                            <span>Brand: {item.brand}</span>
                                                        )}

                                                        {item.sku && (
                                                            <span>SKU: {item.sku}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="font-black text-[#4B1E78] shrink-0">
                                                    ₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <aside className="lg:sticky lg:top-24 space-y-6">
                            <section className="rounded-[36px] bg-white border border-purple-100 p-6 shadow-[0_25px_90px_rgba(76,29,149,0.12)]">
                                <div className="flex items-center gap-4 border-b border-purple-100 pb-5">
                                    <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                                        <ReceiptText size={24} />
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-[#4B1E78] font-black">
                                            Summary
                                        </p>

                                        <h2 className="text-2xl font-black text-slate-950">
                                            Order Details
                                        </h2>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-4">
                                    <DetailRow label="Order Number" value={orderNumber} />
                                    <DetailRow label="Status" value={orderStatus} />
                                    <DetailRow label="Payment Method" value={paymentMethod} />
                                    <DetailRow
                                        label="Total Amount"
                                        value={`₹${Number(totalAmount || 0).toLocaleString()}`}
                                        strong
                                    />
                                </div>

                                <div className={`mt-6 rounded-3xl border p-5 ${paymentCard.style}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-11 w-11 rounded-2xl bg-white/70 flex items-center justify-center">
                                            {paymentCard.icon}
                                        </div>

                                        <div>
                                            <p className="text-sm font-black">
                                                {paymentCard.title}
                                            </p>

                                            <h3 className="text-lg font-black">
                                                {paymentCard.text}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm font-semibold opacity-80">
                                        {paymentCard.subText}
                                    </p>
                                </div>
                            </section>

                            {customerAddress && (
                                <section className="rounded-[36px] bg-white border border-purple-100 p-6 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="h-11 w-11 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                                            <MapPin size={22} />
                                        </div>

                                        <h3 className="text-xl font-black text-slate-950">
                                            Delivery Address
                                        </h3>
                                    </div>

                                    <p className="mt-4 text-slate-600 leading-7">
                                        {customerAddress}
                                    </p>
                                </section>
                            )}

                            <section className="rounded-[36px] bg-slate-950 p-6 text-white shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={24} className="text-purple-300" />

                                    <h3 className="text-xl font-black">
                                        What happens next?
                                    </h3>
                                </div>

                                <div className="mt-5 space-y-4">
                                    <NextStep text="You can view your order status from the orders page." />
                                    <NextStep text="Tracking details will be updated after dispatch." />
                                    <NextStep text="Support team can help using your order reference." />
                                </div>
                            </section>

                            <div className="grid gap-3">
                                <button
                                    onClick={() => navigate("/orders")}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4B1E78] px-6 py-4 font-black text-white shadow-xl transition-all hover:bg-[#6F2DBD]"
                                >
                                    View My Orders
                                    <ArrowRight size={18} />
                                </button>

                                {order?._id && (
                                    <button
                                        onClick={() => navigate(`/track-order/${order._id}`)}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-white px-6 py-4 font-black text-[#4B1E78] transition-all hover:bg-purple-50"
                                    >
                                        Track Order
                                        <Truck size={18} />
                                    </button>
                                )}

                                <button
                                    onClick={() => navigate("/products")}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-700 transition-all hover:bg-slate-50"
                                >
                                    Continue Shopping
                                    <ShoppingBag size={18} />
                                </button>
                            </div>
                        </aside>
                    </div>
                )}
            </main>

            <Footer />
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
                <p className="text-xs uppercase tracking-[0.22em] text-[#4B1E78] font-black">
                    Confirmation
                </p>

                <h2 className="mt-1 text-2xl md:text-3xl font-black text-slate-950">
                    {title}
                </h2>

                <p className="mt-2 text-slate-500 leading-7">
                    {text}
                </p>
            </div>
        </div>
    );
}

function StatusCard({
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

            <h3 className="mt-2 text-xl font-black text-slate-950">
                {value}
            </h3>

            <p className="mt-2 text-sm text-slate-500 leading-6">
                {text}
            </p>
        </div>
    );
}

function TimelineStep({
    title,
    text,
    date,
    done,
    active,
    last
}: {
    title: string;
    text: string;
    date: string;
    done: boolean;
    active: boolean;
    last?: boolean;
}) {
    return (
        <div className="relative flex gap-4">
            {!last && (
                <div className="absolute left-[22px] top-12 h-full w-px bg-purple-100" />
            )}

            <div
                className={`relative z-10 h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    done
                        ? "bg-emerald-500 text-white"
                        : active
                            ? "bg-[#4B1E78] text-white"
                            : "bg-purple-50 text-[#4B1E78]"
                }`}
            >
                {done ? <Check size={21} /> : <ClipboardCheck size={20} />}
            </div>

            <div className="flex-1 rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="font-black text-slate-950">
                        {title}
                    </h3>

                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 border border-slate-100">
                        <CalendarDays size={13} />
                        {date}
                    </span>
                </div>

                <p className="mt-2 text-sm text-slate-500 leading-6">
                    {text}
                </p>
            </div>
        </div>
    );
}

function DetailRow({
    label,
    value,
    strong
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
            <span className="text-sm font-semibold text-slate-500">
                {label}
            </span>

            <span
                className={`text-right text-sm ${
                    strong
                        ? "font-black text-[#4B1E78]"
                        : "font-black text-slate-900"
                }`}
            >
                {value || "-"}
            </span>
        </div>
    );
}

function NextStep({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Check size={14} />
            </div>

            <p className="text-sm leading-6 text-slate-300">
                {text}
            </p>
        </div>
    );
}