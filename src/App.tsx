import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import BackcaseBrands from "./pages/BackcaseBrands";
import BackcaseModels from "./pages/BackcaseModels";
import BrandModels from "./pages/BrandModels";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import ScrollToTop from "./components/ScrollToTop";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import BrandsPage from "./pages/BrandsPage";
import CatalogBrowse from "./pages/CatalogBrowse";
import CMSPage from "./pages/CMSPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
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

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />


        <Route path="/catalog" element={<CatalogBrowse />} />
        <Route path="/catalog/:category" element={<CatalogBrowse />} />
        <Route path="/catalog/:category/:subcategory" element={<CatalogBrowse />} />
        <Route path="/catalog/:category/:subcategory/:brand" element={<CatalogBrowse />} />
        <Route path="/catalog/:category/:subcategory/:brand/:model" element={<CatalogBrowse />} />

        <Route
          path="/brand-models/:brand"
          element={<BrandModels />}
        />

        <Route
          path="/backcase-brands"
          element={<BackcaseBrands />}
        />

        <Route
          path="/backcase-models/:brand/:model"
          element={<BackcaseModels />}
        />

        <Route
  path="/product/:slug"
  element={<ProductDetails />}
/>

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />


        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

        <Route path="/verify-otp" element={<PublicOnlyRoute><VerifyOtp /></PublicOnlyRoute>} />

        <Route
          path="/forgot-password"
          element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>}
        />

        <Route path="/orders" element={<Orders />} />



        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route
          path="/track-order/:id"
          element={<OrderTracking />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/brands"
          element={<BrandsPage />}
        />

        <Route path="/404" element={<NotFound />} />

        <Route path="/:slug" element={<CMSPage />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}