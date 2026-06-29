import { apiPath } from "../config/api";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    KeyRound,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
    Star,
    Eye,
    EyeOff
} from "lucide-react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState<"email" | "reset">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const requestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                apiPath("/api/customers/forgot-password"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email
                    })
                }
            );

            const data = await res.json();

            if (!data.success) {
                setError(data.message || "Could not send OTP.");
                return;
            }

            toast.success("Reset OTP sent to your email");
            setStep("reset");
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (otp.trim().length !== 6) {
            setError("Please enter the 6 digit OTP.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                apiPath("/api/customers/reset-password"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        otp,
                        newPassword
                    })
                }
            );

            const data = await res.json();

            if (!data.success) {
                setError(data.message || "Could not reset password.");
                return;
            }

            toast.success("Password reset successful");
            navigate("/login");
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(123,97,255,0.35),_transparent_30%),linear-gradient(135deg,_#f8f3ff_0%,_#efe7ff_42%,_#fcf8ff_100%)]">
            <Navbar />

            <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="relative grid w-full overflow-hidden rounded-[36px] border border-white/80 bg-white/95 shadow-[0_40px_120px_rgba(43,16,85,0.28)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="absolute -left-14 top-10 h-40 w-40 rounded-full bg-fuchsia-400/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />

                    <motion.div
                        initial={{ opacity: 0, x: -45 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.55 }}
                        className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1f0b3d] via-[#4B1E78] to-[#7c3aed] p-8 text-white lg:flex"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.24),_transparent_32%)]" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium backdrop-blur">
                                <Sparkles size={15} />
                                Secure recovery
                            </div>

                            <h2 className="mt-8 text-5xl font-black leading-[0.95]">
                                Forgot
                                <br />
                                your password?
                            </h2>

                            <p className="mt-6 max-w-md text-lg leading-8 text-purple-100">
                                Recover your CosmoCartt account using a secure email OTP.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {[
                                    "Email OTP",
                                    "Secure reset",
                                    "Account protection",
                                    "Quick recovery",
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 mt-8 rounded-[24px] border border-white/20 bg-white/12 p-4 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-white/20 p-2">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">Protected recovery</p>
                                    <p className="text-sm text-purple-100">
                                        OTP expires in 10 minutes for your account safety.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mx-auto max-w-md"
                        >
                            <div className="flex justify-center">
                                <div className="rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 p-3 shadow-lg shadow-purple-200/70">
                                    <Lock className="text-[#4B1E78]" size={24} />
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-violet-600">
                                <Star size={16} fill="currentColor" />
                                Account recovery
                            </div>

                            <h1 className="mt-4 text-center text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                Reset password
                            </h1>

                            <p className="mt-3 text-center text-base leading-7 text-slate-600 sm:text-lg">
                                {step === "email"
                                    ? "Enter your email and we'll send you a secure OTP."
                                    : "Enter the OTP and create your new password."}
                            </p>

                            {step === "email" ? (
                                <form onSubmit={requestOtp} className="mt-8 space-y-4">
                                    <div className="group relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#4B1E78]" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError("");
                                            }}
                                            placeholder="Enter your email"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100"
                                        />
                                    </div>

                                    {error && (
                                        <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                            {error}
                                        </p>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#6F2DBD] px-4 py-3.5 font-semibold text-white shadow-[0_16px_35px_rgba(75,30,120,0.25)] disabled:opacity-60"
                                    >
                                        {loading ? "Sending OTP..." : "Send OTP"}
                                        <ArrowRight size={18} />
                                    </motion.button>
                                </form>
                            ) : (
                                <form onSubmit={resetPassword} className="mt-8 space-y-4">
                                    <div className="group relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#4B1E78]" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3.5 pl-12 pr-4 text-slate-700 outline-none"
                                        />
                                    </div>

                                    <div className="group relative">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#4B1E78]" size={18} />
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => {
                                                setOtp(
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 6)
                                                );
                                                setError("");
                                            }}
                                            placeholder="Enter OTP"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100"
                                        />
                                    </div>

                                    <div className="group relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#4B1E78]" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setError("");
                                            }}
                                            placeholder="New password"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-slate-700 outline-none transition-all duration-300 focus:border-[#4B1E78] focus:bg-white focus:ring-4 focus:ring-purple-100"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {error && (
                                        <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                            {error}
                                        </p>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#6F2DBD] px-4 py-3.5 font-semibold text-white shadow-[0_16px_35px_rgba(75,30,120,0.25)] disabled:opacity-60"
                                    >
                                        {loading ? "Resetting..." : "Reset Password"}
                                        <ArrowRight size={18} />
                                    </motion.button>

                                    <button
                                        type="button"
                                        onClick={() => setStep("email")}
                                        className="w-full text-sm font-semibold text-[#4B1E78]"
                                    >
                                        Use another email
                                    </button>
                                </form>
                            )}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="mt-6 text-center"
                            >
                                <Link
                                    to="/login"
                                    className="font-semibold text-[#4B1E78] transition hover:underline"
                                >
                                    Back to login
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
