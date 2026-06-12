import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2B1055] via-[#4B1E78] to-[#6F2DBD]">

            <Navbar />

            <div className="max-w-6xl mx-auto py-12 px-6">

                <div className="grid lg:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-2xl">

                    {/* LEFT SIDE */}

                    <div
                        className="
                        hidden lg:flex
                        flex-col
                        justify-center
                        bg-gradient-to-br
                        from-[#2B1055]
                        to-[#6F2DBD]
                        text-white
                        p-10
                        "
                    >
                        <h2 className="text-5xl font-black leading-tight">
                            Forgot
                            <br />
                            Password
                        </h2>

                        <p className="mt-6 text-lg text-gray-200">
                            Reset your password securely and regain access
                            to your CosmoCartt account.
                        </p>

                        <div className="mt-10 space-y-4 text-lg">
                            <div>✓ Secure Verification</div>
                            <div>✓ Email Recovery</div>
                            <div>✓ Account Protection</div>
                            <div>✓ Quick Password Reset</div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}

                    <div className="p-8 lg:p-10">

                        <h1 className="text-5xl font-black text-center tracking-tight">
                            Reset Password
                        </h1>

                        <p className="text-zinc-500 text-center mt-2">
                            Enter your email and verification code.
                        </p>

                        <div className="mt-6">

                            <label className="block font-semibold text-slate-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                            />

                        </div>

                        <div className="mt-6">

                            <label className="block font-semibold text-slate-700 mb-2">
                                Verification Code
                            </label>

                            <input
                                type="text"
                                placeholder="Enter verification code"
                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                            />

                        </div>

                        <button
                            className="w-full mt-6 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-[#3b1660] transition"
                        >
                            Send Reset Link
                        </button>

                        <div className="mt-6 text-center">

                            <Link
                                to="/login"
                                className="text-[#4B1E78] font-semibold hover:underline"
                            >
                                Back to Login
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}