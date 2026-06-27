import { apiPath } from "../config/api";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerifyOtp() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState(
        searchParams.get("email") || ""
    );

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const verifyOtp = async () => {
        if (!email.trim()) {
            toast.error("Email is required");
            return;
        }

        if (otp.trim().length !== 6) {
            toast.error("Enter valid 6 digit OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                apiPath("/api/customers/verify-otp"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        otp
                    })
                }
            );

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "OTP verification failed");
                return;
            }

            toast.success("Email verified successfully");
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        if (!email.trim()) {
            toast.error("Email is required");
            return;
        }

        try {
            setResending(true);

            const res = await fetch(
                apiPath("/api/customers/resend-otp"),
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
                toast.error(data.message || "Could not resend OTP");
                return;
            }

            toast.success("OTP resent to your email");
        } catch (error) {
            console.error(error);
            toast.error("Could not resend OTP");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#EEE8FF]">
            <Navbar />

            <div className="max-w-xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 text-[#4B1E78] flex items-center justify-center mx-auto text-3xl font-black">
                            OTP
                        </div>

                        <h1 className="text-4xl font-black mt-5 text-zinc-900">
                            Verify Email
                        </h1>

                        <p className="text-zinc-500 mt-2">
                            Enter the 6 digit code sent to your email.
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-zinc-700">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 p-3 rounded-xl border border-slate-200 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-zinc-700">
                                OTP Code
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6)
                                    )
                                }
                                className="w-full mt-2 p-4 rounded-xl border border-slate-200 text-center text-3xl tracking-[10px] font-black focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                placeholder="000000"
                            />
                        </div>

                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="w-full bg-[#4B1E78] text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-60"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            onClick={resendOtp}
                            disabled={resending}
                            className="w-full border border-purple-200 text-[#4B1E78] py-3 rounded-xl font-semibold disabled:opacity-60"
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>

                        <p className="text-center text-sm text-zinc-500">
                            Already verified?
                            <Link
                                to="/login"
                                className="ml-2 text-[#4B1E78] font-semibold"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
