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
  Package,
} from "lucide-react";

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState("");

  const searchSuggestions = [
    "iPhone",
    "iPhone Case",
    "Samsung Case",
    "OnePlus Case",
    "TV Remote",
    "AC Remote",
    "Mobile Back Cover",
    "Clear Case",
    "Shockproof Case",
    "Silicone Case",
  ];

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(
      `/products?search=${encodeURIComponent(search)}`
    );
  };

  const filteredSuggestions = search.trim()
    ? searchSuggestions.filter((item) =>
        item.toLowerCase().startsWith(search.toLowerCase())
      )
    : searchSuggestions.slice(0, 6);

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    navigate(
      `/products?search=${encodeURIComponent(suggestion)}`
    );
  };

  return (
    <header
      className="
        sticky
        top-0
        z-50
        bg-white
        border-b
        border-gray-200
        shadow-sm
      "
    >
      <div
        className="
          max-w-[1600px]
          mx-auto
          px-8
          h-24
          flex
          items-center
          justify-between
        "
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="CosmoCartt"
            className="
              h-20
              md:h-24
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
            w-[580px]
            h-12
            pl-6
            border-2
            border-purple-400
            shadow-[0_0_18px_rgba(168,85,247,0.45)]
            hover:shadow-[0_0_24px_rgba(168,85,247,0.55)]
            transition-all
            duration-300
          "
        >
          {/* Categories */}
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
              onMouseLeave={() => setHoveredCategory("")}
              className={`
                absolute
                top-full
                left-0
                mt-2
                bg-white
                rounded-2xl
                shadow-2xl
                border
                opacity-0
                invisible
                group-hover:opacity-100
                group-hover:visible
                transition-all
                duration-200
                z-50
                flex
                overflow-hidden
                ${hoveredCategory ? "w-[590px]" : "w-72"}
              `}
            >
              <div
                className={`
                  w-72
                  bg-white
                  ${hoveredCategory ? "border-r" : ""}
                `}
              >
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    onMouseEnter={() =>
                      setHoveredCategory(cat.name)
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      cursor-pointer
                      hover:bg-purple-50
                      hover:text-[#4B1E78]
                      font-medium
                      transition-all
                    "
                  >
                    <span>{cat.name}</span>
                    <span>›</span>
                  </div>
                ))}
              </div>

              {hoveredCategory && (
                <div className="w-[300px] p-4 bg-slate-50 border-l">
                  <h3 className="font-bold text-[#4B1E78] mb-3">
                    {hoveredCategory}
                  </h3>

                  <div className="space-y-2">
                    {categories
                      .find(
                        (cat) =>
                          cat.name === hoveredCategory
                      )
                      ?.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={
                            sub === "Cases & Covers"
                              ? "/backcase-brands"
                              : `/products?category=${encodeURIComponent(
                                  hoveredCategory
                                )}&subcategory=${encodeURIComponent(
                                  sub
                                )}`
                          }
                          className="
                            block
                            bg-white
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            hover:bg-purple-50
                            hover:text-[#4B1E78]
                            transition-all
                          "
                        >
                          {sub}
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onFocus={() =>
                setShowSuggestions(true)
              }
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false);
                }, 150);
              }}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  setShowSuggestions(false);
                }
              }}
              className="
                w-full
                text-base
                outline-none
                text-gray-700
              "
            />

            {showSuggestions &&
              filteredSuggestions.length > 0 && (
                <div
                  className="
                    absolute
                    top-full
                    left-0
                    mt-4
                    w-full
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-purple-100
                    overflow-hidden
                    z-[99999]
                  "
                >
                  {filteredSuggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={() =>
                        handleSuggestionClick(item)
                      }
                      className="
                        w-full
                        text-left
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-slate-700
                        hover:bg-purple-50
                        hover:text-[#4B1E78]
                        transition-all
                      "
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Search Button */}
          <div className="flex items-center h-12 -mr-6">
            <div className="w-px h-8 bg-purple-200"></div>

            <button
              onClick={handleSearch}
              className="
                h-12
                w-12
                bg-[#4B1E78]
                hover:bg-[#6F2DBD]
                rounded-r-2xl
                flex
                items-center
                justify-center
                transition-all
                duration-300
              "
            >
              <Search
                size={24}
                className="text-white"
              />
            </button>
          </div>
        </div>

        {/* Delivery */}
        <div
          className="
            hidden
            lg:flex
            items-center
            gap-2
            text-[#4B1E78]
            ml-6
          "
        >
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

        {/* RIGHT SIDE STARTS HERE */}
                {/* Right Side */}
        <div
          className="
            flex
            items-center
            gap-5
            text-[#4B1E78]
          "
        >
          {/* Divider */}
          <div className="w-px h-10 bg-purple-200"></div>

          {!user ? (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="
                  group
                  relative
                  flex
                  items-center
                  gap-2
                  text-lg
                  font-medium
                  text-[#4B1E78]
                  hover:text-[#6F2DBD]
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >
                <User
                  size={20}
                  className="
                    group-hover:-translate-y-1
                    transition-transform
                    duration-300
                  "
                />

                <span className="relative">
                  Login

                  <span
                    className="
                      absolute
                      left-0
                      -bottom-1
                      h-[2px]
                      w-0
                      bg-[#6F2DBD]
                      group-hover:w-full
                      transition-all
                      duration-300
                    "
                  />
                </span>
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="
                  group
                  relative
                  flex
                  items-center
                  gap-2
                  text-lg
                  font-medium
                  text-[#4B1E78]
                  hover:text-[#6F2DBD]
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >
                <UserRoundPlus
                  size={20}
                  className="
                    group-hover:-translate-y-1
                    transition-transform
                    duration-300
                  "
                />

                <span className="relative">
                  Register

                  <span
                    className="
                      absolute
                      left-0
                      -bottom-1
                      h-[2px]
                      w-0
                      bg-[#6F2DBD]
                      group-hover:w-full
                      transition-all
                      duration-300
                    "
                  />
                </span>
              </Link>
            </>
          ) : (
            <>
              {/* Account Dropdown */}
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

          {/* Products */}
          <Link
            to="/products"
            className="
              group
              relative
              flex
              items-center
              gap-2
              text-lg
              font-medium
              text-[#4B1E78]
              hover:text-[#6F2DBD]
              hover:scale-105
              transition-all
              duration-300
            "
          >
            <Package
              size={20}
              className="
                group-hover:-translate-y-1
                transition-transform
                duration-300
              "
            />

            <div>
              <p className="relative font-semibold">
                Products

                <span
                  className="
                    absolute
                    left-0
                    -bottom-1
                    h-[2px]
                    w-0
                    bg-[#6F2DBD]
                    group-hover:w-full
                    transition-all
                    duration-300
                  "
                />
              </p>
            </div>
          </Link>

          {/* Wishlist */}
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
                shadow-md
              "
            >
              {wishlistItems.length}
            </span>
          </Link>

          {/* Divider */}
          <div className="w-px h-10 bg-purple-200"></div>

          {/* Cart */}
          <Link
            to="/cart"
            className="
              relative
              hover:scale-110
              transition-all
              duration-300
            "
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
                shadow-md
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