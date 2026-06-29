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
  Menu,
  X,
  LogOut,
} from "lucide-react";

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "United Arab Emirates",
];

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

const getSubcategoryLink = (categoryName: string, sub: string) => {
  const name = sub.toLowerCase();

  if (
    categoryName === "Mobile Accessories" &&
    (name.includes("case") || name.includes("cover") || name.includes("backcase"))
  ) {
    return "/backcase-brands";
  }

  return `/products?category=${encodeURIComponent(
    categoryName
  )}&subcategory=${encodeURIComponent(sub)}`;
};

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    setShowSuggestions(false);
    setMobileOpen(false);
  };

  const filteredSuggestions = search.trim()
    ? searchSuggestions.filter((item) =>
        item.toLowerCase().startsWith(search.toLowerCase())
      )
    : searchSuggestions.slice(0, 6);

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* DESKTOP NAVBAR */}
      <div className="hidden lg:flex max-w-[1600px] mx-auto px-6 h-24 items-center gap-5">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="CosmoCartt"
            className="h-24 xl:h-28 w-auto object-contain hover:scale-105 transition-all duration-300"
          />
        </Link>

        <div className="flex flex-1 max-w-[820px] 2xl:max-w-[900px] items-center bg-white rounded-2xl h-12 pl-5 border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)]">
          <div className="relative group shrink-0">
            <button className="bg-transparent text-gray-700 border-r pr-4 mr-4 font-medium cursor-pointer whitespace-nowrap">
              All Categories ▾
            </button>

            <div
              onMouseLeave={() => setHoveredCategory("")}
              className={`absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex overflow-hidden ${
                hoveredCategory ? "w-[590px]" : "w-72"
              }`}
            >
              <div className={`w-72 bg-white ${hoveredCategory ? "border-r" : ""}`}>
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-purple-50 hover:text-[#4B1E78] font-medium"
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
                      .find((cat) => cat.name === hoveredCategory)
                      ?.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={getSubcategoryLink(hoveredCategory, sub)}
                          className="block bg-white rounded-lg px-3 py-2 text-sm hover:bg-purple-50 hover:text-[#4B1E78] transition-all"
                        >
                          {sub}
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full text-base outline-none text-gray-700"
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-4 w-full bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden z-[99999]">
                {filteredSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={() => handleSuggestionClick(item)}
                    className="w-full text-left px-5 py-3 text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-[#4B1E78] transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="h-12 w-12 bg-[#4B1E78] hover:bg-[#6F2DBD] rounded-r-2xl flex items-center justify-center transition-all duration-300 shrink-0"
          >
            <Search size={23} className="text-white" />
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-1 shrink-0 -mr-2">
          <MapPin size={18} className="text-[#4B1E78]" />

          <div className="leading-tight">
            <p className="text-[11px] text-gray-500">Deliver to</p>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent text-sm font-semibold text-[#4B1E78] outline-none cursor-pointer max-w-[78px] pr-0"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav className="flex items-center gap-4 text-[#4B1E78] shrink-0">
          {!user ? (
            <>
              <Link
                to="/login"
                className="group flex items-center gap-2 text-base font-medium hover:text-[#6F2DBD] hover:scale-105 transition-all duration-300"
              >
                <User size={19} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="group flex items-center gap-2 text-base font-medium hover:text-[#6F2DBD] hover:scale-105 transition-all duration-300"
              >
                <UserRoundPlus size={19} />
                <span>Register</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/orders"
                className="group flex items-center gap-2 text-base font-medium hover:text-[#6F2DBD] hover:scale-105 transition-all duration-300"
              >
                <ClipboardList size={19} />
                <span>Orders</span>
              </Link>

              <button
                onClick={logout}
                className="group flex items-center gap-2 text-base font-medium hover:text-red-600 hover:scale-105 transition-all duration-300"
              >
                <LogOut size={19} />
                <span>Logout</span>
              </button>
            </>
          )}

          <Link
            to="/products"
            className="group flex items-center gap-2 text-base font-medium hover:text-[#6F2DBD] hover:scale-105 transition-all duration-300"
          >
            <Package size={19} />
            <span>Products</span>
          </Link>

          <Link to="/wishlist" className="relative hover:text-[#6F2DBD] transition">
            <Heart size={23} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {wishlistItems.length}
            </span>
          </Link>

          <Link to="/cart" className="relative hover:text-[#6F2DBD] transition">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartItems.length}
            </span>
          </Link>
        </nav>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="lg:hidden px-3 py-2 bg-white">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="CosmoCartt" className="h-14 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-3 text-[#4B1E78]">
            <Link to="/wishlist" className="relative">
              <Heart size={22} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart size={23} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="w-10 h-10 rounded-xl border border-purple-100 flex items-center justify-center bg-purple-50"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center border border-purple-200 rounded-2xl overflow-hidden bg-white">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 px-4 py-3 outline-none text-sm"
          />

          <button onClick={handleSearch} className="px-4 py-3 bg-[#4B1E78] text-white">
            <Search size={20} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[99999] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-2xl overflow-y-auto">
            <div className="px-5 py-4 flex items-center justify-between border-b">
              <img src={logo} alt="CosmoCartt" className="h-14 w-auto object-contain" />

              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 rounded-full border flex items-center justify-center"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-5 space-y-3 text-[#4B1E78] font-bold">
              <Link
                onClick={() => setMobileOpen(false)}
                to="/products"
                className="block px-4 py-3 rounded-xl bg-purple-50"
              >
                All Products
              </Link>

              {categories.map((category) => (
                <div key={category.name} className="border rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedMobileCategory(
                        expandedMobileCategory === category.name ? "" : category.name
                      )
                    }
                    className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 text-left"
                  >
                    <span>{category.name}</span>
                    <ChevronDown
                      size={17}
                      className={
                        expandedMobileCategory === category.name
                          ? "rotate-180 transition-transform"
                          : "transition-transform"
                      }
                    />
                  </button>

                  {expandedMobileCategory === category.name && (
                    <div className="bg-white">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={getSubcategoryLink(category.name, sub)}
                          onClick={() => setMobileOpen(false)}
                          className="block px-6 py-3 border-t text-sm text-slate-700"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                onClick={() => setMobileOpen(false)}
                to="/orders"
                className="block px-4 py-3 rounded-xl bg-purple-50"
              >
                Orders
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/wishlist"
                className="block px-4 py-3 rounded-xl bg-purple-50"
              >
                Wishlist
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/cart"
                className="block px-4 py-3 rounded-xl bg-purple-50"
              >
                Cart
              </Link>

              {!user ? (
                <>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/login"
                    className="block px-4 py-3 rounded-xl border"
                  >
                    Login
                  </Link>

                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/register"
                    className="block px-4 py-3 rounded-xl bg-[#4B1E78] text-white text-center"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 text-left"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
