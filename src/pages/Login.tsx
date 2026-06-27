import { apiPath } from "../config/api";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const validateForm = () => {
        const newErrors = {
            email: "",
            password: ""
        };

        let valid = true;

        if (!email.trim()) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {
            newErrors.email = "Please enter a valid email address";
            valid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    return (
        <div className="min-h-screen bg-[#EDE7F6]">
            <Navbar />

            <div className="max-w-6xl mx-auto py-8 px-6">
                <div className="grid lg:grid-cols-2 overflow-hidden rounded-3xl bg-[#FCFAFF] shadow-2xl">
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
                            <div>✓ Email Verification</div>
                            <div>✓ Track Orders</div>
                            <div>✓ Faster Checkout</div>
                        </div>
                    </motion.div>

                    <div className="p-8 lg:p-10">
                        <h1 className="text-5xl font-black text-center tracking-tight">
                            Welcome Back
                        </h1>

                        <p className="text-zinc-500 text-center mt-2">
                            Login to your CosmoCartt account
                        </p>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();

                                if (!validateForm()) {
                                    return;
                                }

                                try {
                                    setLoading(true);

                                    const response = await fetch(
                                        apiPath("/api/customers/login"),
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                email,
                                                password
                                            })
                                        }
                                    );

                                    const data = await response.json();

                                    if (!data.success) {
                                        setErrors({
                                            email: "",
                                            password:
                                                data.message ||
                                                "Incorrect email or password"
                                        });

                                        return;
                                    }

                                    toast.success("Login Successful 🎉");
                                    login(data.customer);
                                    navigate("/");
                                } catch (error) {
                                    console.error(error);
                                    toast.error("Login failed");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="mt-6 space-y-3"
                            >
                                <div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);

                                            setErrors((prev) => ({
                                                ...prev,
                                                email: ""
                                            }));
                                        }}
                                        placeholder="Email"
                                        className={`w-full p-3 rounded-xl transition-all duration-300 outline-none ${
                                            errors.email
                                                ? "border border-red-500"
                                                : "border border-slate-200 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100"
                                        }`}
                                    />

                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);

                                                setErrors((prev) => ({
                                                    ...prev,
                                                    password: ""
                                                }));
                                            }}
                                            placeholder="Password"
                                            className={`w-full p-3 rounded-xl transition-all duration-300 outline-none ${
                                                errors.password
                                                    ? "border border-red-500"
                                                    : "border border-slate-200 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100"
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" />
                                        Remember Me
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-[#4B1E78] font-medium hover:underline"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full mt-6 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-60"
                            >
                                {loading ? "Logging In..." : "Login"}
                            </motion.button>

                            <p className="text-center text-sm text-zinc-500 mt-5">
                                Don't have an account?
                                <Link
                                    to="/register"
                                    className="text-[#4B1E78] ml-2 font-semibold"
                                >
                                    Register
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
