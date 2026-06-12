import { useState } from "react";
import { Bell, ChevronDown, Settings, ShieldAlert, Award, LogOut, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  userName: string;
  userEmail: string;
}

export default function Header({ userName, userEmail }: HeaderProps) {

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.reload();

  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, text: "High Priority: 6 Stock Alerts triggered, items out of stock.", type: "alert", time: "10m ago" },
    { id: 2, text: "B2B Sumit Traders Credit Approval Pending.", type: "pending", time: "1h ago" },
    { id: 3, text: "2 Refund Requests received for Order ORD-2026-005.", type: "refund", time: "3h ago" },
    { id: 4, text: "System Audit: Daily metrics compiled successfully.", type: "system", time: "1d ago" }
  ];

  return (
    <header id="seven-dashboard-header" className="h-[64px] border-b border-slate-200 bg-white/90 backdrop-blur-md backdrop-blur-sm px-8 flex items-center justify-between z-20 shrink-0 relative">
      {/* Invisible divider or simple notice area on left */}
      <div className="flex items-center gap-3">
        <span className="text-slate-400 font-mono text-[11px] select-none uppercase tracking-[0.12em]">
          COSMOCARTT ADMIN PANEL
        </span>
        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Environment
        </span>
      </div>

      {/* Right side interactions */}
      <div className="flex items-center gap-6">
        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            id="header-notification-bell"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-lg relative"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 text-left">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">Notifications</span>
                <span className="text-[10px] font-bold text-[#ff4b4b] uppercase cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 border-b border-slate-50 hover:bg-slate-50/80 transition-colors flex gap-2.5">
                    {n.type === "alert" ? (
                      <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex flex-col">
                      <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            id="header-profile-dropdown"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
                alt="Account User Profile Logesh"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-sm font-semibold text-slate-800 select-none flex items-center gap-1">
              {userName}
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 text-left">
              <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{userEmail}</p>
              </div>

              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-slate-400" /> Access Privileges
                </button>
                <button className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-400" /> Organization Settings
                </button>
              </div>
              <div className="border-t border-slate-100 mt-1 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
