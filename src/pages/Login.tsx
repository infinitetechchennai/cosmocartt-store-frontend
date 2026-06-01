import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-md mx-auto py-20 px-6">

                <div className="bg-white rounded-3xl shadow-sm p-8">

                    <h1 className="text-3xl font-bold text-center">
                        Welcome Back
                    </h1>

                    <p className="text-zinc-500 text-center mt-2">
                        Login to your account
                    </p>

                    <div className="mt-8 space-y-4">

                        <input
                            type="text"
                            placeholder="Email or Phone Number"
                            className="w-full border p-3 rounded-xl"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border p-3 rounded-xl"
                        />

                    </div>

                    <button
                        onClick={() =>
                            login({
                                name: "Demo User",
                                role: "customer",
                                customerType: "b2c"
                            })
                        }
                        className="w-full mt-6 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold"
                    >
                        Login
</button>

                    <p className="text-center text-sm text-zinc-500 mt-6">

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

            <Footer />

        </div>
    );
}