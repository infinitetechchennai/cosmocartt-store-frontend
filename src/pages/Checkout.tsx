import { useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Checkout() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [loading, setLoading] = useState(false);

    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

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
        (sum, item) =>
            sum +
            item.retailPrice * item.quantity,
        0
    );

    const handlePlaceOrder = async () => {

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !address.trim() ||
            !city.trim() ||
            !state.trim() ||
            !pincode.trim()
        ) {
            alert("Please fill all required fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Enter a valid email address");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            alert("Enter a valid mobile number");
            return;
        }

        if (!/^\d{6}$/.test(pincode)) {
            alert("Enter a valid pincode");
            return;
        }

        const user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        console.log("USER:", user);

        const orderData = {
            userId: user._id || "guest-user",

            customerName: `${firstName} ${lastName}`,

            email,

            phone,

            address,

            city,

            state,

            pincode,

            products: cartItems.map((item: any) => ({
                productId: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.retailPrice,
            })),

            subtotal: total,

            totalAmount: total + 300,

            paymentMethod: "COD",

            trackingTimeline: [
                {
                    status: "Order Placed",
                    date: new Date().toISOString(),
                },
            ],
        };

        try {

            console.log("ORDER DATA:", orderData);

            const response = await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                }
            );

            const data = await response.json();

            console.log("ORDER RESPONSE:", data);

            if (!response.ok || !data.success) {
                alert(data.message || "Failed to place order");
                return;
            }

            localStorage.removeItem("cart");

            navigate("/order-success", {
                state: {
                    orderId: data.order._id,
                },
            });

            clearCart();

        } catch (error: any) {

            console.error("PLACE ORDER FETCH ERROR:", error);

            alert(error.message || "Server Error");

        }
    };

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

        "Karnataka": [
            "Bengaluru",
            "Mysuru",
            "Mangalore",
            "Hubli"
        ],

        "Kerala": [
            "Kochi",
            "Trivandrum",
            "Kozhikode"
        ],

        "Maharashtra": [
            "Mumbai",
            "Pune",
            "Nagpur",
            "Nashik"
        ],

        "Delhi": [
            "New Delhi"
        ]
    };



    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold mb-8">
                    Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* CUSTOMER FORM */}

                    <div className="lg:col-span-2 space-y-6">

                        {/* ADDRESS SECTION */}
                        <div className="bg-white rounded-2xl p-6 border">

                            <h2 className="text-xl font-semibold mb-5">
                                Shipping Address
    </h2>

                            <div className="grid md:grid-cols-2 gap-4">

                                <div>
                                    <label className="text-sm text-gray-600">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full border p-3 rounded-xl mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full border p-3 rounded-xl mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border p-3 rounded-xl mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">Phone</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full border p-3 rounded-xl mt-1"
                                    />
                                </div>

                            </div>

                            <div className="mt-4">
                                <label className="text-sm text-gray-600">Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border p-3 rounded-xl mt-1 h-24"
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mt-4">

                                <div>
                                    <label className="text-sm text-gray-600">City</label>
                                    <select
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full border p-3 rounded-xl mt-1"
                                        disabled={!state}
                                    >
                                        <option value="">
                                            Select City
  </option>

                                        {(citiesByState[state] || []).map((cityName) => (
                                            <option
                                                key={cityName}
                                                value={cityName}
                                            >
                                                {cityName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">State</label>
                                    <select
                                        value={state}
                                        onChange={(e) => {
                                            setState(e.target.value);
                                            setCity("");
                                        }}
                                        className="w-full border p-3 rounded-xl mt-1"
                                    >
                                        <option value="">
                                            Select State
  </option>

                                        {states.map((item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">Pincode</label>
                                    <input
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        className="w-full border p-3 rounded-xl mt-1"
                                    />
                                </div>

                            </div>

                        </div>

                        {/* PAYMENT SECTION */}
                        <div className="bg-white rounded-2xl p-6 border">

                            <h2 className="text-xl font-semibold mb-5">
                                Payment Method
    </h2>

                            <div className="space-y-3">

                                <label className="flex items-center gap-3 border p-3 rounded-xl cursor-pointer">
                                    <input type="radio" name="payment" defaultChecked />
                                    <span>Cash on Delivery</span>
                                </label>

                                <label className="flex items-center gap-3 border p-3 rounded-xl cursor-pointer">
                                    <input type="radio" name="payment" />
                                    <span>UPI Payment</span>
                                </label>

                                <label className="flex items-center gap-3 border p-3 rounded-xl cursor-pointer">
                                    <input type="radio" name="payment" />
                                    <span>Credit / Debit Card</span>
                                </label>

                            </div>

                        </div>

                    </div>

                    {/* ORDER SUMMARY */}

                    <div className="bg-white rounded-2xl p-6 h-fit border space-y-5 sticky top-24">

                        <h2 className="text-xl font-semibold">
                            Order Summary
  </h2>

                        {/* ITEMS */}
                        <p className="text-xs uppercase text-gray-400 tracking-wider">
                            Items
</p>

                        <div className="space-y-3">
                            {cartItems.map((item: any) => (

                                <div
                                    key={item.id}
                                    className="flex gap-4 items-center hover:bg-slate-50 p-2 rounded-lg transition"
                                >

                                    {/* IMAGE */}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-14 h-14 object-cover rounded-lg border"
                                    />

                                    {/* DETAILS */}
                                    <div className="flex-1">

                                        <p className="text-sm font-medium text-gray-800">
                                            {item.name}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Qty: {item.quantity}
                                        </p>

                                    </div>

                                    {/* PRICE */}
                                    <p className="text-sm font-semibold min-w-[90px] text-right">
                                        ₹{(item.retailPrice * item.quantity).toLocaleString()}
                                    </p>

                                </div>

                            ))}
                        </div>

                        <hr />

                        {/* PRICE BREAKDOWN */}
                        <div className="space-y-2 text-sm">

                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-gray-500">
                                <span>Delivery</span>
                                <span>₹100</span>
                            </div>

                            <div className="flex justify-between text-gray-500">
                                <span>Tax</span>
                                <span>₹200</span>
                            </div>

                        </div>

                        <hr />

                        {/* TOTAL */}
                        <div className="flex justify-between text-2xl font-bold text-[#4B1E78]">
                            <span>Total</span>
                            <span>₹{(total + 300).toLocaleString()}</span>
                        </div>

                        {/* TRUST INFO */}


                        <div className="text-sm text-gray-600 space-y-1">

                            <p>🚚 Delivery in 3-5 business days</p>
                            <p>🔁 Easy 7-day returns</p>
                            <p>🔒 100% secure payment</p>

                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-[#4B1E78] hover:bg-[#3a155d] transition text-white py-3 rounded-xl font-semibold"
                        >
                            Place Order
  </button>

                        <p className="text-xs text-center text-gray-400 mt-2">
                            By placing this order, you agree to our terms and conditions
</p>

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
}