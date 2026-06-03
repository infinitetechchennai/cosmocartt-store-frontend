import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ShoppingCart, Group, RefreshCw, Layers, ShieldAlert, Zap, Award, Flame, Play } from "lucide-react";
import { TimeFilter, Order, User, StockAlert, BestSeller } from "../types";

interface DashboardViewProps {
  orders: Order[];
  users: User[];
  stockAlerts: StockAlert[];
  bestSellers: BestSeller[];
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
}

export default function DashboardView({
  orders,
  users,
  stockAlerts,
  bestSellers,
  timeFilter,
  setTimeFilter
}: DashboardViewProps) {
  // Option to switch between "Exact Mock Screen (All Zero)" and "Live Active Simulator Mode"
  const [dataMode, setDataMode] = useState<"exact" | "simulated">("exact");

  // Calculate dynamic stats based on dataMode & timeFilter
  const isExact = dataMode === "exact";

  // KPI Calculations
  const totalRevenueVal = isExact
    ? 0
    : orders
      .filter(o => o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.amount, 0);

  const totalOrdersVal = isExact ? 0 : orders.length;
  const totalUsersVal = isExact ? 0 : users.length;
  const totalRefundsVal = isExact ? 0 : orders.filter(o => o.status === "Cancelled").length;

  // Format currencies beautifully in Rupees
  const formatRupee = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 1,
    }).format(num);
  };

  // Recharts Data for "B2B vs B2C Analytics"
  const analyticsDataExact = [
    { name: "Week 1", b2b: 0, b2c: 0 },
    { name: "Week 2", b2b: 0, b2c: 0 },
    { name: "Week 3", b2b: 0, b2c: 0 },
    { name: "Week 4", b2b: 0, b2c: 0 },
  ];

  const analyticsDataSimulated = [
    { name: "Week 1", b2b: 45000, b2c: 12500 },
    { name: "Week 2", b2b: 62000, b2c: 18400 },
    { name: "Week 3", b2b: 85000, b2c: 32000 },
    { name: "Week 4", b2b: 110000, b2c: 41200 },
  ];

  const currentAnalyticsData = isExact ? analyticsDataExact : analyticsDataSimulated;

  // Delivery Stats donut
  // In the exact mock from user screenshot, there are only "Pending (2)" which represents a full red circle.
  // In simulated we can have Pending (2), Shipped (5), Delivered (12)
  const deliveryDataExact = [
    { name: "Pending", value: 2, color: "#ef4444" },
  ];

  const deliveryDataSimulated = [
    { name: "Pending", value: 2, color: "#ef4444" },
    { name: "In Transit", value: 4, color: "#3b82f6" },
    { name: "Delivered", value: 14, color: "#10b981" },
  ];

  const currentDeliveryData = isExact ? deliveryDataExact : deliveryDataSimulated;
  const totalDeliveriesCount = currentDeliveryData.reduce((sum, d) => sum + d.value, 0);

  const filterOptions: TimeFilter[] = ["Today", "Weekly", "Monthly", "All"];

  return (
    <div id="dashboard-view-container" className="space-y-6">

      {/* Top action row with Title, subtitle and simulation filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Live operational overview.</p>
        </div>

        {/* View Mode & Filter Controller */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Exact Mock Mode vs Simulated Data Toggle Button */}
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-semibold">
            <button
              id="mode-toggle-exact"
              onClick={() => setDataMode("exact")}
              className={`px-3 py-1.5 rounded-lg transition-all ${isExact
                ? "bg-white text-zinc-800 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
                }`}
            >
              Exact Mock (Img)
            </button>
            <button
              id="mode-toggle-simulated"
              onClick={() => setDataMode("simulated")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${!isExact
                ? "bg-red-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
                }`}
            >
              <Zap className="w-3 h-3" /> Live Simulator
            </button>
          </div>

          {/* TimePeriod filters in rounded border row */}
          <div className="flex items-center border border-zinc-200 bg-white rounded-xl p-1 text-sm font-semibold shadow-xs">
            {filterOptions.map((filter) => {
              const isActive = timeFilter === filter;
              return (
                <button
                  key={filter}
                  id={`time-filter-btn-${filter.toLowerCase()}`}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-1.5 rounded-lg transition-all duration-200 ${isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                    }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Revenue */}
        <div id="kpi-total-revenue" className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">Total Revenue</span>
            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {isExact ? "₹0.0" : formatRupee(totalRevenueVal)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm select-none">
            <span className="text-white text-xl font-bold">₹</span>
          </div>
        </div>

        {/* Total Orders */}
        <div id="kpi-total-orders" className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">Total Orders</span>
            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {totalOrdersVal}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-[22px] h-[22px] text-white" />
          </div>
        </div>

        {/* Total Users */}
        <div id="kpi-total-users" className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">Total Users</span>
            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {totalUsersVal}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
            <Group className="w-[22px] h-[22px] text-white" />
          </div>
        </div>

        {/* Refunds Card */}
        <div id="kpi-refunds" className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">Refunds</span>
            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {totalRefundsVal}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-sm">
            <RefreshCw className="w-[22px] h-[22px] text-white" />
          </div>
        </div>

      </div>

      {/* Row 1 Analytics & Delivery stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* B2B vs B2C Analytics Area Chart */}
        <div id="card-b2b-b2c-analytics" className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between pb-4">
            <h3 className="font-bold text-zinc-900 text-base">B2B vs B2C Analytics</h3>
            {!isExact && (
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> B2B Sales
                </span>
                <span className="flex items-center gap-1 text-purple-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> B2C Sales
                </span>
              </div>
            )}
          </div>

          {/* Main Chart Window */}
          <div className="h-[260px] w-full flex items-center justify-center">
            {isExact ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative bg-zinc-50/40 rounded-xl border border-dashed border-zinc-100">
                {/* Simulated Grid Lines like in image */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 py-8">
                  <div className="border-b border-zinc-100 w-full h-0"></div>
                  <div className="border-b border-zinc-100 w-full h-0"></div>
                  <div className="border-b border-zinc-100 w-full h-0"></div>
                  <div className="border-b border-zinc-100 w-full h-0"></div>
                </div>

              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentAnalyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorB2B" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorB2C" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatRupee(Number(value))} />
                  <Area type="monotone" dataKey="b2b" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorB2B)" />
                  <Area type="monotone" dataKey="b2c" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorB2C)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Delivery Stats ring chart */}
        <div id="card-delivery-stats" className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col shadow-xs">
          <div className="flex items-center gap-2 pb-2">
            <span className="text-blue-500">🚚</span>
            <h3 className="font-bold text-zinc-900 text-base">Delivery Stats</h3>
          </div>

          <div className="h-[210px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentDeliveryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {currentDeliveryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Count */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-zinc-900 tracking-tight">
                {totalDeliveriesCount}
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                Total Shipments
              </span>
            </div>
          </div>

          {/* Legends */}
          <div className="mt-auto pt-4 border-t border-zinc-50 flex flex-wrap gap-4 items-center justify-center">
            {currentDeliveryData.map((d, index) => (
              <span key={index} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2 Custom Lists: Stock Alerts & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* STOCK ALERTS card */}
        <div id="card-stock-alerts-list" className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-zinc-900 text-base uppercase tracking-wider">Stock Alerts</h3>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold leading-none">
                {stockAlerts?.length || 0}
              </span>
            </div>
            <span className="text-xs text-orange-500 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> High Urgency
            </span>
          </div>

          <div className="divide-y divide-zinc-100 flex-1 overflow-y-auto max-h-[280px] mt-2 scrollbar-thin">
            {(stockAlerts || []).slice(0, 6).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-left">
                <div className="space-y-0.5 overflow-hidden pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                      {item.sku}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.25 rounded-md ${item.status === "Out of Stock"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-red-600 block">
                    {item.stock} <span className="text-[10px] text-zinc-400 font-medium">left</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 block">Threshold: {item.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BEST SELLERS card */}
        <div id="card-best-sellers-list" className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-zinc-900 text-base uppercase tracking-wider">Best Sellers</h3>
            </div>
            <span className="text-xs text-zinc-400 font-medium">By unit sales</span>
          </div>

          <div className="divide-y divide-zinc-100 flex-1 overflow-y-auto max-h-[280px] mt-2 scrollbar-thin">
            {(bestSellers || []).map((item, index) => (
              <div key={item.id} className="py-3.5 flex items-center gap-4 text-left">
                {/* Ranking number */}
                <span className={`w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${index === 0 ? "bg-amber-500 text-white" :
                  index === 1 ? "bg-zinc-400 text-white" :
                    index === 2 ? "bg-amber-700 text-white" : "bg-zinc-100 text-zinc-500"
                  }`}>
                  {index + 1}
                </span>

                {/* Product Name & Revenue */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{formatRupee(item.revenue)} GTV</p>
                </div>

                {/* Sales Vol Bar Indicator */}
                <div className="text-right">
                  <span className="text-sm font-bold text-zinc-900 block">{item.sales} sold</span>
                  <div className="w-24 bg-zinc-100 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-zinc-900 h-full rounded-full"
                      style={{ width: `${Math.min(100, (item.sales / 150) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
