import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDisplayPrice } from "../utils/pricing";
import { API_URL } from "../config/api";

import {
    ArrowRight,
    Banknote,
    BadgeCheck,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Home,
    Loader2,
    LockKeyhole,
    Mail,
    MapPin,
    PackageCheck,
    Phone,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    Truck,
    UserRound,
    Wallet
} from "lucide-react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

type PaymentMethod = "COD" | "UPI" | "CARD";

export default function Checkout() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [pincode, setPincode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
    const [placingOrder, setPlacingOrder] = useState(false);

    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const buyNowProduct = location.state?.buyNowProduct;
    const checkoutItems = buyNowProduct ? [buyNowProduct] : cartItems;

    const states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Jammu and Kashmir",
        "Ladakh",
        "Lakshadweep",
        "Puducherry"
    ];

    const citiesByState: Record<string, string[]> = {
        "Tamil Nadu": [
            "Chennai",
            "Coimbatore",
            "Madurai",
            "Salem",
            "Trichy",
            "Tirunelveli",
            "Erode"
        ],
        Karnataka: [
            "Bengaluru",
            "Mysuru",
            "Mangalore",
            "Hubli"
        ],
        Kerala: [
            "Kochi",
            "Trivandrum",
            "Kozhikode"
        ],
        Maharashtra: [
            "Mumbai",
            "Pune",
            "Nagpur",
            "Nashik"
        ],
        Delhi: [
            "New Delhi"
        ]
    };

    const total = useMemo(() => {
        return checkoutItems.reduce(
            (sum: number, item: any) =>
                sum + getDisplayPrice(item, user) * (item.quantity || 1),
            0
        );
    }, [checkoutItems, user]);

    const shippingCharge = total >= 499 ? 0 : 50;
    const tax = 0;
    const grandTotal = total + shippingCharge + tax;
    const freeShippingRemaining = Math.max(499 - total, 0);
    const citySuggestions = citiesByState[selectedState] || [];

    const getProductImage = (item: any) => {
        const image = item.images?.[0] || item.image || "";

        if (!image) return "";

        if (
            image.startsWith("http://") ||
            image.startsWith("https://") ||
            image.startsWith("data:")
        ) {
            return image;
        }

        return `${API_URL}${image}`;
    };

    const paymentMethods: {
        id: PaymentMethod;
        title: string;
        desc: string;
        badge: string;
        icon: ReactNode;
    }[] = [
        {
            id: "COD",
            title: "Cash on Delivery",
            desc: "Pay safely when your order reaches your doorstep.",
            badge: "Popular",
            icon: <Banknote size={25} />
        },
        {
            id: "UPI",
            title: "UPI Payment",
            desc: "Pay instantly using Google Pay, PhonePe, Paytm or BHIM.",
            badge: "Instant",
            icon: <Wallet size={25} />
        },
        {
            id: "CARD",
            title: "Credit / Debit Card",
            desc: "Pay securely using Visa, Mastercard, RuPay or other cards.",
            badge: "Secure",
            icon: <CreditCard size={25} />
        }
    ];

    const handlePlaceOrder = async () => {
        if (placingOrder) return;

        setPlacingOrder(true);

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !address.trim() ||
            !city.trim() ||
            !selectedState.trim() ||
            !pincode.trim()
        ) {
            toast.error("Please fill all required fields");
            setPlacingOrder(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Enter a valid email address");
            setPlacingOrder(false);
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            toast.error("Enter a valid mobile number");
            setPlacingOrder(false);
            return;
        }

        if (!/^\d{6}$/.test(pincode)) {
            toast.error("Enter a valid pincode");
            setPlacingOrder(false);
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

        const orderData = {
            orderType: buyNowProduct?.orderType || "normal",
            customerType: currentUser?.customerType || "b2c",
            bulkOrder: buyNowProduct?.isBulkOrder || false,
            userId: currentUser._id || "guest-user",
            customerName: `${firstName} ${lastName}`,
            email,
            phone,
            address,
            city,
            state: selectedState,
            pincode,
            products: checkoutItems.map((item: any) => ({
                productId: item._id,
                name: item.name,
                image: item.images?.[0] || item.image || "",
                quantity: item.quantity || 1,
                price: getDisplayPrice(item, currentUser),
                brand: item.brand || "",
                sku: item.sku || "",
                hsnCode: item.hsnCode || "",
                gstPercentage: item.gstPercentage || 18,
                sellerId: item.sellerId || "ADMIN",
                sellerName: item.sellerName || "CosmoCartt",
                sellerGSTIN: item.sellerGSTIN || ""
            })),
            subtotal: total,
            shippingCharge,
            tax,
            totalAmount: grandTotal,
            paymentMethod,
            trackingTimeline: [
                {
                    status: "Order Placed",
                    date: new Date().toISOString()
                }
            ]
        };

        if (paymentMethod === "COD") {
            try {
                const response = await fetch(`${API_URL}/api/orders`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(orderData)
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    toast.error(data.message || "Failed to place order");
                    setPlacingOrder(false);
                    return;
                }

                localStorage.removeItem("cart");

                if (!buyNowProduct) {
                    clearCart();
                }

                toast.success("Order placed successfully");

                setTimeout(() => {
                    navigate("/order-success", {
                        state: {
                            orderId: data.order._id
                        }
                    });
                }, 800);
            } catch (error: any) {
                console.error("PLACE ORDER FETCH ERROR:", error);
                toast.error(error.message || "Server Error");
                setPlacingOrder(false);
            }

            return;
        }

        if (paymentMethod === "UPI" || paymentMethod === "CARD") {
            try {
                if (!window.Razorpay) {
                    toast.error("Payment gateway not loaded. Please refresh and try again.");
                    setPlacingOrder(false);
                    return;
                }

                const paymentResponse = await fetch(
                    `${API_URL}/api/payment/create-order`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            amount: grandTotal
                        })
                    }
                );

                const paymentData = await paymentResponse.json();

                if (!paymentData.success) {
                    toast.error("Failed to create payment");
                    setPlacingOrder(false);
                    return;
                }

                const options = {
                    key: "rzp_test_SzWOSqm0kgH1d3",
                    amount: paymentData.order.amount,
                    currency: "INR",
                    name: "CosmoCartt",
                    description: "Order Payment",
                    order_id: paymentData.order.id,

                    modal: {
                        ondismiss: function () {
                            toast.error("Payment cancelled");
                            setPlacingOrder(false);
                        }
                    },

                    handler: async function (response: any) {
                        try {
                            const verifyResponse = await fetch(
                                `${API_URL}/api/payment/verify`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(response)
                                }
                            );

                            const verifyData = await verifyResponse.json();

                            if (!verifyData.success) {
                                toast.error("Payment verification failed");
                                setPlacingOrder(false);
                                return;
                            }

                            const orderResponse = await fetch(`${API_URL}/api/orders`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    ...orderData,
                                    paymentStatus: "Paid",
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id
                                })
                            });

                            const orderResult = await orderResponse.json();

                            if (!orderResponse.ok || !orderResult.success) {
                                toast.error("Failed to save order");
                                setPlacingOrder(false);
                                return;
                            }

                            localStorage.removeItem("cart");

                            if (!buyNowProduct) {
                                clearCart();
                            }

                            toast.success("Order placed successfully");

                            navigate("/order-success", {
                                state: {
                                    orderId: orderResult.order._id
                                }
                            });
                        } catch (error) {
                            console.error(error);
                            toast.error("Verification Error");
                            setPlacingOrder(false);
                        }
                    }
                };

                const razorpay = new window.Razorpay(options);

                razorpay.on("payment.failed", function () {
                    toast.error("Payment failed. Please try again.");
                    setPlacingOrder(false);
                });

                razorpay.open();
            } catch (error) {
                console.error(error);
                toast.error("Payment Error");
                setPlacingOrder(false);
            }

            return;
        }
    };

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F7F3FF] via-white to-purple-50">
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#18072d] via-[#4B1E78] to-[#7C3AED] p-8 md:p-12 text-white shadow-[0_35px_100px_rgba(76,29,149,0.25)]">
                        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
                        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur-md">
                                    <ShoppingCart size={18} />
                                    Checkout
                                </span>

                                <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight">
                                    Your cart is empty
                                </h1>

                                <p className="mt-4 max-w-2xl text-purple-100 leading-8">
                                    Add your favorite products and return here to complete a secure CosmoCartt checkout.
                                </p>

                                <Link
                                    to="/products"
                                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-[#4B1E78] transition-all hover:gap-4"
                                >
                                    Continue Shopping
                                    <ArrowRight size={18} />
                                </Link>
                            </div>

                            <div className="hidden lg:flex h-56 w-56 rounded-[42px] border border-white/20 bg-white/15 items-center justify-center backdrop-blur-xl">
                                <ShoppingBag size={92} />
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                        <EmptyFeature icon={<Truck />} title="Fast Delivery" text="Quick doorstep delivery" />
                        <EmptyFeature icon={<ShieldCheck />} title="Secure Payments" text="Safe checkout process" />
                        <EmptyFeature icon={<RotateCcw />} title="Easy Returns" text="Hassle-free returns" />
                        <EmptyFeature icon={<BadgeCheck />} title="Genuine Products" text="Trusted quality items" />
                    </section>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F7F3FF] via-white to-purple-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#18072d] via-[#4B1E78] to-[#7C3AED] p-7 md:p-10 text-white shadow-[0_35px_100px_rgba(76,29,149,0.25)]">
                    <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
                    <div className="absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />

                    <div className="relative z-10 grid lg:grid-cols-[1.4fr_0.8fr] gap-8 items-center">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-purple-100">
                                <Link to="/" className="hover:text-white">Home</Link>
                                <ChevronRight size={15} />
                                <Link to="/cart" className="hover:text-white">Cart</Link>
                                <ChevronRight size={15} />
                                <span className="font-bold text-white">Checkout</span>
                            </div>

                            <h1 className="mt-5 text-4xl md:text-6xl font-black leading-tight">
                                Secure Checkout
                            </h1>

                            <p className="mt-4 max-w-3xl text-purple-100 text-lg leading-8">
                                Complete your order with a smooth, protected and premium CosmoCartt checkout experience.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <HeroPill icon={<LockKeyhole size={17} />} text="SSL Secure" />
                                <HeroPill icon={<Truck size={17} />} text={shippingCharge === 0 ? "Free Delivery" : "Fast Delivery"} />
                                <HeroPill icon={<PackageCheck size={17} />} text={`${checkoutItems.length} Item${checkoutItems.length > 1 ? "s" : ""}`} />
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="rounded-[34px] border border-white/20 bg-white/15 p-6 backdrop-blur-xl">
                                <p className="text-sm text-purple-100">Payable Amount</p>
                                <h2 className="mt-2 text-5xl font-black">
                                    ₹{grandTotal.toLocaleString()}
                                </h2>
                                <p className="mt-3 text-purple-100">
                                    Secure payment powered by trusted checkout.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <CheckoutProgress />

                <div className="mt-8 grid lg:grid-cols-[1fr_420px] gap-8 items-start">
                    <div className="space-y-7">
                        <section className="rounded-[34px] bg-white border border-purple-100 p-6 md:p-8 shadow-[0_20px_70px_rgba(76,29,149,0.08)]">
                            <SectionHeader
                                step="Step 1"
                                icon={<Home size={23} />}
                                title="Shipping Address"
                                text="Tell us where your order should be delivered."
                                badge="Required"
                            />

                            <div className="mt-7 grid md:grid-cols-2 gap-5">
                                <TextInput
                                    label="First Name"
                                    value={firstName}
                                    onChange={setFirstName}
                                    placeholder="Enter first name"
                                    icon={<UserRound size={18} />}
                                />

                                <TextInput
                                    label="Last Name"
                                    value={lastName}
                                    onChange={setLastName}
                                    placeholder="Enter last name"
                                    icon={<UserRound size={18} />}
                                />

                                <TextInput
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={setEmail}
                                    placeholder="example@mail.com"
                                    icon={<Mail size={18} />}
                                />

                                <TextInput
                                    label="Mobile Number"
                                    value={phone}
                                    onChange={(value) =>
                                        setPhone(value.replace(/\D/g, "").slice(0, 10))
                                    }
                                    placeholder="10 digit mobile number"
                                    icon={<Phone size={18} />}
                                    inputMode="numeric"
                                    maxLength={10}
                                />
                            </div>

                            <div className="mt-5">
                                <TextAreaInput
                                    label="Complete Address"
                                    value={address}
                                    onChange={setAddress}
                                    placeholder="House no, building, street, area, landmark"
                                />
                            </div>

                            <div className="mt-5 grid md:grid-cols-3 gap-5">
                                <SelectInput
                                    label="State"
                                    value={selectedState}
                                    onChange={(value) => {
                                        setSelectedState(value);
                                        setCity("");
                                    }}
                                    options={states}
                                    placeholder="Select State"
                                />

                                <div>
                                    <label className="text-sm font-black text-slate-700">
                                        City
                                    </label>

                                    <div className="relative mt-2">
                                        <MapPin
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            list="city-options"
                                            placeholder="Enter city"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-4 font-semibold text-slate-900 outline-none transition focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100"
                                        />

                                        <datalist id="city-options">
                                            {citySuggestions.map((cityName) => (
                                                <option key={cityName} value={cityName} />
                                            ))}
                                        </datalist>
                                    </div>
                                </div>

                                <TextInput
                                    label="Pincode"
                                    value={pincode}
                                    onChange={(value) =>
                                        setPincode(value.replace(/\D/g, "").slice(0, 6))
                                    }
                                    placeholder="6 digit pincode"
                                    inputMode="numeric"
                                    maxLength={6}
                                />
                            </div>
                        </section>

                        <section className="rounded-[34px] bg-white border border-purple-100 p-6 md:p-8 shadow-[0_20px_70px_rgba(76,29,149,0.08)]">
                            <SectionHeader
                                step="Step 2"
                                icon={<CreditCard size={23} />}
                                title="Payment Method"
                                text="Choose how you want to pay for this order."
                                badge="Secure"
                            />

                            <div className="mt-7 grid gap-4">
                                {paymentMethods.map((method) => (
                                    <PaymentCard
                                        key={method.id}
                                        method={method}
                                        selected={paymentMethod === method.id}
                                        onSelect={() => setPaymentMethod(method.id)}
                                    />
                                ))}
                            </div>
                        </section>

                       <section className="rounded-[34px] border border-purple-100 bg-white p-6 md:p-8 shadow-[0_20px_70px_rgba(76,29,149,0.08)]">
    <div className="grid sm:grid-cols-4 gap-5 divide-y sm:divide-y-0 sm:divide-x divide-purple-100">
        <TrustBox icon={<Truck />} title="Fast Delivery" text="Quick & reliable delivery" />
        <TrustBox icon={<ShieldCheck />} title="Secure Payment" text="100% safe & secure checkout" />
        <TrustBox icon={<RotateCcw />} title="Easy Returns" text="Hassle-free 7-day returns" />
        <TrustBox icon={<BadgeCheck />} title="Genuine Products" text="100% original quality items" />
    </div>
