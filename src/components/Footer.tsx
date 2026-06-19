import instagramIcon from "../assets/instagram.png";
import youtubeIcon from "../assets/youtube.png";
import googleIcon from "../assets/google.png";
import githubIcon from "../assets/github.png";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  MapPinned,
  PhoneCall,
  Mail,
  Headset,
} from "lucide-react";


const brands = [
    "Apple",
    "Samsung",
    "Sony",
    "Dell",
    "HP",
    "Asus",
    "Lenovo",
    "Acer",
    "MSI",
    "Logitech",
    "JBL",
    "Boat"
];

export default function Footer() {

    return (
        <footer className="bg-gradient-to-br from-[#2B1055] via-[#4B1E78] to-[#6F2DBD] text-white mt-20">

            
            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

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

    <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center">
        <img
            src={instagramIcon}
            alt="Instagram"
            className="w-8 h-8 object-contain"
        />
    </button>

    <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center">
        <img
            src={youtubeIcon}
            alt="YouTube"
            className="w-10 h-10 object-contain"
        />
    </button>

    <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center">
        <img
            src={googleIcon}
            alt="Google"
            className="w-10 h-10 object-contain"
        />
    </button>

    <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center">
        <img
            src={githubIcon}
            alt="GitHub"
            className="w-10 h-10 object-contain"
        />
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
        className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2"
    >
        <span>Home</span>
        <span className="opacity-0 group-hover:opacity-100">→</span>
    </Link>

    <Link
        to="/products"
        className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2"
    >
        <span>Products</span>
        <span className="opacity-0 group-hover:opacity-100">→</span>
    </Link>

    <Link
        to="/cart"
        className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2"
    >
        <span>Cart</span>
        <span className="opacity-0 group-hover:opacity-100">→</span>
    </Link>

    <Link
        to="/login"
        className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2"
    >
        <span>Login</span>
        <span className="opacity-0 group-hover:opacity-100">→</span>
    </Link>

    <Link
        to="/register"
        className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2"
    >
        <span>Register</span>
        <span className="opacity-0 group-hover:opacity-100">→</span>
    </Link>

    <Link
    to="/wishlist"
    className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2"
>
    <span>Wishlist</span>
    <span className="opacity-0 group-hover:opacity-100">→</span>
</Link>

    <a className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-2">
        <span>Order Tracking</span>
        <span className="opacity-0 group-hover:opacity-100">→</span>
    </a>

</div>

                        </div>
                        

                    </div>

                    {/* Company */}

<div>

    <h3 className="font-bold text-lg mb-4">
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
            Press
        </a>

        <a className="block text-purple-100 hover:text-white transition">
            Investors
        </a>

        <a className="block text-purple-100 hover:text-white transition">
            Terms & Conditions
        </a>

        <a className="block text-purple-100 hover:text-white transition">
            Privacy Policy
        </a>

        <a className="block text-purple-100 hover:text-white transition">
            Contact
        </a>

    </div>

</div>
{/* Customer Service */}

<div>

    <h3 className="font-bold text-lg mb-4">
        Customer Service
    </h3>

    <div className="space-y-3">

        <a className="block text-purple-100 hover:text-white transition">
            Help Center
        </a>

        <a className="block text-purple-100 hover:text-white transition">
            Shipping Information
        </a>

        <a className="block text-purple-100 hover:text-white transition">
            Returns & Refunds
        </a>

        <a className="block text-purple-100 hover:text-white transition">
            Track Your Order
        </a>

        <a className="block text-purple-100 hover:text-white transition">
            Warranty Claims
        </a>

        <a className="block text-purple-100 hover:text-white transition">
            FAQs
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

    <Link
        key={brand}
        to={`/products?brand=${encodeURIComponent(brand)}`}
        onClick={() =>
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        }
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
            inline-block
        "
    >
        {brand}
    </Link>

))}

    </div>

</div>
</div>
{/* Contact */}

<div className="border-t border-white/10 mt-8 pt-8">
    <div
    className="
        flex
        justify-center
        items-center
        gap-4
        text-lg
        font-medium
        text-purple-100
        whitespace-nowrap
        overflow-x-auto
    "

    ><div
  className="
    flex
    justify-center
    items-center
    gap-6
    text-lg
    font-semibold
    text-purple-100
    whitespace-nowrap
    overflow-x-auto
  "
>
  <span className="flex items-center gap-2 hover:text-white transition-all duration-300">
    <MapPinned size={20} className="text-white/80" />
    Chennai, India
  </span>

  <span className="text-white/30 text-xl">•</span>

  <span className="flex items-center gap-2 hover:text-white transition-all duration-300">
    <PhoneCall size={20} className="text-white/80" />
    +91 98765 43210
  </span>

  <span className="text-white/30 text-xl">•</span>

  <span className="flex items-center gap-2 hover:text-white transition-all duration-300">
    <Mail size={20} className="text-white/80" />
    support@cosmocartt.com
  </span>

  <span className="text-white/30 text-xl">•</span>

  <span className="flex items-center gap-2 hover:text-white transition-all duration-300">
    <Headset size={20} className="text-white/80" />
    24/7 Customer Support
  </span>
</div>

    </div>

</div>
                {/* Bottom Bar */}

                <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

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