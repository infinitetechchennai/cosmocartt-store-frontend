import Navbar from "../components/Navbar";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2B1055] via-[#4B1E78] to-[#6F2DBD]">

            <Navbar />

            <div className="max-w-6xl mx-auto py-8 px-6">

                <div className="grid lg:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-2xl">

                    {/* LEFT SIDE */}

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#2B1055] to-[#6F2DBD] text-white p-10"
                    >

                        <h2 className="text-5xl font-black leading-tight">
                            Welcome
                            <br />
                            Back
                        </h2>

                        <p className="mt-6 text-lg text-gray-200">
                            Login to your CosmoCartt account and access your
                            orders, wishlist, exclusive deals and faster
                            checkout experience.
                        </p>

                        <div className="mt-10 space-y-4 text-lg">
                            <div>✓ Secure Login</div>
                            <div>✓ Track Orders</div>
                            <div>✓ Exclusive Member Deals</div>
                            <div>✓ Faster Checkout</div>
                        </div>

                    </motion.div>

                    {/* RIGHT SIDE */}

                    <div className="p-5 lg:p-8">

                        <h1 className="text-4xl font-bold text-center">
                            Welcome Back
                        </h1>

                        <p className="text-zinc-500 text-center mt-2">
                            Login to your CosmoCartt account
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mt-6 space-y-3">
                        

                            <input
                                type="text"
                                placeholder="Email or Phone Number"
                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                            />

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Password"
                                    className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>

                            </div>

                            <div className="flex justify-between items-center text-sm">

                                <label className="flex items-center gap-2">
                                    <input type="checkbox" />
                                    Remember Me
                                </label>

                                <a
                                    href="#"
                                    className="text-[#4B1E78] font-medium"
                                >
                                    Forgot Password?
                                </a>

                            </div>

                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                                login({
                                    name: "Demo User",
                                    role: "customer",
                                    customerType: "b2c"
                                })
                            }
                            className="w-full mt-6 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold shadow-lg"
                        >
                            Login
                        </motion.button>

                        <div className="relative my-6">

                            <div className="border-t"></div>

                            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-sm text-gray-400">
                                OR
                            </span>

                        </div>

                        <div className="grid grid-cols-2 gap-3">

                            <button className="border rounded-xl py-3 font-medium hover:bg-slate-50 transition">
                                Google
                            </button>

                            <button className="border rounded-xl py-3 font-medium hover:bg-slate-50 transition">
                                GitHub
                            </button>

                        </div>

                        <p className="text-center text-sm text-zinc-500 mt-5">

                            Don't have an account?

                            <a
                                href="/register"
                                className="text-[#4B1E78] ml-2 font-semibold"
                            >
                                Register
                            </a>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}