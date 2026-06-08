import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { categories } from "../data/categories";

import {
    Search,
    ShoppingCart,
    Heart,
    User,
    ChevronDown,
    MapPin,
    ClipboardList,
    UserRoundPlus,
    Package
} from "lucide-react";

export default function Navbar() {
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
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
        <header className="sticky top-0 z-50 bg-white border-b border-purple-100 shadow-2xl">

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
                        rounded-2xl
                        w-[620px]
                        h-12
                        px-6
                        border-2
                        border-purple-400
                        shadow-[0_0_20px_rgba(168,85,247,0.6)]
                    "
                >

                    <div className="relative group">
    <button
        className="
            bg-transparent
            text-gray-700
            border-r
            pr-4
            mr-4
            font-medium
            cursor-pointer
        "
    >
        All Categories ▾
    </button>

    <div
    className="
        absolute
        top-full
        left-0
        w-72
        bg-white
        shadow-xl
        rounded-xl
        border
        opacity-0
        invisible
        group-hover:opacity-100
        group-hover:visible
        transition-all
        duration-200
        z-50
        max-h-[450px]
        overflow-y-auto
    "
>
    {categories.map((cat) => (
        <Link
            key={cat.name}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="
                block
                px-4
                py-3
                hover:bg-purple-50
                hover:text-purple-700
                transition-all
            "
        >
            {cat.name}
        </Link>
    ))}
</div>
</div>
                    
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


                <div className="hidden lg:flex items-center gap-2 text-[#4B1E78]">
                    <MapPin size={22} />

                    <div>
                        <p className="text-xs text-gray-500">
                            Deliver to
        </p>

                        <p className="font-semibold">
                            India
        </p>
                    </div>
                </div>



                {/* Right Side */}
                <div className="flex items-center gap-5 text-[#4B1E78]">
                    {/* Divider */}
                    <div className="w-px h-10 bg-purple-200"></div>



                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="
flex items-center gap-2
font-medium
text-[#4B1E78]
hover:text-[#6F2DBD]
transition-all duration-300
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
                    hover:text-[#6F2DBD]
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
                            <div className="relative group">

                                <button
                                    className="
        flex
        items-center
        gap-2
        font-medium
        text-[#4B1E78]
    "
                                >
                                    <User size={18} />

                                    <div className="text-left">
                                        <p className="text-xs text-slate-500">
                                            Hello, {user.name}
                                        </p>

                                        <p className="font-semibold">
                                            My Account
    </p>
                                    </div>

                                    <ChevronDown size={16} />
                                </button>

                                <div
                                    className="
        absolute
        right-0
        top-full
        mt-2
        w-56
        bg-white
        rounded-2xl
        shadow-xl
        border
        border-slate-200
        overflow-hidden
        z-50
        opacity-0
        invisible
        group-hover:opacity-100
        group-hover:visible
        transition-all
        duration-200
    "
                                >

                                    <div className="px-4 py-3 border-b">
                                        <p className="font-semibold">
                                            {user.name}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {user.email}
                                        </p>
                                    </div>

                                    <Link
                                        to="/orders"
                                        className="
            flex
            items-center
            gap-3
            px-4
            py-3
            hover:bg-slate-50
            text-[#4B1E78]
        "
                                    >
                                        <ClipboardList size={18} />
                                        <span>My Orders</span>
                                    </Link>

                                    <Link
                                        to="/wishlist"
                                        className="
            flex
            items-center
            gap-3
            px-4
            py-3
            hover:bg-slate-50
            text-[#4B1E78]
        "
                                    >
                                        <Heart size={18} />
                                        <span>Wishlist</span>
                                    </Link>

                                    <div className="border-t"></div>

                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate("/");
                                        }}
                                        className="
            w-full
            text-left
            px-4
            py-3
            hover:bg-red-50
            text-red-600
        "
                                    >
                                        Logout
    </button>

                                </div>

                            </div>


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
            hover:text-[#6F2DBD]
            hover:scale-105
            transition-all
            duration-300
        "
                    >
                        <Package size={20} />

                        <div>
                            <p className="text-xs text-slate-500">
                                Browse
    </p>

                            <p className="font-semibold">
                                Products
    </p>
                        </div>
                    </Link>



                    <Link
                        to="/wishlist"
                        className="
        relative
        hover:scale-110
        transition-all
        duration-300
    "
                    >
                        <Heart size={28} />

                        <span
                            className="
            absolute
            -top-2
            -right-2
            bg-pink-500
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
                            {wishlistItems.length}
                        </span>

                    </Link>

                    {/* Divider */}
                    <div className="w-px h-10 bg-purple-200"></div>

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
