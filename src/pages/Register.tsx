import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Register() {

    const [accountType, setAccountType] =
        useState("personal");

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-xl mx-auto py-16 px-6">

                <div className="bg-white rounded-3xl shadow-sm p-8">

                    <h1 className="text-3xl font-bold text-center">
                        Create Account
                    </h1>

                    <p className="text-zinc-500 text-center mt-2">
                        Join Cosmocart
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-8">

                        <button
                            onClick={() =>
                                setAccountType("personal")
                            }
                            className={`py-3 rounded-xl font-semibold ${accountType === "personal"
                                ? "bg-[#4B1E78] text-white"
                                : "bg-slate-100"
                                }`}
                        >
                            Personal Account
                        </button>

                        <button
                            onClick={() =>
                                setAccountType("business")
                            }
                            className={`py-3 rounded-xl font-semibold ${accountType === "business"
                                ? "bg-[#4B1E78] text-white"
                                : "bg-slate-100"
                                }`}
                        >
                            Business Account
                        </button>

                    </div>
                    <div className="mt-8">

                        {accountType === "personal" && (

                            <div className="space-y-4">

                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full border p-3 rounded-xl"
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full border p-3 rounded-xl"
                                />

                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="w-full border p-3 rounded-xl"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full border p-3 rounded-xl"
                                />

                            </div>

                        )}





                        {accountType === "business" && (

                            <div className="space-y-4">

                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    className="w-full border p-3 rounded-xl"
                                />

                                <input
                                    type="text"
                                    placeholder="Contact Person"
                                    className="w-full border p-3 rounded-xl"
                                />

                                <input
                                    type="email"
                                    placeholder="Business Email"
                                    className="w-full border p-3 rounded-xl"
                                />

                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="w-full border p-3 rounded-xl"
                                />

                                <input
                                    type="text"
                                    placeholder="GST Number"
                                    className="w-full border p-3 rounded-xl"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full border p-3 rounded-xl"
                                />

                            </div>

                        )}


                        <button
                            className="w-full mt-6 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold"
                        >
                            Create Account
                        </button>

                    </div>

                </div>

            </div>

            <Footer />

        </div>

    );
}