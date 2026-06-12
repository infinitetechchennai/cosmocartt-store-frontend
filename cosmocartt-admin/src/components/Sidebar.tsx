import {
  BarChart2,
  Users,
  Briefcase,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  Truck,
  MapPin,
  RefreshCw,
  Shuffle,
  Package,
  Megaphone,
  FileText,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useState } from "react";


interface SidebarProps {
  activeTab: string;
  setActiveTab: any;
  stockAlertCount: number;
  userRole: string;
  userName: string;
  userEmail: string;
  permissions?: string[];
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  stockAlertCount,
  userRole,
  userName,
  userEmail,
  permissions = []
}: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const allMenuItems = [

    { id: "dashboard", label: "Dashboard", icon: BarChart2 },

    { id: "users", label: "Users", icon: Users },

    { id: "b2b", label: "B2B Management", icon: Briefcase },

    { id: "orders", label: "Orders", icon: ShoppingBag },

    { id: "payments", label: "Payments & Finance", icon: CreditCard },

    { id: "reports", label: "Reports", icon: TrendingUp },

    { id: "delivery", label: "Delivery (Outstation)", icon: Truck },

    { id: "local-delivery", label: "Local Delivery", icon: MapPin },

    { id: "refunds", label: "Refunds", icon: RefreshCw },

    { id: "exchanges", label: "Exchanges", icon: Shuffle },

    { id: "products", label: "Products", icon: Package },

    { id: "campaigns", label: "Campaigns", icon: Megaphone },

    { id: "cms", label: "CMS", icon: FileText },

    { id: "settings", label: "Settings", icon: FileText }

  ];

  const menuItems =

    userRole === "admin"

      ? allMenuItems

      : allMenuItems.filter(item =>
        permissions.includes(item.id)
      );
  return (
    <aside
      id="seven-sidebar"
      className="w-72 bg-gradient-to-b from-[#2E1065] via-[#4C1D95] to-[#5B2A86] text-white flex flex-col h-screen shrink-0 border-r border-white/10 z-10 select-none overflow-y-auto"
    >
      {/* Brand */}
      <div className="px-6 py-6 flex justify-center border-b border-white/10">
        <h1 className="text-3xl font-black tracking-wide text-white">
          Cosmo<span className="text-violet-300">Cartt</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium ${isActive
                ? "bg-white/15 border-l-4 border-violet-300 text-white rounded-l-none"
                : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${isActive
                    ? "text-white"
                    : "text-slate-300 group-hover:text-white"
                    }`}
                />
                <span>{item.label}</span>
              </div>

              {item.id === "products" && stockAlertCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-400 text-white font-bold">
                  {stockAlertCount}
                </span>
              )}

              {isActive && (
                <ChevronRight className="w-4 h-4 text-white/60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-black/10 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold truncate">
              {userName}
            </span>

            <span className="text-[10px] text-slate-300 truncate">
              {userEmail}
            </span>

            <span className="text-[10px] uppercase font-bold text-violet-300">
              {userRole}
            </span>
          </div>
        </div>

        <button
          id="sidebar-logout-btn"
          title="Logout"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Logout
          </h2>

            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to logout from the dashboard?
          </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
            </button>

              <button
                onClick={() => {
                  const user = JSON.parse(
                    localStorage.getItem("user") || "{}"
                  );

                  fetch(
                    `http://localhost:5000/api/users/${user._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        status: "Inactive",
                      }),
                    }
                  );

                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  localStorage.removeItem("activeTab");

                  window.location.reload();
                }}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Logout
            </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
