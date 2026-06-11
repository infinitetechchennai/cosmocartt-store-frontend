import Navbar from "../components/Navbar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";


export default function Register() {
    const [accountType, setAccountType] = useState("personal");
    const [showSuccess, setShowSuccess] = useState(false);

    const [loading, setLoading] = useState(false);

    // B2C

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    // B2B

    const [businessName, setBusinessName] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [gstNumber, setGstNumber] = useState("");


    const navigate = useNavigate();
    const checkPasswordStrength = (password: string) => {

        if (password.length <= 3) {

            setPasswordStrength("Weak");

        }
        else if (password.length >= 10 && /\d/.test(password)) {

            setPasswordStrength("Strong");

        }
        else {

            setPasswordStrength("Medium");

        }

    };
    const validateForm = () => {

        const newErrors = {
            name: "",
            email: "",
            phone: "",
            password: "",
        };

        let valid = true;

        if (!name.trim()) {
            newErrors.name = "Full Name is required";
            valid = false;
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {
            newErrors.email = "Please enter a valid email address";
            valid = false;
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone number is required";
            valid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
            valid = false;
        }

        setErrors(newErrors);

        return valid;
    };

    const handleRegister = async () => {

        if (!validateForm()) {
            return;
        }
        if (!acceptedTerms) {
            alert("Please accept Terms & Conditions");
            return;
        }
        try {

            setLoading(true);

            const payload =
                accountType === "personal"
                    ? {
                        name,
                        email,
                        phone,
                        password,
                        customerType: "b2c"
                    }
                    : {
                        name: contactPerson,
                        email,
                        phone,
                        password,

                        customerType: "b2b",

                        businessName,
                        contactPerson,
                        gstNumber
                    };

            const response = await fetch(
                "http://localhost:5000/api/customers/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            setShowSuccess(true);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {

            console.error(error);

            alert("Registration failed");

        } finally {

            setLoading(false);

        }

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
            <div className="max-w-6xl mx-auto py-2 px-6">


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

                    <div className="p-5 lg:p-6">

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
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-[#4B1E78] ${accountType === "personal"
                                    ? "left-1"
                                    : "left-[calc(50%+2px)]"
                                    }`}
                            />

                            <button
                                onClick={() => setAccountType("personal")}
                                className={`relative z-10 py-3 rounded-xl font-semibold transition ${accountType === "personal"
                                    ? "text-white"
                                    : "text-slate-700"
                                    }`}
                            >
                                Personal Account
                            </button>

                            <button
                                onClick={() => setAccountType("business")}
                                className={`relative z-10 py-3 rounded-xl font-semibold transition ${accountType === "business"
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

                                            <div>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Full Name"
                                                    className={`w-full p-3 rounded-xl outline-none transition-all duration-300 ${errors.name
                                                        ? "border border-red-500"
                                                        : "border border-slate-200 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100"
                                                        }`}
                                                />

                                                {errors.name && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="Phone Number"
                                                    className={`w-full p-3 rounded-xl outline-none transition-all duration-300 ${errors.phone
                                                        ? "border border-red-500"
                                                        : "border border-slate-200 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100"
                                                        }`}
                                                />

                                                {errors.phone && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>

                                        </div>

                                        <div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email"
                                                className={`w-full p-3 rounded-xl outline-none transition-all duration-300 ${errors.email
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
                                        <div className="relative">

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    checkPasswordStrength(e.target.value);
                                                }}
                                                placeholder="Password"
                                                className="w-full border border-slate-200 p-3 pr-12 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>

                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                        {password && (
                                            <div className="mt-2">

                                                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">

                                                    <div
                                                        className={`h-full transition-all duration-300 ${passwordStrength === "Weak"
                                                            ? "w-1/3 bg-red-500"
                                                            : passwordStrength === "Medium"
                                                                ? "w-2/3 bg-yellow-500"
                                                                : "w-full bg-green-500"
                                                            }`}
                                                    />

                                                </div>

                                                <p
                                                    className={`text-xs mt-1 font-medium ${passwordStrength === "Weak"
                                                        ? "text-red-500"
                                                        : passwordStrength === "Medium"
                                                            ? "text-yellow-600"
                                                            : "text-green-600"
                                                        }`}
                                                >
                                                    {passwordStrength} Password
        </p>

                                            </div>

                                        )}

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
                                                value={businessName}
                                                onChange={(e) => setBusinessName(e.target.value)}
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Contact Person"
                                                value={contactPerson}
                                                onChange={(e) => setContactPerson(e.target.value)}
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                        </div>

                                        <div className="grid grid-cols-2 gap-3">

                                            <input
                                                type="email"
                                                placeholder="Business Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Phone Number"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                        </div>

                                        <input
                                            type="text"
                                            placeholder="GST Number"
                                            value={gstNumber}
                                            onChange={(e) => setGstNumber(e.target.value)}
                                            className="w-full border border-slate-200 p-3 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                        />

                                        <div className="relative">

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    checkPasswordStrength(e.target.value);
                                                }}
                                                placeholder="Password"
                                                className="w-full border border-slate-200 p-3 pr-12 rounded-xl transition-all duration-300 focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100 outline-none"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>

                                        </div>

                                    </motion.div>

                                )}

                            </AnimatePresence>
                            <div className="flex items-center gap-3 mt-4">

                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-4 h-4 accent-[#4B1E78]"
                                />

                                <p className="text-sm text-slate-600">
                                    I agree to the
        <span className="text-[#4B1E78] font-semibold cursor-pointer ml-1">
                                        Terms & Conditions
        </span>
                                </p>

                            </div>
                            <motion.button
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleRegister}
                                className="w-full mt-4 bg-[#4B1E78] text-white py-3 rounded-xl font-semibold shadow-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">

                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                        <span>Creating Account...</span>

                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </motion.button>

                            <div className="relative my-8">

                                <div className="border-t border-slate-200"></div>

                                <span
                                    className="
        absolute
        left-1/2
        -translate-x-1/2
        -top-3
        bg-white
        px-4
        text-xs
        font-semibold
        text-slate-400
        uppercase
        tracking-[3px]
        "
                                >
                                    Continue With
    </span>

                            </div>

                            <div className="grid grid-cols-2 gap-5">

                                <button
                                    type="button"
                                    className="
        flex
        items-center
        justify-center
        gap-3
        h-14
        rounded-2xl
        border-2
        border-slate-300
        bg-white
        font-semibold
        text-[15px]
        shadow-md
        hover:shadow-xl
        hover:border-slate-400
        hover:-translate-y-1
        transition-all
        duration-300
        "
                                >
                                    <FcGoogle size={24} />
        Google
    </button>

                                <button
                                    type="button"
                                    className="
        flex
        items-center
        justify-center
        gap-3
        h-14
        rounded-2xl
        border-2
        border-slate-300
        bg-white
        font-semibold
        text-[15px]
        shadow-md
        hover:shadow-xl
        hover:border-slate-400
        hover:-translate-y-1
        transition-all
        duration-300
        "
                                >
                                    <FaGithub size={22} />
        GitHub
    </button>

                            </div>
                            <p className="text-center text-sm text-zinc-500 mt-5">

                                Already have an account?

    <Link
                                    to="/login"
                                    className="text-[#4B1E78] ml-2 font-semibold hover:underline"
                                >
                                    Login
    </Link>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}