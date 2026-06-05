import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
    Search,
    ShoppingCart,
    User,
    UserRoundPlus,
    Package,
    ClipboardList
} from "lucide-react";

export default function Navbar() {
    const { cartItems } = useCart();
    const [search, setSearch] = useState("");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!search.trim()) return;

        navigate(
            `/products?search=${encodeURIComponent(search)}`
        );
    };

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-[#22004a] via-[#3b0b75] to-[#22004a] shadow-2xl">

            <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center"
                >
                    <img
                        src={logo}
                        alt="CosmoCartt"
                        className="
        h-24
        md:h-32
        w-auto
        object-contain
        brightness-0
        invert
        hover:scale-105
        transition-all
        duration-300
    "
                    />
                </Link>

                {/* Search */}
                <div
                    className="
                        hidden
                        md:flex
                        items-center
                        bg-white
                        rounded-full
                        w-[520px]
                        h-14
                        px-6
                        border-2
                        border-purple-400
                        shadow-[0_0_20px_rgba(168,85,247,0.6)]
                    "
                >
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        className="flex-1 text-base outline-none text-gray-700"
                    />

                    <button
                        onClick={handleSearch}
                        className="text-purple-700"
                    >
                        <Search size={24} />
                    </button>
                </div>

                <Link
                    to="/orders"
                    className="
        flex items-center gap-2
        text-lg font-medium
        hover:text-purple-300
        transition-all duration-300
    "
                >
                    <ClipboardList size={20} />
    Orders
</Link>

                {/* Right Side */}
                <div className="flex items-center gap-8 text-white">

                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="
                    flex
                    items-center
                    gap-2
                    text-lg
                    font-medium
                    hover:text-purple-300
                    hover:scale-105
                    transition-all
                    duration-300
                "
                            >
                                <User size={20} />
                Login
            </Link>

                            <Link
                                to="/register"
                                className="
                    flex
                    items-center
                    gap-2
                    text-lg
                    font-medium
                    hover:text-purple-300
                    hover:scale-105
                    transition-all
                    duration-300
                "
                            >
                                <UserRoundPlus size={20} />
                Register
            </Link>
                        </>
                    ) : (
                        <>
                            <span className="text-lg">
                                Hello, {user.name}
                            </span>

                            <button
                                onClick={() => {
                                    logout();
                                    navigate("/");
                                }}
                                className="
                    hover:text-purple-300
                    transition-all
                    duration-300
                "
                            >
                                Logout
            </button>
                        </>
                    )}

                    <Link
                        to="/products"
                        className="
            flex
            items-center
            gap-2
            text-lg
            font-medium
            hover:text-purple-300
            hover:scale-105
            transition-all
            duration-300
        "
                    >
                        <Package size={20} />
        Products
    </Link>

                    {/* Divider */}
                    <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/70 to-transparent"></div>

                    <Link
                        to="/cart"
                        className="relative hover:scale-110 transition-all duration-300"
                    >
                        <ShoppingCart size={30} />

                        <span
                            className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-white
                text-xs
                h-5
                w-5
                rounded-full
                flex
                items-center
                justify-center
                font-bold
            "
                        >
                            {cartItems.length}
                        </span>
                    </Link>

                </div>

            </div>

        </header>
    );
}
