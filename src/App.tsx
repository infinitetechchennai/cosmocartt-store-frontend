import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { useAuth } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const BrandsPage = lazy(() => import("./pages/BrandsPage"));
const CatalogBrowse = lazy(() => import("./pages/CatalogBrowse"));
const CMSPage = lazy(() => import("./pages/CMSPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F7F3FF] flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl border border-purple-100 px-8 py-7 text-center">
        <div className="w-12 h-12 border-4 border-purple-100 border-t-[#4B1E78] rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-black text-slate-900">
          Loading CosmoCartt...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/catalog" element={<CatalogBrowse />} />
          <Route path="/catalog/:category" element={<CatalogBrowse />} />
          <Route path="/catalog/:category/:subcategory" element={<CatalogBrowse />} />
          <Route path="/catalog/:category/:subcategory/:brand" element={<CatalogBrowse />} />
          <Route path="/catalog/:category/:subcategory/:brand/:model" element={<CatalogBrowse />} />

          <Route path="/product/:slug" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <PublicOnlyRoute>
                <VerifyOtp />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />

          <Route path="/orders" element={<Orders />} />

          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/track-order/:id" element={<OrderTracking />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/brands" element={<BrandsPage />} />

          <Route path="/404" element={<NotFound />} />

          <Route path="/:slug" element={<CMSPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
