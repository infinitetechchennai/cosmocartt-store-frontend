import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ClipboardList,
  UserRoundPlus,
  Menu,
  X,
  LogOut
} from "lucide-react";

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logo}
              alt="CosmoCartt"
              className="h-16 sm:h-20 lg:h-24 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl items-center border-2 border-purple-300 rounded-2xl overflow-hidden shadow-[0_0_14px_rgba(168,85,247,0.28)]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search products..."
              className="flex-1 px-5 py-3 outline-none text-sm lg:text-base"
            />

            <button
              onClick={handleSearch}
              className="h-full px-5 py-3 bg-[#4B1E78] text-white hover:bg-[#6F2DBD]"
            >
              <Search size={22} />
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-5 text-[#4B1E78] font-semibold">
            {!user ? (
              <>
                <Link to="/login" className="flex items-center gap-2 hover:text-[#6F2DBD]">
                  <User size={20} />
                  Login
                </Link>

                <Link to="/register" className="flex items-center gap-2 hover:text-[#6F2DBD]">
                  <UserRoundPlus size={20} />
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/orders" className="flex items-center gap-2 hover:text-[#6F2DBD]">
                  <ClipboardList size={20} />
                  Orders
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 hover:text-red-600"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            )}

            <Link to="/wishlist" className="relative hover:text-[#6F2DBD]">
              <Heart size={23} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative hover:text-[#6F2DBD]">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex lg:hidden items-center gap-3 text-[#4B1E78]">
            <Link to="/wishlist" className="relative">
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart size={23} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="w-10 h-10 rounded-xl border border-purple-100 flex items-center justify-center"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <div className="flex items-center border border-purple-200 rounded-2xl overflow-hidden bg-white">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search products..."
              className="flex-1 px-4 py-3 outline-none text-sm"
            />

            <button
              onClick={handleSearch}
              className="px-4 py-3 bg-[#4B1E78] text-white"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[99999] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-2xl p-5">
            <div className="flex items-center justify-between border-b pb-4">
              <img src={logo} alt="CosmoCartt" className="h-16 w-auto object-contain" />

              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 rounded-full border flex items-center justify-center"
              >
                <X size={22} />
              </button>
            </div>

            <div className="py-5 space-y-3 text-[#4B1E78] font-bold">
              <Link
                onClick={() => setMobileOpen(false)}
                to="/products"
                className="block px-4 py-3 rounded-xl bg-purple-50"
              >
                Products
              </Link>

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
