import { useState, useEffect } from "react";
import {
  TrendingUp,
  MapPin,
  Truck,
  RefreshCw,
  Shuffle,
  Megaphone,
  FileText,
  ExternalLink
} from "lucide-react";

interface OtherViewsProps {
  tab: string;
}

export default function OtherViews({ tab }: OtherViewsProps) {
  const [refundOrders, setRefundOrders] =
    useState<any[]>([]);

  const [refundLoading, setRefundLoading] =
    useState(false);

  const [exchangeOrders, setExchangeOrders] =
    useState<any[]>([]);

  const [exchangeLoading, setExchangeLoading] =
    useState(false);

  const [deliveryOrders, setDeliveryOrders] =
    useState<any[]>([]);

  const [deliveryLoading, setDeliveryLoading] =
    useState(false);

  const [reportStats, setReportStats] =
    useState<any>({
      revenue: 0,
      orders: 0,
      delivered: 0,
      cancelled: 0,
      refunds: 0,
      exchanges: 0
    });

  useEffect(() => {
    if (tab !== "refunds") return;

    const loadRefunds = async () => {
      setRefundLoading(true);

      try {
        const res =
          await fetch(
            "http://localhost:5000/api/orders"
          );

        const data =
          await res.json();

        const ordersArray =
          Array.isArray(data)
            ? data
            : data.orders || data.data || [];

        const withRefundActivity =
          ordersArray.filter(
            (order: any) =>
              order.refundStatus &&
              order.refundStatus !==
              "Not Requested"
          );

        setRefundOrders(withRefundActivity);
      } catch (error) {
        console.error("Refunds loading error:", error);
      } finally {
        setRefundLoading(false);
      }
    };

    loadRefunds();
  }, [tab]);

  useEffect(() => {
    if (tab !== "exchanges") return;

    const loadExchanges = async () => {
      setExchangeLoading(true);

      try {
        const res =
          await fetch(
            "http://localhost:5000/api/orders"
          );

        const data =
          await res.json();

        const ordersArray =
          Array.isArray(data)
            ? data
            : data.orders || data.data || [];

        const withExchangeActivity =
          ordersArray.filter(
            (order: any) =>
              order.exchangeStatus &&
              order.exchangeStatus !==
              "Not Requested"
          );

        setExchangeOrders(withExchangeActivity);
      } catch (error) {
        console.error("Exchanges loading error:", error);
      } finally {
        setExchangeLoading(false);
      }
    };

    loadExchanges();
  }, [tab]);

  useEffect(() => {
    if (
      tab !== "delivery" &&
      tab !== "local-delivery"
    ) return;

    const isOutstation =
      tab === "delivery";

    const loadDeliveries = async () => {
      setDeliveryLoading(true);

      try {
        const res =
          await fetch(
            "http://localhost:5000/api/orders"
          );

        const data =
          await res.json();

        const ordersArray =
          Array.isArray(data)
            ? data
            : data.orders || data.data || [];

        const filteredOrders =
          ordersArray.filter((order: any) => {
            const city =
              (order.city || "")
                .toLowerCase()
                .trim();

            if (isOutstation) {
              return (
                city !== "chennai" &&
                order.status !== "Cancelled"
              );
            }

            return (
              city === "chennai" &&
              order.status !== "Cancelled"
            );
          });

        setDeliveryOrders(filteredOrders);
      } catch (error) {
        console.error("Delivery loading error:", error);
      } finally {
        setDeliveryLoading(false);
      }
    };

    loadDeliveries();
  }, [tab]);

  useEffect(() => {
    if (tab !== "reports") return;

    const loadReports = async () => {
      try {
        const res =
          await fetch(
            "http://localhost:5000/api/reports/summary"
          );

        const data =
          await res.json();

        if (data.success) {
          setReportStats({
            revenue: data.summary.totalRevenue || 0,
            orders: data.summary.totalOrders || 0,
            delivered: data.summary.delivered || 0,
            cancelled: data.summary.cancelled || 0,
            refunds: data.summary.refunds || 0,
            exchanges: data.summary.exchanges || 0
          });
        }
      } catch (error) {
        console.error("Reports loading error:", error);
      }
    };

    loadReports();
  }, [tab]);

  const decideRefund = async (
    orderId: string,
    decision: "Approved" | "Rejected"
  ) => {
    try {
      const res =
        await fetch(
          `http://localhost:5000/api/orders/${orderId}/refund-decision`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              decision,
              note:
                decision === "Approved"
                  ? "Approved by admin"
                  : "Rejected by admin"
            })
          }
        );

      const data =
        await res.json();

      if (!data.success) {
        alert(data.message || "Could not update refund status");
        return;
      }

      setRefundOrders(
        refundOrders.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );
    } catch (error) {
      console.error("Refund decision failed:", error);
    }
  };

  const decideExchange = async (
    orderId: string,
    decision: "Approved" | "Rejected"
  ) => {
    try {
      const res =
        await fetch(
          `http://localhost:5000/api/orders/${orderId}/exchange-decision`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              decision,
              note:
                decision === "Approved"
                  ? "Approved by admin"
                  : "Rejected by admin"
            })
          }
        );

      const data =
        await res.json();

      if (!data.success) {
        alert(data.message || "Could not update exchange status");
        return;
      }

      setExchangeOrders(
        exchangeOrders.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );
    } catch (error) {
      console.error("Exchange decision failed:", error);
    }
  };

  if (tab === "reports") {
    return (
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">
            Analytics & Reports
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Download operational metrics, compute GTV logs, and analyze sales performance.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <ReportCard label="Revenue" value={`₹${reportStats.revenue.toLocaleString()}`} />
          <ReportCard label="Orders" value={reportStats.orders} />
          <ReportCard label="Delivered" value={reportStats.delivered} color="text-green-600" />
          <ReportCard label="Cancelled" value={reportStats.cancelled} color="text-red-600" />
          <ReportCard label="Refunds" value={reportStats.refunds} color="text-orange-600" />
          <ReportCard label="Exchanges" value={reportStats.exchanges} color="text-amber-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <TrendingUp className="text-[#e31e24] w-5 h-5" />
              Sales Reports
            </h3>

            <p className="text-sm text-zinc-500">
              Export full order, revenue, payment and delivery reports.
            </p>

            <button
              onClick={() => {
                window.location.href =
                  "http://localhost:5000/api/reports/orders.csv";
              }}
              className="bg-black text-white py-2 px-4 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              Export Orders CSV
            </button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <RefreshCw className="text-[#e31e24] w-5 h-5" />
              Refund & Exchange Reports
            </h3>

            <p className="text-sm text-zinc-500">
              Export refund requests, exchange requests and support activity.
            </p>

            <button
              onClick={() => {
                window.location.href =
                  "http://localhost:5000/api/reports/refunds-exchanges.csv";
              }}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-2 px-4 rounded-xl text-xs font-semibold transition-colors"
            >
              Export Refunds & Exchanges CSV
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (
    tab === "delivery" ||
    tab === "local-delivery"
  ) {
    const isOutstation =
      tab === "delivery";

    return (
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">
            {isOutstation
              ? "Outstation Deliveries"
              : "Local Chennai Deliveries"}
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            {isOutstation
              ? "Oversee long-haul courier integrations and state-to-state cargo linehauls."
              : "Control same-day hyperlocal dispatches, rider status logs, and Chennai area drop-offs."}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50/50 border-b border-zinc-150 flex items-center gap-2">
            <Truck className="w-5 h-5 text-zinc-500" />

            <span className="text-xs font-bold text-zinc-650 uppercase tracking-wider">
              Live Delivery Dispatches
            </span>
          </div>

          <div className="divide-y divide-zinc-100">
            {deliveryLoading && (
              <div className="p-8 text-center text-zinc-400 text-sm">
                Loading delivery orders...
              </div>
            )}

            {!deliveryLoading &&
              deliveryOrders.length === 0 && (
                <div className="p-8 text-center text-zinc-400 text-sm">
                  No delivery orders found.
                </div>
              )}

            {!deliveryLoading &&
              deliveryOrders.map((order) => {
                const trackingId =
                  order.awbCode ||
                  order.shipmentId ||
                  order.shiprocketOrderId ||
                  order.orderNumber;

                const carrier =
                  order.courierName ||
                  (isOutstation
                    ? "Courier Pending"
                    : "Local Rider Pending");

                const eta =
                  order.status === "Delivered"
                    ? "Completed"
                    : order.status === "Shipped"
                      ? "In Transit"
                      : "Pending Dispatch";

                return (
                  <div
                    key={order._id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-50/50 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center border border-zinc-200/50">
                        {isOutstation ? (
                          <Truck className="w-5 h-5 text-zinc-600" />
                        ) : (
                          <MapPin className="w-5 h-5 text-[#e31e24]" />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900">
                          {order.city || "Unknown City"}{" "}
                          {order.pincode ? `(${order.pincode})` : ""}
                        </span>

                        <span className="text-xs text-zinc-400 font-mono mt-0.5">
                          {carrier} • Tracking ID: {trackingId}
                        </span>

                        <span className="text-xs text-zinc-500 mt-1">
                          {order.customerName || "Customer"} • {order.orderNumber} • ₹{order.totalAmount || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-semibold text-zinc-400 block uppercase">
                          Estimated ETA
                        </span>

                        <span className="text-xs font-bold text-zinc-800">
                          {eta}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : order.status === "Shipped"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "refunds") {
    return (
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">
            Refund Requests
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Review customer refund requests and approve or reject them.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50/50 border-b border-zinc-150 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-zinc-500" />

            <span className="text-xs font-bold text-zinc-650 uppercase tracking-widest">
              Refund Requests
            </span>
          </div>

          <div className="divide-y divide-zinc-100">
            {refundLoading && (
              <div className="p-8 text-center text-zinc-400 text-sm">
                Loading refund requests...
              </div>
            )}

            {!refundLoading &&
              refundOrders.length === 0 && (
                <div className="p-8 text-center text-zinc-400 text-sm">
                  No refund requests yet.
                </div>
              )}

            {!refundLoading &&
              refundOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-50/50 transition-colors gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900">
                        {order.customerName}
                      </span>

                      <span className="text-xs text-zinc-400 font-mono">
                        (<div className="flex items-center gap-2">

                          <span>
                            {order.orderNumber}
                          </span>

                          {order.bulkOrder && (

                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                              BULK
                            </span>

                          )}

                          {order.customerType === "b2b" && (

                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                              B2B
                            </span>

                          )}

                        </div>)
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 mt-0.5">
                      Reason: {order.refundReason || "-"}
                    </p>

                    {order.refundDecisionNote && (
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Admin note: {order.refundDecisionNote}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-zinc-400 block uppercase">
                        Order Total
                      </span>

                      <span className="text-sm font-bold text-zinc-900 font-mono">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0
                        }).format(order.totalAmount || 0)}
                      </span>
                    </div>

                    <StatusBadge status={order.refundStatus} />

                    {order.refundStatus === "Requested" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            decideRefund(order._id, "Approved")
                          }
                          className="p-1 px-2.5 rounded-lg border border-emerald-100 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold transition-all"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            decideRefund(order._id, "Rejected")
                          }
                          className="p-1 px-2.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 text-xs font-semibold transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "exchanges") {
    return (
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">
            Exchange Requests
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Review customer exchange requests and approve or reject them.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50/50 border-b border-zinc-150 flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-zinc-500" />

            <span className="text-xs font-bold text-zinc-650 uppercase tracking-widest">
              Exchange Requests
            </span>
          </div>

          <div className="divide-y divide-zinc-100">
            {exchangeLoading && (
              <div className="p-8 text-center text-zinc-400 text-sm">
                Loading exchange requests...
              </div>
            )}

            {!exchangeLoading &&
              exchangeOrders.length === 0 && (
                <div className="p-8 text-center text-zinc-400 text-sm">
                  No exchange requests yet.
                </div>
              )}

            {!exchangeLoading &&
              exchangeOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-50/50 transition-colors gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900">
                        {order.customerName}
                      </span>

                      <span className="text-xs text-zinc-400 font-mono">
                        ({order.orderNumber})
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 mt-0.5">
                      Reason: {order.exchangeReason || "-"}
                    </p>

                    {order.exchangeDecisionNote && (
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Admin note: {order.exchangeDecisionNote}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.exchangeStatus} />

                    {order.exchangeStatus === "Requested" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            decideExchange(order._id, "Approved")
                          }
                          className="p-1 px-2.5 rounded-lg border border-emerald-100 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold transition-all"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            decideExchange(order._id, "Rejected")
                          }
                          className="p-1 px-2.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 text-xs font-semibold transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "campaigns") {
    return (
      <PlaceholderView
        title="Campaigns"
        description="Manage promotional campaigns, seasonal offers and homepage marketing sections."
        icon={<Megaphone className="w-5 h-5 text-zinc-500" />}
      />
    );
  }

  if (tab === "cms") {
    return (
      <PlaceholderView
        title="CMS"
        description="Manage About, Contact, Terms, Privacy Policy and FAQ content."
        icon={<FileText className="w-5 h-5 text-zinc-500" />}
      />
    );
  }

  return (
    <div className="p-12 text-center text-zinc-400">
      Select an Active Console Management Tab.
    </div>
  );
}

function ReportCard({
  label,
  value,
  color = "text-zinc-950"
}: {
  label: string;
  value: any;
  color?: string;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4">
      <p className="text-xs text-zinc-400 uppercase">
        {label}
      </p>

      <p className={`text-xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status
}: {
  status: string;
}) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${status === "Approved"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : status === "Rejected"
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
        }`}
    >
      {status}
    </span>
  );
}

function PlaceholderView({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">
          {title}
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          {description}
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-xs flex items-center gap-3">
        {icon}

        <span className="text-sm text-zinc-500">
          This module is ready for final backend wiring.
        </span>

        <ExternalLink className="w-4 h-4 text-zinc-300 ml-auto" />
      </div>
    </div>
  );
}