</section>
                    </div>

                    <aside className="lg:sticky lg:top-24">
                        <div className="rounded-[34px] bg-white border border-purple-100 p-6 shadow-[0_25px_90px_rgba(76,29,149,0.12)]">
                            <div className="flex items-center justify-between border-b border-purple-100 pb-5">
                                <div>
                                    <p className="text-xs font-black text-[#4B1E78] uppercase tracking-[0.22em]">
                                        Summary
                                    </p>

                                    <h2 className="text-2xl font-black text-slate-950 mt-1">
                                        Order Summary
                                    </h2>
                                </div>

                                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                                    <ShoppingBag size={24} />
                                </div>
                            </div>

                            {freeShippingRemaining > 0 ? (
                                <div className="mt-5 rounded-2xl bg-orange-50 border border-orange-100 p-4">
                                    <p className="text-sm font-bold text-orange-700">
                                        Add ₹{freeShippingRemaining.toLocaleString()} more to unlock free delivery.
                                    </p>

                                    <div className="mt-3 h-2 rounded-full bg-orange-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-orange-500"
                                            style={{
                                                width: `${Math.min((total / 499) * 100, 100)}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-emerald-600" />
                                    <p className="text-sm font-bold text-emerald-700">
                                        Free delivery unlocked for this order.
                                    </p>
                                </div>
                            )}

                            <div className="mt-6">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-black">
                                    Items
                                </p>

                                <div className="mt-4 space-y-4 max-h-[360px] overflow-y-auto pr-1">
                                    {checkoutItems.map((item: any) => {
                                        const productImage = getProductImage(item);
                                        const quantity = item.quantity || 1;
                                        const itemTotal = getDisplayPrice(item, user) * quantity;

                                        return (
                                            <div
                                                key={item._id || item.id || item.name}
                                                className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                                            >
                                                {productImage ? (
                                                    <img
                                                        src={productImage}
                                                        alt={item.name}
                                                        className="h-16 w-16 rounded-xl border border-slate-200 bg-white object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400">
                                                        <ShoppingBag size={24} />
                                                    </div>
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <p className="font-black text-sm text-slate-900 line-clamp-2">
                                                        {item.name}
                                                    </p>

                                                    <div className="mt-1 flex items-center justify-between gap-3">
                                                        <p className="text-xs font-semibold text-slate-500">
                                                            Qty: {quantity}
                                                        </p>

                                                        <p className="text-sm font-black text-[#4B1E78]">
                                                            ₹{itemTotal.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 space-y-3 border-t border-purple-100 pt-5">
                                <SummaryRow label="Subtotal" value={`₹${total.toLocaleString()}`} />
                                <SummaryRow
                                    label="Delivery"
                                    value={shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                                    highlight={shippingCharge === 0}
                                />
                                <SummaryRow label="Tax" value={`₹${tax}`} muted />
                            </div>

                            <div className="mt-5 rounded-3xl bg-gradient-to-r from-[#4B1E78] to-[#7C3AED] p-5 text-white">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-purple-100">
                                        Total Payable
                                    </span>

                                    <span className="text-3xl font-black">
                                        ₹{grandTotal.toLocaleString()}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs text-purple-100">
                                    Inclusive of all applicable charges.
                                </p>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={placingOrder}
                                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#4B1E78] via-[#6F2DBD] to-[#8B5CF6] px-6 py-4 font-black text-white shadow-lg shadow-purple-300/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-400/50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {placingOrder ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Processing Order...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                        <ArrowRight size={19} />
                                    </>
                                )}
                            </button>

                            <p className="mt-4 text-center text-xs leading-6 text-slate-400">
                                By placing this order, you agree to CosmoCartt’s terms, privacy policy and refund policy.
                            </p>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function CheckoutProgress() {
    const steps = [
        {
            title: "Address",
            text: "Delivery details"
        },
        {
            title: "Payment",
            text: "Secure method"
        },
        {
            title: "Review",
            text: "Place order"
        }
    ];

    return (
        <section className="mt-8 rounded-[28px] border border-purple-100 bg-white p-5 shadow-sm">
            <div className="grid md:grid-cols-3 gap-4">
                {steps.map((step, index) => (
                    <div
                        key={step.title}
                        className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"
                    >
                        <div
                            className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black ${
                                index === 0
                                    ? "bg-[#4B1E78] text-white"
                                    : "bg-purple-50 text-[#4B1E78]"
                            }`}
                        >
                            {index + 1}
                        </div>

                        <div>
                            <h3 className="font-black text-slate-950">
                                {step.title}
                            </h3>

                            <p className="text-sm text-slate-500">
                                {step.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function SectionHeader({
    step,
    icon,
    title,
    text,
    badge
}: {
    step: string;
    icon: ReactNode;
    title: string;
    text: string;
    badge: string;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 border-b border-purple-100 pb-6">
            <div className="flex gap-4">
                <div className="h-13 w-13 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                    {icon}
                </div>

                <div>
                    <p className="text-xs font-black text-[#4B1E78] uppercase tracking-[0.22em]">
                        {step}
                    </p>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-950 mt-1">
                        {title}
                    </h2>

                    <p className="text-slate-500 mt-2">
                        {text}
                    </p>
                </div>
            </div>

            <span className="w-fit rounded-full bg-purple-50 px-4 py-2 text-sm font-black text-[#4B1E78]">
                {badge}
            </span>
        </div>
    );
}

function TextInput({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    icon,
    inputMode,
    maxLength
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: string;
    icon?: ReactNode;
    inputMode?: "text" | "numeric" | "email" | "tel";
    maxLength?: number;
}) {
    return (
        <div>
            <label className="text-sm font-black text-slate-700">
                {label}
            </label>

            <div className="relative mt-2">
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </span>
                )}

                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    maxLength={maxLength}
                    className={`w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100 ${
                        icon ? "pl-11 pr-4" : "px-4"
                    }`}
                />
            </div>
        </div>
    );
}

function TextAreaInput({
    label,
    value,
    onChange,
    placeholder
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}) {
    return (
        <div>
            <label className="text-sm font-black text-slate-700">
                {label}
            </label>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100"
            />
        </div>
    );
}

function SelectInput({
    label,
    value,
    onChange,
    options,
    placeholder
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
}) {
    return (
        <div>
            <label className="text-sm font-black text-slate-700">
                {label}
            </label>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100"
            >
                <option value="">
                    {placeholder}
                </option>

                {options.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
}

function PaymentCard({
    method,
    selected,
    onSelect
}: {
    method: {
        id: PaymentMethod;
        title: string;
        desc: string;
        badge: string;
        icon: ReactNode;
    };
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`w-full rounded-3xl border-2 p-5 text-left transition-all ${
                selected
                    ? "border-[#4B1E78] bg-gradient-to-r from-[#4B1E78] to-[#7C3AED] text-white shadow-xl"
                    : "border-slate-200 bg-slate-50 text-slate-900 hover:border-purple-300 hover:bg-white hover:shadow-lg"
            }`}
        >
            <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                    <div
                        className={`h-14 w-14 rounded-2xl flex items-center justify-center transition ${
                            selected
                                ? "bg-white text-[#4B1E78]"
                                : "bg-purple-50 text-[#4B1E78]"
                        }`}
                    >
                        {method.icon}
                    </div>

                    <div>
                        <h3 className="text-lg font-black">
                            {method.title}
                        </h3>

                        <p
                            className={`mt-1 text-sm leading-6 ${
                                selected ? "text-purple-100" : "text-slate-500"
                            }`}
                        >
                            {method.desc}
                        </p>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                            selected
                                ? "bg-white text-[#4B1E78]"
                                : "bg-purple-50 text-[#4B1E78]"
                        }`}
                    >
                        {method.badge}
                    </span>

                    <span
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                            selected ? "border-white" : "border-slate-300"
                        }`}
                    >
                        {selected && (
                            <span className="h-3 w-3 rounded-full bg-white" />
                        )}
                    </span>
                </div>
            </div>
        </button>
    );
}

function SummaryRow({
    label,
    value,
    muted,
    highlight
}: {
    label: string;
    value: string;
    muted?: boolean;
    highlight?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between text-sm ${muted ? "text-slate-400" : "text-slate-600"}`}>
            <span className="font-semibold">{label}</span>
            <span className={`font-black ${highlight ? "text-emerald-600" : "text-slate-900"}`}>
                {value}
            </span>
        </div>
    );
}

function HeroPill({ icon, text }: { icon: ReactNode; text: string }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur-md">
            {icon}
            {text}
        </span>
    );
}

function TrustBox({
    icon,
    title,
    text
}: {
    icon: ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="p-5 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 text-[#4B1E78] flex items-center justify-center">
                {icon}
            </div>

            <h3 className="mt-5 font-black text-[#4B1E78]">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                {text}
            </p>
        </div>
    );
}

function EmptyFeature({
    icon,
    title,
    text
}: {
    icon: ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[28px] bg-white border border-purple-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="h-13 w-13 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                {icon}
            </div>

            <h3 className="mt-4 font-black text-slate-950">
                {title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
                {text}
            </p>
        </div>
    );
}