import { Routes, Route } from "react-router-dom";

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
import BrandsPage from "./pages/BrandsPage";

/* NEW IMPORT */
import CursorGlow from "./components/CursorGlow";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      {/* GLOBAL CURSOR LIQUID GLOW */}
      <CursorGlow />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/products"
          element={<Products />}
        />

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
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

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
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

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
      </Routes>
    </>
  );
}