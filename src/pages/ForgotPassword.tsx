import Navbar from "../components/Navbar";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    KeyRound,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
    Star,
} from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
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

        if (!code.trim()) {
            setError("Please enter the verification code.");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1000);
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
                        <div className="absolute inset-0 bg-[linear-gradient(125deg,_transparent_0%,_rgba(255,255,255,0.08)_45%,_transparent_100%)]" />

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
                                Recover access to your CosmoCartt account with a smooth, secure, and lightning-fast reset experience.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {[
                                    "Secure verification",
                                    "Email recovery",
                                    "Account protection",
                                    "Quick reset",
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
                                        Your details stay private and encrypted throughout recovery.
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
                                Trusted by shoppers worldwide
                            </div>

                            <h1 className="mt-4 text-center text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                Reset password
                            </h1>

                            <p className="mt-3 text-center text-base leading-7 text-slate-600 sm:text-lg">
                                Enter your email and the one-time code we sent to restore access in minutes.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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

                                <div className="group relative">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#4B1E78]" size={18} />
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                            setError("");
                                        }}
                                        placeholder="Enter verification code"
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
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#6F2DBD] px-4 py-3.5 font-semibold text-white shadow-[0_16px_35px_rgba(75,30,120,0.25)] transition hover:shadow-[0_20px_40px_rgba(75,30,120,0.35)]"
                                >
                                    {loading ? "Sending..." : "Send reset link"}
                                    <ArrowRight size={18} />
                                </motion.button>
                            </form>

                            <AnimatePresence>
                                {submitted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={18} />
                                            Recovery request received. Check your inbox for the next step.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

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