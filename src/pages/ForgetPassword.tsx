import Navbar from "../components/Navbar";

export default function ForgotPassword() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2B1055] via-[#4B1E78] to-[#6F2DBD]">

            <Navbar />

            <div className="flex justify-center items-center mt-20 px-4">

                <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">

                    <h1 className="text-3xl font-bold text-center">
                        Forgot Password
                    </h1>

                    <p className="text-center text-slate-500 mt-2">
                        Enter your email address and we'll send a reset link.
                    </p>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        className="w-full mt-6 border border-slate-200 p-3 rounded-xl focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                    />

                    <button
                        className="w-full mt-5 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold"
                    >
                        Send Reset Link
                    </button>

                </div>

            </div>

        </div>
    );
}