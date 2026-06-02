import Navbar from "../components/Navbar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const [accountType, setAccountType] = useState("personal");
    const [showSuccess, setShowSuccess] = useState(false);


    const navigate = useNavigate();

    const handleRegister = () => {
        setShowSuccess(true);

setTimeout(() => {
    navigate("/login");
}, 2000);

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2B1055] via-[#4B1E78] to-[#6F2DBD]">


        <Navbar />

        <AnimatePresence>
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <div className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-sm w-full mx-4">
                        <div className="text-6xl mb-4">✅</div>

                        <h2 className="text-3xl font-bold text-green-600">
                            Account Created
                        </h2>

                        <p className="text-slate-600 mt-3">
                            Your CosmoCartt account has been created successfully.
                        </p>

                        <p className="text-sm text-slate-400 mt-3">
                            Redirecting to Login...
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        <div className="max-w-6xl mx-auto py-8 px-6">


                <div className="grid lg:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-2xl">

                    {/* LEFT SIDE */}

                    <motion.div
                        key={accountType}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#2B1055] to-[#6F2DBD] text-white p-10"
                    >

                        {accountType === "personal" ? (
                            <>
                                <h2 className="text-5xl font-black leading-tight">
                                    Join
                                    <br />
                                    COSMOCARTT
                                </h2>

                                <p className="mt-6 text-lg text-gray-200">
                                    Create your CosmoCartt account and unlock
                                    exclusive deals, faster checkout, order
                                    tracking and business pricing.
                                </p>

                                <div className="mt-10 space-y-4 text-lg">
                                    <div>✓ Secure Shopping</div>
                                    <div>✓ Exclusive Discounts</div>
                                    <div>✓ Fast Delivery</div>
                                    <div>✓ Business Accounts</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-5xl font-black leading-tight">
                                    Business
                                    <br />
                                    Partner
                                </h2>

                                <p className="mt-6 text-lg text-gray-200">
                                    Partner with CosmoCartt and gain access to
                                    wholesale pricing, bulk purchasing,
                                    dedicated account support and streamlined
                                    procurement solutions designed for growing
                                    businesses.
                                </p>

                                <div className="mt-10 space-y-4 text-lg">
                                    <div>✓ Bulk Order Discounts</div>
                                    <div>✓ GST Enabled Invoicing</div>
                                    <div>✓ Dedicated Account Manager</div>
                                    <div>✓ Priority Order Processing</div>
                                </div>
                            </>
                        )}

                    </motion.div>

                    {/* RIGHT SIDE */}

                    <div className="p-6 lg:p-8">

                        <h1 className="text-4xl font-bold text-center">
                            Create Account
                        </h1>

                        <p className="text-zinc-500 text-center mt-2">
                            Join CosmoCartt
                        </p>

                        {/* Animated Toggle */}

                        <div className="relative grid grid-cols-2 bg-slate-100 rounded-2xl p-1 mt-6">

                            <motion.div
                                layout
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 35,
                                }}
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-[#4B1E78] ${
                                    accountType === "personal"
                                        ? "left-1"
                                        : "left-[calc(50%+2px)]"
                                }`}
                            />

                            <button
                                onClick={() => setAccountType("personal")}
                                className={`relative z-10 py-3 rounded-xl font-semibold transition ${
                                    accountType === "personal"
                                        ? "text-white"
                                        : "text-slate-700"
                                }`}
                            >
                                Personal Account
                            </button>

                            <button
                                onClick={() => setAccountType("business")}
                                className={`relative z-10 py-3 rounded-xl font-semibold transition ${
                                    accountType === "business"
                                        ? "text-white"
                                        : "text-slate-700"
                                }`}
                            >
                                Business Account
                            </button>

                        </div>

                        <div className="mt-5">

                            <AnimatePresence mode="wait">

                                {accountType === "personal" && (

                                    <motion.div
                                        key="personal"
                                        initial={{ opacity: 0, y: 25 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -25 }}
                                        transition={{ duration: 0.35 }}
                                        className="space-y-3"
                                    >

                                        <div className="grid grid-cols-2 gap-3">

                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Phone Number"
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                        </div>

                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                        />

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                        />

                                    </motion.div>

                                )}

                                {accountType === "business" && (

                                    <motion.div
                                        key="business"
                                        initial={{ opacity: 0, y: 25 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -25 }}
                                        transition={{ duration: 0.35 }}
                                        className="space-y-3"
                                    >

                                        <div className="grid grid-cols-2 gap-3">

                                            <input
                                                type="text"
                                                placeholder="Company Name"
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Contact Person"
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                        </div>

                                        <div className="grid grid-cols-2 gap-3">

                                            <input
                                                type="email"
                                                placeholder="Business Email"
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Phone Number"
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                        </div>

                                        <input
                                            type="text"
                                            placeholder="GST Number"
                                            className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                        />

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                        />

                                    </motion.div>

                                )}

                            </AnimatePresence>

                            <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={handleRegister}
    className="w-full mt-4 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold shadow-lg"
>
    Create Account
</motion.button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}