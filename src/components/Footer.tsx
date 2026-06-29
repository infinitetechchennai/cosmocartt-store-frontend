import instagramIcon from "../assets/instagram.png";
import youtubeIcon from "../assets/youtube.png";
import googleIcon from "../assets/google.png";
import githubIcon from "../assets/github.png";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
    ArrowRight,
    BadgeCheck,
    Clock3,
    Globe2,
    Headset,
    Mail,
    MapPinned,
    PhoneCall,
    ShieldCheck,
    Sparkles
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
            className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm text-purple-100 transition-all duration-300 hover:border-white/15 hover:bg-white/10 hover:text-white"
        >
            <span>{label}</span>
            <ArrowRight
                size={14}
                className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
            />
        </Link>
    );
}

export default function Footer() {
    return (
        <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-[#0f0520] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.2),_transparent_35%)]" />

            <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.9fr]">
                    <div className="max-w-md">
                        <Link to="/" onClick={scrollTop} className="inline-flex">
                            <img
                                src={logo}
                                alt="CosmoCartt"
                                className="h-24 w-auto object-contain brightness-0 invert transition-all duration-300 hover:scale-105"
                            />
                        </Link>

                        <p className="mt-4 text-sm leading-7 text-purple-100">
                            Discover premium electronics, smart accessories, and lifestyle essentials crafted for everyday convenience and elevated style.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {[
                                "Fast Delivery",
                                "Secure Checkout",
                                "Trusted Support"
                            ].map((item) => (
                                <span
                                    key={item}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90"
                                >
                                    <BadgeCheck size={14} className="text-violet-300" />
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="mt-6 flex gap-3">
                            {[
                                { icon: instagramIcon, alt: "Instagram" },
                                { icon: youtubeIcon, alt: "YouTube" },
                                { icon: googleIcon, alt: "Google" },
                                { icon: githubIcon, alt: "GitHub" }
                            ].map((social) => (
                                <button
                                    key={social.alt}
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                                >
                                    <img
                                        src={social.icon}
                                        alt={social.alt}
                                        className="h-7 w-7 object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
                            <Sparkles size={16} />
                            Quick Links
                        </div>
                        <div className="space-y-1">
                            {quickLinks.map((link) => (
                                <FooterLink key={link.path} label={link.label} path={link.path} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
                            <Globe2 size={16} />
                            Company
                        </div>
                        <div className="space-y-1">
                            {companyLinks.map((link) => (
                                <FooterLink key={link.path} label={link.label} path={link.path} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
                            <Headset size={16} />
                            Customer Service
                        </div>
                        <div className="space-y-1">
                            {serviceLinks.map((link) => (
                                <FooterLink key={link.path} label={link.label} path={link.path} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
                            <ShieldCheck size={16} />
                            Popular Brands
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {brands.map((brand) => (
                                <Link
                                    key={brand}
                                    to={`/products?brand=${encodeURIComponent(brand)}`}
                                    onClick={scrollTop}
                                    className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                                >
                                    {brand}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 rounded-[28px] border border-white/10 bg-white/8 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                            <MapPinned size={18} className="mt-0.5 shrink-0 text-violet-200" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">Visit us</p>
                                <p className="mt-1 text-sm text-white/90">Chennai, India</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                            <PhoneCall size={18} className="mt-0.5 shrink-0 text-violet-200" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">Call support</p>
                                <p className="mt-1 text-sm text-white/90">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                            <Mail size={18} className="mt-0.5 shrink-0 text-violet-200" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">Email us</p>
                                <p className="mt-1 text-sm text-white/90">support@cosmocartt.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                            <Clock3 size={18} className="mt-0.5 shrink-0 text-violet-200" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">Hours</p>
                                <p className="mt-1 text-sm text-white/90">24/7 Customer Support</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-purple-100">
                        © 2026 CosmoCartt. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-purple-100">
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">Visa</span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">Mastercard</span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">UPI</span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">PayPal</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}