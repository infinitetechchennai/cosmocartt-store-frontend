import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const brands = [
    "Apple",
    "Samsung",
    "Sony",
    "Dell",
    "HP",
    "Asus"
];

export default function Footer() {

    return (
        <footer className="bg-gradient-to-br from-[#2B1055] via-[#4B1E78] to-[#6F2DBD] text-white mt-20">

            {/* Newsletter */}

            <div className="border-b border-white/10">

                <div className="max-w-7xl mx-auto px-6 py-6">

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                        <div>

                            <Link
    to="/"
    onClick={() =>
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }
>
    <img
        src={logo}
        alt="CosmoCartt"
        className="h-24 md:h-32 w-auto object-contain brightness-0 invert cursor-pointer"
    />
</Link>

                            <p className="text-purple-100 mt-1 text-sm">
                                Get exclusive offers, product launches and special deals.
                            </p>

                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

                            <input
    type="email"
    placeholder="Enter your email"
    className="px-4 py-3 rounded-xl text-black w-full lg:w-72 outline-none"
/>

                            <button className="bg-white text-[#4B1E78] px-6 py-3 rounded-xl font-bold">
                                Subscribe
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* Main Footer */}

            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Brand */}

                    <div>

                        <Link
    to="/"
    onClick={() =>
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }
>
    <img
        src={logo}
        alt="CosmoCartt"
        className="h-32 md:h-40 w-auto object-contain brightness-0 invert cursor-pointer hover:scale-105 transition-all duration-300"
    />
</Link>

                        <p className="mt-4 text-purple-100 leading-relaxed">
                            Your trusted destination for premium electronics,
                            laptops, smartphones, gaming gear and accessories.
                        </p>

                        <div className="flex gap-3 mt-6">

                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition">
                                📘
                            </button>

                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition">
                                📸
                            </button>

                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition">
                                ✖️
                            </button>

                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition">
                                ▶️
                            </button>

                        </div>

                    </div>

                    {/* Quick Links */}

                    <div>

                        <h3 className="font-bold text-lg mb-4">
                            Quick Links
                        </h3>

                        <div className="space-y-3">

                            <div className="space-y-4">

    <Link
        to="/"
        className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-3 hover:text-white"
    >
        <span>Home</span>
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300">
            →
        </span>
    </Link>

    <Link
        to="/products"
        className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2"
    >
        <span>Products</span>
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300">
            →
        </span>
    </Link>

    <Link
        to="/cart"
        className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2"
    >
        <span>Cart</span>
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300">
            →
        </span>
    </Link>

    <Link
        to="/login"
        className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2"
    >
        <span>Login</span>
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300">
            →
        </span>
    </Link>

</div>

                            

                            <Link
                                to="/login"
                                className="block text-purple-100 hover:text-white transition"
                            >
                            </Link>

                        </div>
                        

                    </div>

                    {/* Company */}

                    <div>

                        <h3 className="font-bold text-xl mb-5">
                            Company
                        </h3>

                        <div className="space-y-3">

                            <a className="block text-purple-100 hover:text-white transition">
                                About Us
                            </a>

                            <a className="block text-purple-100 hover:text-white transition">
                                Careers
                            </a>

                            <a className="block text-purple-100 hover:text-white transition">
                                Blog
                            </a>

                            <a className="block text-purple-100 hover:text-white transition">
                                Contact
                            </a>

                        </div>

                    </div>
                    {/* Popular Brands */}

<div>

    <h3 className="font-bold text-lg mb-4">
        Popular Brands
    </h3>

    <div className="flex flex-wrap gap-2">

        {brands.map((brand) => (

            <span
                key={brand}
                className="
                    px-3
                    py-1.5
                    text-xs
                    rounded-full
                    bg-white/10
                    hover:bg-white/20
                    transition-all
                    duration-300
                    cursor-pointer
                    hover:scale-105
                "
            >
                {brand}
            </span>

        ))}

    </div>

</div>


                    {/* Contact */}

<div>

    <h3 className="font-bold text-xl mb-5">
        Contact
    </h3>

    <div className="space-y-5">

        <div className="flex items-center gap-4 group">

            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                📍
            </div>

            <div>
                <p className="text-xs text-purple-200 uppercase tracking-wider">
                    Location
                </p>
                <p className="text-white font-medium">
                    Chennai, India
                </p>
            </div>

        </div>

        <div className="flex items-center gap-4 group">

            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                📞
            </div>

            <div>
                <p className="text-xs text-purple-200 uppercase tracking-wider">
                    Phone
                </p>
                <p className="text-white font-medium">
                    +91 98765 43210
                </p>
            </div>

        </div>

        <div className="flex items-center gap-4 group">

            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                ✉️
            </div>

            <div>
                <p className="text-xs text-purple-200 uppercase tracking-wider">
                    Email
                </p>
                <p className="text-white font-medium">
                    support@cosmocartt.com
                </p>
            </div>

        </div>

        <div className="flex items-center gap-4 group">

            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                🕒
            </div>

            <div>
                <p className="text-xs text-purple-200 uppercase tracking-wider">
                    Availability
                </p>
                <p className="text-white font-medium">
                    Mon - Sun, 24/7
                </p>
            </div>

        </div>

    </div>

</div>

</div>


                {/* Bottom Bar */}

                <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-purple-100 text-sm">
                        © 2026 CosmoCartt. All Rights Reserved.
                    </p>

                    <div className="text-purple-100 text-sm">
                        Visa • Mastercard • UPI • PayPal
                    </div>

                </div>

            </div>

        </footer>
    );
}