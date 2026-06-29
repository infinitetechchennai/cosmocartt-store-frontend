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
  Cell,
  BarChart,
  Bar
} from "recharts";
import {
  ShoppingCart,
  Group,
  RefreshCw,
  Layers,
  ShieldAlert,
  Zap,
  CreditCard,
  Package,
  TrendingUp
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

const RANGE_MAP: Record<TimeFilter, string> = {
  Today: "day",
  Weekly: "week",
  Monthly: "month",
  All: "all"
};

const STATUS_COLORS: Record<string, string> = {
  "Order Placed": "#f59e0b",
  Processing: "#3b82f6",
  Shipped: "#8b5cf6",
  Delivered: "#10b981",
  Cancelled: "#ef4444"
};

const PAYMENT_COLORS = [
  "#111827",
  "#6d28d9",
  "#2563eb",
  "#059669",
  "#f59e0b",
  "#ef4444"
];

export default function DashboardView({
  orders,
  users,
  timeFilter,
  setTimeFilter
}: DashboardViewProps) {
  const [reportData, setReportData] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const formatRupee = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(num || 0));
  };

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-IN").format(Number(num || 0));

  const filterOptions: TimeFilter[] = [
    "Today",
    "Weekly",
    "Monthly",
    "All"
  ];

  useEffect(() => {
    const loadReportSummary = async () => {
      try {
        setLoadingReport(true);

        const range = RANGE_MAP[timeFilter] || "all";

        const res = await fetch(
          apiPath(`/api/reports/summary?range=${range}`)
        );

        const data = await res.json();

        if (data.success) {
          setReportData(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingReport(false);
      }
    };

    loadReportSummary();
  }, [timeFilter]);

  const summary = reportData?.summary || {};

  const timeline = reportData?.charts?.timeline || [];

  const paymentMethods =
    reportData?.charts?.paymentMethods || [];

  const orderStatuses =
    (reportData?.charts?.orderStatuses || []).map((item: any) => ({
      ...item,
      color: STATUS_COLORS[item.name] || "#71717a"
    }));

  const topBrands =
    reportData?.charts?.topBrands || [];

  const topProducts =
    reportData?.charts?.topProducts || [];

  const topCategories =
    reportData?.charts?.topCategories || [];

  const analyticsData = [
    {
      name: "Orders",
      B2B: summary.b2bOrders || 0,
      B2C: summary.b2cOrders || 0
    },
    {
      name: "Revenue",
      B2B: summary.b2bRevenue || 0,
      B2C: summary.b2cRevenue || 0
    }
  ];

  const totalDeliveryCount =
    orderStatuses.reduce(
      (sum: number, item: any) => sum + Number(item.value || 0),
      0
    );

  const recentOrders =
    [...orders].slice(0, 5);

  return (
    <div id="dashboard-view-container" className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans">
            Dashboard
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Live operational overview from real orders, customers and payments.
          </p>
        </div>

        <div className="flex items-center border border-zinc-200 bg-white rounded-xl p-1 text-sm font-semibold shadow-sm overflow-x-auto">

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
                className={`px-4 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap ${isActive
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

      {loadingReport && (
        <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-xl px-4 py-3 text-sm font-semibold">
          Refreshing analytics...
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-sm">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Revenue
            </span>

            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {formatRupee(summary.totalRevenue || 0)}
            </span>

            <p className="text-xs text-zinc-400">
              AOV: {formatRupee(summary.averageOrderValue || 0)}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm select-none">
            <span className="text-white text-xl font-bold">
              ₹
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-sm">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Orders
            </span>

            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {formatNumber(summary.totalOrders || 0)}
            </span>

            <p className="text-xs text-zinc-400">
              Paid: {formatNumber(summary.paidOrders || 0)}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-[22px] h-[22px] text-white" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-sm">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Customers
            </span>

            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {formatNumber(summary.totalCustomers || users.length)}
            </span>

            <p className="text-xs text-zinc-400">
              New: {formatNumber(summary.newCustomers || 0)}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
            <Group className="w-[22px] h-[22px] text-white" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex justify-between items-center shadow-sm">
          <div className="text-left space-y-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Pending
            </span>

            <span className="text-2xl font-bold text-zinc-900 tracking-tight">
              {formatNumber(summary.pendingOrders || 0)}
            </span>

            <p className="text-xs text-zinc-400">
              Refunds {summary.refunds || 0} • Exchanges {summary.exchanges || 0}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-[22px] h-[22px] text-white" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between pb-4 gap-4">
            <div>
              <h3 className="font-bold text-zinc-900 text-base">
                Revenue & Orders Trend
              </h3>

              <p className="text-xs text-zinc-400 mt-1">
                Based on selected {timeFilter.toLowerCase()} range.
              </p>
            </div>

            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeline}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0
                }}
              >
                <defs>
                  <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="ordersColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />

                <XAxis
                  dataKey="label"
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
                    name === "revenue"
                      ? formatRupee(Number(value || 0))
                      : formatNumber(Number(value || 0)),
                    name === "revenue" ? "Revenue" : "Orders"
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#revenueColor)"
                  strokeWidth={3}
                />

                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#ordersColor)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="font-bold text-zinc-900 text-base">
                Order Status
              </h3>

              <p className="text-xs text-zinc-400 mt-1">
                Current status split.
              </p>
            </div>

            <Zap className="w-5 h-5 text-amber-500" />
          </div>

          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatuses}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {orderStatuses.map((entry: any) => (
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
                {formatNumber(totalDeliveryCount)}
              </span>

              <span className="text-xs text-zinc-400 font-semibold uppercase">
                Orders
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {orderStatuses.length === 0 && (
              <p className="text-sm text-zinc-400 text-center">
                No order status data.
              </p>
            )}

            {orderStatuses.map((item: any) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-zinc-900">
                B2B vs B2C
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Real order and revenue split.
              </p>
            </div>
            <Group className="w-5 h-5 text-purple-500" />
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: any, name: any, props: any) => {
                    const label = props?.payload?.name;
                    return [
                      label === "Revenue"
                        ? formatRupee(Number(value || 0))
                        : formatNumber(Number(value || 0)),
                      name
                    ];
                  }}
                />
                <Bar dataKey="B2B" fill="#2563eb" radius={[8, 8, 0, 0]} />
                <Bar dataKey="B2C" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-zinc-500" />
            <h3 className="font-bold text-zinc-900">
              Payments
            </h3>
          </div>

          <div className="space-y-3">
            {paymentMethods.length === 0 && (
              <p className="text-sm text-zinc-400">
                No payment data.
              </p>
            )}

            {paymentMethods.map((item: any, index: number) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-zinc-600">
                    {item.name}
                  </span>
                  <span className="font-bold text-zinc-900">
                    {item.value}
                  </span>
                </div>

                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (Number(item.value || 0) /
                          Math.max(
                            1,
                            paymentMethods.reduce(
                              (sum: number, p: any) => sum + Number(p.value || 0),
                              0
                            )
                          )) *
                          100
                      )}%`,
                      backgroundColor:
                        PAYMENT_COLORS[index % PAYMENT_COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-zinc-500" />
            <h3 className="font-bold text-zinc-900">
              Top Brands
            </h3>
          </div>

          <div className="space-y-3">
            {topBrands.length === 0 && (
              <p className="text-sm text-zinc-400">
                No brand data.
              </p>
            )}

            {topBrands.slice(0, 6).map((brand: any) => (
              <div
                key={brand.name}
                className="flex justify-between border-b border-zinc-100 pb-2"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {brand.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Qty {brand.quantity || 0}
                  </p>
                </div>

                <p className="text-sm font-bold text-zinc-900">
                  {formatRupee(brand.revenue || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
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

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-red-500" />

            <h3 className="font-bold text-zinc-900">
              Refund Requests
            </h3>
          </div>

          <p className="text-3xl font-bold text-zinc-900">
            {summary.refunds || 0}
          </p>

          <p className="text-sm text-zinc-500 mt-3">
            Refund requests in selected range.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-500" />

            <h3 className="font-bold text-zinc-900">
              Exchange Requests
            </h3>
          </div>

          <p className="text-3xl font-bold text-zinc-900">
            {summary.exchanges || 0}
          </p>

          <p className="text-sm text-zinc-500 mt-3">
            Exchange requests in selected range.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-4">
            Top Products
          </h3>

          <div className="space-y-3">
            {topProducts.slice(0, 8).map((product: any) => (
              <div
                key={product.name}
                className="flex justify-between border-b border-zinc-100 pb-2"
              >
                <div className="pr-4">
                  <p className="text-sm font-semibold text-zinc-900 line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Qty {product.quantity || 0}
                  </p>
                </div>

                <p className="text-sm font-bold text-zinc-900 whitespace-nowrap">
                  {formatRupee(product.revenue || 0)}
                </p>
              </div>
            ))}

            {topProducts.length === 0 && (
              <p className="text-sm text-zinc-400">
                No product data.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-4">
            Top Categories
          </h3>

          <div className="space-y-3">
            {topCategories.slice(0, 8).map((category: any) => (
              <div
                key={category.name}
                className="flex justify-between border-b border-zinc-100 pb-2"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {category.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Qty {category.quantity || 0}
                  </p>
                </div>

                <p className="text-sm font-bold text-zinc-900">
                  {formatRupee(category.revenue || 0)}
                </p>
              </div>
            ))}

            {topCategories.length === 0 && (
              <p className="text-sm text-zinc-400">
                No category data.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
