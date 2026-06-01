import {
    Search,
    ShoppingCart,
    User
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
        <header className="sticky top-0 z-50 bg-[#4B1E78] shadow-md">

            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-[#4B1E78]"
                >
                    <h1 className="text-white text-2xl font-bold tracking-wide">
                        CosmoCartt
        </h1>
                </Link>

                {/* Search */}
                <div className="hidden md:flex bg-white rounded-xl overflow-hidden w-[500px]">

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
                        className="flex-1 px-4 py-2 outline-none"
                    />

                    <button
                        onClick={handleSearch}
                        className="px-4 text-[#4B1E78]"
                    >
                        <Search size={20} />
                    </button>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-5 text-white">

                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="font-medium"
                            >
                                Login
        </Link>

                            <Link
                                to="/register"
                                className="font-medium"
                            >
                                Register
        </Link>
                        </>
                    ) : (
                        <>
                            <span>
                                Hello, {user.name}
                            </span>

                            <button
                                onClick={() => {
                                    logout();
                                    navigate("/");
                                }}
                            >
                                Logout
        </button>
                        </>
                    )}

                    <Link
                        to="/products"
                        className="font-medium hover:text-[#4B1E78]"
                    >
                        Products
</Link>

                    <Link
                        to="/cart"
                        className="hover:scale-110 transition relative"
                    >

                        <ShoppingCart />

                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">
                            {cartItems.length}
                        </span>

                    </Link>

                </div>

            </div>

        </header>
    );
}