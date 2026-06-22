import Login from "./components/Login";
import SettingsView from "./components/SettingsView";
import { useState, useEffect } from "react";
import {
  TimeFilter,
  User,
  Order,
  B2BClient,
  PaymentTransaction,
  BestSeller,
  Product
} from "./types";
import {
  initialUsers,
  initialOrders,
  initialB2BClients,
  initialTransactions,
  initialBestSellers
} from "./data";



import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import UsersView from "./components/UsersView";
import B2BView from "./components/B2BView";
import OrdersView from "./components/OrdersView";
import PaymentsView from "./components/PaymentsView";
import ProductsView from "./components/ProductsView";
import OtherViews from "./components/OtherViews";

export default function App() {
  // Global Tab navigation state

  const [activeTab, setActiveTab] = useState<string>(
    localStorage.getItem("activeTab") || "dashboard"
  );

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Global Time Period filter selection
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Monthly");

  // Real core reactive data layers
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    console.log("ADMIN ORDERS:", orders);
  }, [orders]);
  const [b2bClients, setB2bClients] = useState<B2BClient[]>(initialB2BClients);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(initialTransactions);
  const [products, setProducts] =
    useState<Product[]>([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {

          setProducts(data.products);

          const brands = [
            ...new Set(
              data.products
                .map(
                  (p: any) => p.brand
                )
                .filter(Boolean)
            )
          ] as string[];



        }
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        console.log("ORDERS FROM API:", data.orders);

        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  const [bestSellers, setBestSellers] = useState<BestSeller[]>(initialBestSellers);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  // Derive active stock alert count
  const stockAlertCount =
    products.filter(p => p.stock <= 10).length;

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            orders={orders}
            users={users}
            products={products}
            bestSellers={bestSellers}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
          />
        );
      case "users":
        return (
          <UsersView
            users={users}
            setUsers={setUsers}
            loggedUser={loggedUser}
          />
        );
      case "b2b":
        return (
          <B2BView
            b2bClients={b2bClients}
            setB2bClients={setB2bClients}
          />
        );
      case "orders":
        return (
          <OrdersView
            orders={orders}
            setOrders={setOrders}
          />
        );
      case "payments":
        return (
          <PaymentsView
            transactions={transactions}
            setTransactions={setTransactions}
          />
        );
      case "products":
        return (
          <ProductsView
            products={products}
            setProducts={setProducts}
          />
        );
      case "settings":
        return (
          <SettingsView
            loggedUser={loggedUser}
            setLoggedUser={setLoggedUser}
          />
        );
        return <OtherViews tab="settings" />;
      default:
        return <OtherViews tab={activeTab} />;
    }
  };

  if (!isAuthenticated) {

    return (

      <Login
        onLogin={(user) => {

          localStorage.setItem(
            "activeTab",
            "dashboard"
          );

          setActiveTab("dashboard");

          setIsAuthenticated(true);

          setLoggedUser(user);

        }}
      />

    );

  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 font-sans">
      {/* Dynamic Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stockAlertCount={stockAlertCount}
        userRole={loggedUser?.role || "staff"}
        userName={loggedUser?.name || "User"}
        userEmail={loggedUser?.email || ""}
        permissions={loggedUser?.permissions || []}
      />

      {/* Main Workspace Frame container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Operational bar */}
        <Header
          userName={loggedUser?.name || "User"}
          userEmail={loggedUser?.email || ""}
        />

        {/* Dynamic Inner views with high-contrast smooth scroll */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-50 via-white to-red-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}
