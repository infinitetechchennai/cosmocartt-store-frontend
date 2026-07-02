import { installFetchCache } from "./utils/installFetchCache";
import { prefetchAppData } from "./utils/prefetchAppData";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { installFetchCache } from "./utils/installFetchCache";
import { prefetchAppData } from "./utils/prefetchAppData";
import App from "./App";
import "./index.css";

installFetchCache();
prefetchAppData();
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CatalogProvider } from "./context/CatalogContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";

installFetchCache();
prefetchAppData();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <CatalogProvider>
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
        </CatalogProvider>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);
