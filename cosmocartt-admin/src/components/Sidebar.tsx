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
    <aside id="seven-sidebar" className="w-64 bg-slate-900 text-white flex flex-col h-screen shrink-0 border-r border-slate-800 z-10 select-none overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
      {/* Brand Logo Section */}
      <div className="p-6 pb-2 pt-5 flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Exact recreated Seven Red Globe Logo */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Spherical Red Background */}
              <defs>
                <radialGradient id="redSphere" cx="45%" cy="45%" r="50%">
                  <stop offset="0%" stopColor="#ff4b4b" />
                  <stop offset="70%" stopColor="#d61a1c" />
                  <stop offset="100%" stopColor="#8a0002" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#redSphere)" />
              {/* Bold stylized slash 7 */}
              <path
                d="M32 30 H68 L44 72 H32 L52 38 H32 Z"
                fill="black"
                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              />
            </svg>
          </div>
          <span className="text-xl font-black tracking-[0.14em] text-[#ff4b4b] select-none font-sans flex items-center">
            COSMOCARTT<span className="text-[9px] align-super text-slate-500 ml-0.5 font-normal">®</span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="px-6 my-3">
        <div className="h-[1px] bg-slate-800"></div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg transition-all duration-150 group text-sm font-medium ${isActive
                ? "bg-slate-800 text-white border-l-4 border-[#ff4b4b] rounded-l-none pl-2.5 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {/* Badges for dynamic indicators */}
              {item.id === "products" && stockAlertCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.25 font-bold rounded bg-red-950 text-red-400 border border-red-900/50">
                  {stockAlertCount}
                </span>
              )}

              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-white/50" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile / Admin Footer Info Section */}
      <div className="p-4 mt-auto border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Avatar frame */}
          <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
              alt="Logesh Administrator UI"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col text-left overflow-hidden select-text">
            <span className="text-xs font-semibold text-slate-200 truncate leading-tight">
              {userName}
            </span>

            <span className="text-[10px] text-slate-500 truncate mt-0.5">
              {userEmail}
            </span>

            <span className="text-[10px] text-blue-400 uppercase font-bold mt-0.5">
              {userRole}
            </span>
          </div>
        </div>

        {/* Logout action button */}
        <button
          id="sidebar-logout-btn"
          title="Logout Admin Session"
          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
          onClick={() => setShowLogoutModal(true)}

        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
      {showLogoutModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">

            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Logout
    </h2>

            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to logout from the dashboard?
    </p>

            <div className="flex gap-3">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
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
                        "Content-Type":
                          "application/json"
                      },
                      body: JSON.stringify({
                        status: "Inactive"
                      })
                    }
                  );

                  localStorage.removeItem("token");

                  localStorage.removeItem("user");

                  localStorage.removeItem("activeTab");

                  window.location.reload();

                }}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
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
