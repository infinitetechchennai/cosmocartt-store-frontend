import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import {
  WishlistProvider
} from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>

    <AuthProvider>

      <CartProvider>

        <WishlistProvider>

          <App />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />

        </WishlistProvider>

      </CartProvider>

    </AuthProvider>

  </BrowserRouter>
);