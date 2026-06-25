import { apiPath } from "../config/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  ShoppingCart,
  Group,
  RefreshCw,
  Layers,
  ShieldAlert,
  Zap
} from "lucide-react";
import {
  TimeFilter,
  Order,
  User,
  StockAlert,
  BestSeller
} from "../types";
import { useState, useEffect } from "react";

interface DashboardViewProps {
  orders: Order[];
  users: User[];
  stockAlerts?: StockAlert[];
  bestSellers?: BestSeller[];
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
}

export default function DashboardView({
  orders,
  users,
  stockAlerts = [],
  bestSellers = [],
  timeFilter,
  setTimeFilter
}: DashboardViewProps) {

  const formatRupee = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 1
    }).format(num);
  };

  const totalRevenueVal =
    orders
      .filter(
        (o: any) =>
          o.status !== "Cancelled"
      )
      .reduce(
        (sum: number, o: any) =>
          sum + (o.totalAmount || 0),
        0
      );

  const [reportSummary, setReportSummary] =
    useState<any>(null);

  const totalOrdersVal =
    orders.length;

  const totalUsersVal =
    users.length;

  const pendingOrdersVal =
    orders.filter(
      (o: any) =>
        o.status === "Order Placed" ||
        o.status === "Processing"
    ).length;

  const pendingRefundsVal =
    orders.filter(
      (o: any) =>
        o.refundStatus === "Requested"
    ).length;

  const pendingExchangesVal =
    orders.filter(
      (o: any) =>
        o.exchangeStatus === "Requested"
    ).length;

  const activeOrders =
    orders.filter(
      (o: any) =>
        o.status !== "Cancelled"
    );

  const b2bRevenue =
    reportSummary?.b2bRevenue || 0;

  const b2cRevenue =
    reportSummary?.b2cRevenue || 0;

  const b2bOrders =
    reportSummary?.b2bOrders || 0;

  const b2cOrders =
    reportSummary?.b2cOrders || 0;

  const analyticsData = [
    {
      name: "Orders",
      B2B: b2bOrders,
      B2C: b2cOrders
    },
    {
      name: "Revenue",
      B2B: b2bRevenue,
      B2C: b2cRevenue
    }
  ];

  const currentDeliveryData = [
    {
      name: "Order Placed",
      value: orders.filter((o: any) => o.status === "Order Placed").length,
      color: "#f59e0b"
    },
    {
      name: "Processing",
      value: orders.filter((o: any) => o.status === "Processing").length,
      color: "#3b82f6"
    },
    {
      name: "Shipped",
      value: orders.filter((o: any) => o.status === "Shipped").length,
      color: "#8b5cf6"
    },
    {
      name: "Delivered",
      value: orders.filter((o: any) => o.status === "Delivered").length,
      color: "#10b981"
    },
    {
      name: "Cancelled",
      value: orders.filter((o: any) => o.status === "Cancelled").length,
      color: "#ef4444"
    }
  ].filter(
    item => item.value > 0
  );

  const totalDeliveriesCount =
    currentDeliveryData.reduce(
      (sum, d) => sum + d.value,
      0
    );

  const filterOptions: TimeFilter[] = [
    "Today",
    "Weekly",
    "Monthly",
    "All"
  ];

  const recentOrders =
    [...orders].slice(0, 5);
  useEffect(() => {

    const loadReportSummary = async () => {

      try {

        const res =
          await fetch(
            apiPath("/api/reports/summary")
          );

        const data =
          await res.json();

        if (data.success) {

          setReportSummary(
            data.summary
          );

        }

      } catch (error) {

        console.error(error);

      }

    };

    loadReportSummary();

  }, []);

  return (
    <div id="dashboard-view-container" className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans">
            Dashboard
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Live operational overview.
          </p>
        </div>

        <div className="flex items-center border border-zinc-200 bg-white rounded-xl p-1 text-sm font-semibold shadow-xs">

          {filterOptions.map((filter) => {

            const isActive =
              timeFilter === filter;

            return (
              <button
                key={filter}
                id={`time-filter-btn-${filter.toLowerCase()}`}
                onClick={() =>
                  setTimeFilter(filter)
                }
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div id="kpi-total-revenue" className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Total Revenue
            </span>

            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {formatRupee(totalRevenueVal)}
            </span>
          </div>

          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm select-none">
            <span className="text-white text-xl font-bold">
              ₹
            </span>
          </div>
        </div>

        <div id="kpi-total-orders" className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Total Orders
            </span>

            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {totalOrdersVal}
            </span>
          </div>

          <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-[22px] h-[22px] text-white" />
          </div>
        </div>

        <div id="kpi-total-users" className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Total Users
            </span>

            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {totalUsersVal}
            </span>
          </div>

          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
            <Group className="w-[22px] h-[22px] text-white" />
          </div>
        </div>

        <div id="kpi-pending-orders" className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Pending Orders
            </span>

            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {pendingOrdersVal}
            </span>
          </div>

          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-[22px] h-[22px] text-white" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div id="card-b2b-b2c-analytics" className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">

          <div className="flex items-center justify-between pb-4">
            <h3 className="font-bold text-zinc-900 text-base">
              B2B vs B2C Analytics
            </h3>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                B2B Sales
              </span>

              <span className="flex items-center gap-1 text-purple-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                B2C Sales
              </span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0
                }}
              >
                <defs>
                  <linearGradient id="b2bColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="b2cColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#71717a"
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#71717a"
                  }}
                />

                <Tooltip
                  formatter={(value: any, name: any) => [
                    typeof value === "number"
                      ? value.toLocaleString("en-IN")
                      : value,
                    name
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="B2B"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#b2bColor)"
                  strokeWidth={3}
                />

                <Area
                  type="monotone"
                  dataKey="B2C"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#b2cColor)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div id="card-delivery-status" className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">

          <div className="flex items-center justify-between pb-4">
            <h3 className="font-bold text-zinc-900 text-base">
              Delivery Status
            </h3>

            <Zap className="w-5 h-5 text-amber-500" />
          </div>

          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentDeliveryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {currentDeliveryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-zinc-900">
                {totalDeliveriesCount}
              </span>

              <span className="text-xs text-zinc-400 font-semibold uppercase">
                Orders
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {currentDeliveryData.length === 0 && (
              <p className="text-sm text-zinc-400 text-center">
                No delivery data yet.
              </p>
            )}

            {currentDeliveryData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-zinc-500">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: item.color
                    }}
                  ></span>
                  {item.name}
                </span>

                <span className="font-bold text-zinc-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-zinc-500" />

            <h3 className="font-bold text-zinc-900">
              Recent Orders
            </h3>
          </div>

          <div className="space-y-3">
            {recentOrders.length === 0 && (
              <p className="text-sm text-zinc-400">
                No orders yet.
              </p>
            )}

            {recentOrders.map((order: any) => (
              <div
                key={order._id}
                className="flex items-center justify-between border-b border-zinc-100 pb-3"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {order.customerName || "Customer"}
                  </p>

                  <p className="text-xs text-zinc-400 font-mono">
                    {order.orderNumber}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-900">
                    {formatRupee(order.totalAmount || 0)}
                  </p>

                  <p className="text-xs text-zinc-400">
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-red-500" />

            <h3 className="font-bold text-zinc-900">
              Refund Requests
            </h3>
          </div>

          <div className="space-y-3">
            <p className="text-3xl font-bold text-zinc-900">
              {pendingRefundsVal}
            </p>

            <p className="text-sm text-zinc-500">
              Pending customer refund approvals.
            </p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-500" />

            <h3 className="font-bold text-zinc-900">
              Exchange Requests
            </h3>
          </div>

          <div className="space-y-3">
            <p className="text-3xl font-bold text-zinc-900">
              {pendingExchangesVal}
            </p>

            <p className="text-sm text-zinc-500">
              Pending customer exchange approvals.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}