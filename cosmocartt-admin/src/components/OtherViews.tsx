import { useState, useEffect } from "react";
import StatusBanner from "./StatusBanner";
import {
  TrendingUp,
  MapPin,
  Truck,
  RefreshCw,
  Shuffle,
  Megaphone,
  FileText,
  ExternalLink,
  Plus,
  Calendar,
  TicketPercent,
  Target
} from "lucide-react";
import CMSView from "./CMSView";

interface OtherViewsProps {
  tab: string;
}

export default function OtherViews({ tab }: OtherViewsProps) {
  const [refundOrders, setRefundOrders] =
    useState<any[]>([]);

  const [refundLoading, setRefundLoading] =
    useState(false);

  const [statusMessage, setStatusMessage] =
    useState<{
      type: "success" | "error" | "warning";
      title: string;
      message: string;
    } | null>(null);

  const [campaigns, setCampaigns] =
    useState<any[]>([]);

  const [cmsPages, setCmsPages] =
    useState<any[]>([]);

  const [selectedCMS, setSelectedCMS] =
    useState<any>(null);

  const [showCMSModal, setShowCMSModal] =
    useState(false);

  const [campaignLoading, setCampaignLoading] =
    useState(false);

  const [showCampaignModal, setShowCampaignModal] =
    useState(false);

  const [deleteCampaignId, setDeleteCampaignId] =
    useState<string | null>(null);

  const [campaignForm, setCampaignForm] =
    useState({
      title: "",
      type: "Homepage Banner",
      description: "",
      discountCode: "",
      discountPercentage: 0,
      bannerText: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      status: "Draft"
    });

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

    const loadCampaigns = async () => {

      try {

        setCampaignLoading(true);

        const res =
          await fetch(
            "http://localhost:5000/api/campaigns"
          );

        const data =
          await res.json();

        if (data.success) {

          setCampaigns(
            data.campaigns || []
          );

        }

      } catch (error) {

        console.error(
          "Campaign loading error",
          error
        );

      } finally {

        setCampaignLoading(false);

      }

    };

    loadCampaigns();

    const loadCMSPages = async () => {

      try {

        const res =
          await fetch(
            "http://localhost:5000/api/cms"
          );

        const data =
          await res.json();

        if (data.success) {

          setCmsPages(
            data.pages || []
          );

        }

      } catch (error) {

        console.error(error);

      }

    };

    loadCMSPages();

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

                    {order.refundAmount > 0 && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Refund Amount: ₹{order.refundAmount}
                      </p>
                    )}

                    {order.refundMode && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Refund Mode: {order.refundMode}
                      </p>
                    )}

                    {order.razorpayRefundId && (
                      <p className="text-xs text-green-700 mt-0.5 font-mono">
                        Razorpay Refund ID: {order.razorpayRefundId}
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
      <div className="space-y-6 text-left">
        {statusMessage && (
          <StatusBanner
            type={statusMessage.type}
            title={statusMessage.title}
            message={statusMessage.message}
            onClose={() => setStatusMessage(null)}
          />
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950">
              Campaigns
          </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Manage homepage banners, coupon offers, flash sales and festival campaigns.
          </p>
          </div>

          <button
            onClick={() => setShowCampaignModal(true)}
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800"
          >
            <Plus className="w-4 h-4" />
  New Campaign
</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CampaignStat
            label="Total Campaigns"
            value={campaigns.length}
            icon={<Megaphone />}
          />

          <CampaignStat
            label="Active"
            value={
              campaigns.filter(
                (c) => c.status === "Active"
              ).length
            }
            icon={<Target />}
          />

          <CampaignStat
            label="Scheduled"
            value={
              campaigns.filter(
                (c) => c.status === "Scheduled"
              ).length
            }
            icon={<Calendar />}
          />

          <CampaignStat
            label="Coupon Offers"
            value={
              campaigns.filter(
                (c) => c.type === "Coupon"
              ).length
            }
            icon={<TicketPercent />}
          />
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-zinc-900">
                Campaign Library
            </h3>
              <p className="text-xs text-zinc-400 mt-1">
                All marketing campaigns saved in MongoDB.
            </p>
            </div>

            {campaignLoading && (
              <span className="text-xs text-zinc-400">
                Loading...
              </span>
            )}
          </div>

          <div className="divide-y divide-zinc-100">
            {!campaignLoading &&
              campaigns.length === 0 && (
                <div className="p-10 text-center text-zinc-400 text-sm">
                  No campaigns created yet.
                </div>
              )}

            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="p-5 hover:bg-zinc-50/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-zinc-950">
                        {campaign.title}
                      </h3>

                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold uppercase">
                        {campaign.type}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${campaign.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : campaign.status === "Scheduled"
                            ? "bg-blue-50 text-blue-700"
                            : campaign.status === "Expired"
                              ? "bg-red-50 text-red-700"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                      >
                        {campaign.status}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-500">
                      {campaign.description || "-"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                      <span>
                        Code:{" "}
                        <strong className="text-zinc-700">
                          {campaign.discountCode || "-"}
                        </strong>
                      </span>

                      <span>
                        Discount:{" "}
                        <strong className="text-zinc-700">
                          {campaign.discountPercentage || 0}%
                      </strong>
                      </span>

                      <span>
                        Start: {campaign.startDate || "-"}
                      </span>

                      <span>
                        End: {campaign.endDate || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={campaign.status}
                      onChange={async (e) => {
                        const res = await fetch(
                          `http://localhost:5000/api/campaigns/${campaign._id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                              status: e.target.value
                            })
                          }
                        );

                        const data = await res.json();

                        if (data.success) {
                          setCampaigns(
                            campaigns.map((c) =>
                              c._id === campaign._id
                                ? data.campaign
                                : c
                            )
                          );
                        }
                      }}
                      className="border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white"
                    >
                      <option>Draft</option>
                      <option>Active</option>
                      <option>Scheduled</option>
                      <option>Expired</option>
                    </select>

                    <button
                      onClick={() =>
                        setDeleteCampaignId(campaign._id)
                      }
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Delete
                  </button>
                  </div>
                </div>

                {campaign.bannerText && (
                  <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#e31e24] text-white p-4">
                    <p className="text-sm font-bold">
                      {campaign.bannerText}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showCampaignModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-zinc-950">
                Create Campaign
      </h2>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <input
                  placeholder="Campaign Title"
                  value={campaignForm.title}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      title: e.target.value
                    })
                  }
                  className="border rounded-xl px-4 py-3 text-sm"
                />

                <select
                  value={campaignForm.type}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      type: e.target.value
                    })
                  }
                  className="border rounded-xl px-4 py-3 text-sm"
                >
                  <option>Homepage Banner</option>
                  <option>Flash Sale</option>
                  <option>Coupon</option>
                  <option>Festival Offer</option>
                  <option>Email Campaign</option>
                </select>

                <input
                  placeholder="Discount Code"
                  value={campaignForm.discountCode}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      discountCode: e.target.value
                    })
                  }
                  className="border rounded-xl px-4 py-3 text-sm"
                />

                <input
                  type="number"
                  placeholder="Discount %"
                  value={campaignForm.discountPercentage}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      discountPercentage: Number(e.target.value)
                    })
                  }
                  className="border rounded-xl px-4 py-3 text-sm"
                />

                <input
                  type="date"
                  value={campaignForm.startDate}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      startDate: e.target.value
                    })
                  }
                  className="border rounded-xl px-4 py-3 text-sm"
                />

                <input
                  type="date"
                  value={campaignForm.endDate}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      endDate: e.target.value
                    })
                  }
                  className="border rounded-xl px-4 py-3 text-sm"
                />

                <textarea
                  placeholder="Description"
                  value={campaignForm.description}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      description: e.target.value
                    })
                  }
                  className="md:col-span-2 border rounded-xl px-4 py-3 text-sm min-h-[90px]"
                />

                <textarea
                  placeholder="Banner Text"
                  value={campaignForm.bannerText}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      bannerText: e.target.value
                    })
                  }
                  className="md:col-span-2 border rounded-xl px-4 py-3 text-sm min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="px-5 py-2.5 rounded-xl border text-sm font-bold"
                >
                  Cancel
        </button>

                <button
                  onClick={async () => {
                    if (!campaignForm.title.trim()) return;

                    const res = await fetch(
                      "http://localhost:5000/api/campaigns",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(campaignForm)
                      }
                    );

                    const data = await res.json();

                    if (data.success) {
                      setCampaigns([
                        data.campaign,
                        ...campaigns
                      ]);

                      setShowCampaignModal(false);
                      setStatusMessage({
                        type: "success",
                        title: "Campaign Created",
                        message: "The campaign was saved successfully and added to the campaign library."
                      });

                      setCampaignForm({
                        title: "",
                        type: "Homepage Banner",
                        description: "",
                        discountCode: "",
                        discountPercentage: 0,
                        bannerText: "",
                        startDate: new Date().toISOString().slice(0, 10),
                        endDate: "",
                        status: "Draft"
                      });
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-bold"
                >
                  Save Campaign
        </button>
              </div>
            </div>
          </div>
        )}

        {deleteCampaignId && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-zinc-950">
                Delete Campaign?
      </h2>

              <p className="text-sm text-zinc-500 mt-2">
                This action cannot be undone.
      </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteCampaignId(null)}
                  className="px-5 py-2.5 rounded-xl border text-sm font-bold"
                >
                  Cancel
        </button>

                <button
                  onClick={async () => {
                    const res = await fetch(
                      `http://localhost:5000/api/campaigns/${deleteCampaignId}`,
                      {
                        method: "DELETE"
                      }
                    );

                    const data = await res.json();

                    if (data.success) {
                      setCampaigns(
                        campaigns.filter(
                          (c) => c._id !== deleteCampaignId
                        )
                      );

                      setDeleteCampaignId(null);
                      setStatusMessage({
                        type: "success",
                        title: "Campaign Deleted",
                        message: "The campaign was removed from the campaign library."
                      });
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold"
                >
                  Delete
        </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  if (tab === "cms") {
    return <CMSView />;
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

function CampaignStat({
  label,
  value,
  icon
}: {
  label: string;
  value: any;
  icon: any;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-zinc-400 uppercase font-bold">
          {label}
        </p>
        <p className="text-2xl font-black text-zinc-950 mt-2">
          {value}
        </p>
      </div>

      <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center">
        <div className="w-5 h-5">
          {icon}
        </div>
      </div>
    </div>
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