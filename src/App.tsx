import {
Routes,
Route
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
return (
<> <ToastContainer
     position="top-right"
     autoClose={3000}
     theme="colored"
   />

```
  <ScrollToTop />

  <Routes>
    <Route
      path="/"
      element={<Home />}
    />

    <Route
      path="/products"
      element={<Products />}
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
  </Routes>
</>
);
}