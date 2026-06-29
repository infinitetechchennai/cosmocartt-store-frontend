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
    Headset
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

const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Cart", path: "/cart" },
    { label: "Wishlist", path: "/wishlist" },
    { label: "Login", path: "/login" },
    { label: "Register", path: "/register" }
];

const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy-policy" }
];

const serviceLinks = [
    { label: "FAQ", path: "/faq" },
    { label: "Shipping Information", path: "/shipping-policy" },
    { label: "Returns & Refunds", path: "/refund-policy" },
    { label: "Order Tracking", path: "/orders" }
];

function scrollTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function FooterLink({
    label,
    path
}: {
    label: string;
    path: string;
}) {
    return (
        <Link
            to={path}
            onClick={scrollTop}
            className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-300 hover:translate-x-1"
        >
            <span>{label}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                →
      </span>
        </Link>
    );
}

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[#2B1055] via-[#4B1E78] to-[#6F2DBD] text-white mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-9">
                    <div className="lg:col-span-1">
                        <Link to="/" onClick={scrollTop}>
                            <img
                                src={logo}
                                alt="CosmoCartt"
                                className="h-28 md:h-32 w-auto object-contain brightness-0 invert cursor-pointer hover:scale-105 transition-all duration-300"
                            />
                        </Link>

                        <p className="mt-4 text-purple-100 leading-relaxed text-sm">
                            Your trusted destination for premium electronics, mobile
                            accessories, remotes and smart lifestyle products.
            </p>

                        <div className="flex gap-3 mt-6">
                            <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center">
                                <img
                                    src={instagramIcon}
                                    alt="Instagram"
                                    className="w-7 h-7 object-contain"
                                />
                            </button>

                            <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center">
                                <img
                                    src={youtubeIcon}
                                    alt="YouTube"
                                    className="w-9 h-9 object-contain"
                                />
                            </button>

                            <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center">
                                <img
                                    src={googleIcon}
                                    alt="Google"
                                    className="w-9 h-9 object-contain"
                                />
                            </button>

                            <button className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center">
                                <img
                                    src={githubIcon}
                                    alt="GitHub"
                                    className="w-9 h-9 object-contain"
                                />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-5">
                            Quick Links
            </h3>

                        <div className="space-y-3 text-sm">
                            {quickLinks.map((link) => (
                                <FooterLink
                                    key={link.path}
                                    label={link.label}
                                    path={link.path}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-5">
                            Company
            </h3>

                        <div className="space-y-3 text-sm">
                            {companyLinks.map((link) => (
                                <FooterLink
                                    key={link.path}
                                    label={link.label}
                                    path={link.path}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-5">
                            Customer Service
            </h3>

                        <div className="space-y-3 text-sm">
                            {serviceLinks.map((link) => (
                                <FooterLink
                                    key={link.path}
                                    label={link.label}
                                    path={link.path}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-5">
                            Popular Brands
            </h3>

                        <div className="flex flex-wrap gap-2">
                            {brands.map((brand) => (
                                <Link
                                    key={brand}
                                    to={`/products?brand=${encodeURIComponent(brand)}`}
                                    onClick={scrollTop}
                                    className="px-3 py-1.5 text-xs rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 inline-block"
                                >
                                    {brand}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-10 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-purple-100">
                        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                            <MapPinned size={20} className="text-white/80 shrink-0" />
                            <span className="text-sm font-semibold">
                                Chennai, India
              </span>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                            <PhoneCall size={20} className="text-white/80 shrink-0" />
                            <span className="text-sm font-semibold">
                                +91 98765 43210
              </span>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                            <Mail size={20} className="text-white/80 shrink-0" />
                            <span className="text-sm font-semibold">
                                support@cosmocartt.com
              </span>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                            <Headset size={20} className="text-white/80 shrink-0" />
                            <span className="text-sm font-semibold">
                                24/7 Customer Support
              </span>
                        </div>
                    </div>
                </div>

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