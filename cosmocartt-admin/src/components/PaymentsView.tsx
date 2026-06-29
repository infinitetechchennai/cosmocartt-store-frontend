import { apiPath } from "../config/api";
import { useEffect, useState } from "react";
import {
  Search,
  Wallet,
  ShieldCheck,
  Check,
  AlertCircle,
  CreditCard,
  RefreshCw,
  Banknote
} from "lucide-react";

interface PaymentsViewProps {
  transactions?: any[];
  setTransactions?: (txns: any[]) => void;
}

export default function PaymentsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);

      try {
        const res = await fetch(apiPath("/api/orders"));
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Payments loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatRupee = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  const paidOrders = orders.filter(
    (o) =>
      o.paymentStatus === "Paid" &&
      o.status !== "Cancelled"
  );

  const codOrders = orders.filter(
    (o) =>
      o.paymentMethod === "COD" &&
      o.status !== "Cancelled"
  );

  const onlineOrders = paidOrders.filter(
    (o) => o.paymentMethod !== "COD"
  );

  const refundedOrders = orders.filter(
    (o) => o.refundStatus === "Completed"
  );

  const pendingPayments = orders.filter(
    (o) =>
      o.paymentStatus !== "Paid" &&
      o.paymentMethod !== "COD"
  );

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const onlineRevenue = onlineOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  const codRevenue = codOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  const refundedAmount = refundedOrders.reduce(
    (sum, o) => sum + (o.refundAmount || 0),
    0
  );

  const netRevenue = totalRevenue - refundedAmount;

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();

    return (
      (o.orderNumber || "").toLowerCase().includes(q) ||
      (o.customerName || "").toLowerCase().includes(q) ||
      (o.paymentMethod || "").toLowerCase().includes(q) ||
      (o.razorpayPaymentId || "").toLowerCase().includes(q) ||
      (o.razorpayRefundId || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">
          Payments & Finance
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          Monitor revenue, COD collections, Razorpay payments, refunds and settlement records.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <FinanceCard title="Total Revenue" value={formatRupee(totalRevenue)} icon={<Wallet />} color="emerald" />
        <FinanceCard title="Online Revenue" value={formatRupee(onlineRevenue)} icon={<CreditCard />} color="blue" />
        <FinanceCard title="COD Revenue" value={formatRupee(codRevenue)} icon={<Banknote />} color="amber" />
        <FinanceCard title="Refunded" value={formatRupee(refundedAmount)} icon={<RefreshCw />} color="red" />
        <FinanceCard title="Net Revenue" value={formatRupee(netRevenue)} icon={<ShieldCheck />} color="zinc" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniStat label="Paid Orders" value={paidOrders.length} />
        <MiniStat label="COD Orders" value={codOrders.length} />
        <MiniStat label="Refunds Completed" value={refundedOrders.length} />
        <MiniStat label="Pending Online Payments" value={pendingPayments.length} />
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-150 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />

          <input
            type="text"
            placeholder="Search by order number, customer, payment method, payment ID or refund ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full py-1 text-zinc-800 focus:ring-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-150 text-left">
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Refund</th>
                <th className="px-6 py-4">Gateway ID</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    Loading finance records...
                  </td>
                </tr>
              )}

              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    No finance records found.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-zinc-900">
                        {order.orderNumber || order._id}
                      </p>

                      <p className="text-xs text-zinc-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-800">
                        {order.customerName || "-"}
                      </p>

                      <p className="text-xs text-zinc-400">
                        {order.customerType?.toUpperCase() || "B2C"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold">
                        {order.paymentMethod || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-zinc-900">
                      {formatRupee(order.totalAmount)}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={order.paymentStatus || "Pending"} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <StatusBadge status={order.refundStatus || "Not Requested"} />

                        {order.refundAmount > 0 && (
                          <p className="text-xs text-zinc-500">
                            {formatRupee(order.refundAmount)}
                          </p>
                        )}

                        {order.refundMode && (
                          <p className="text-xs text-zinc-400">
                            {order.refundMode}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-[220px]">
                      <p className="font-mono text-[11px] text-zinc-500 truncate">
                        Pay: {order.razorpayPaymentId || "-"}
                      </p>

                      <p className="font-mono text-[11px] text-green-600 truncate mt-1">
                        Refund: {order.razorpayRefundId || "-"}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FinanceCard({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: string;
  icon: any;
  color: "emerald" | "blue" | "amber" | "red" | "zinc";
}) {
  const styles: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    zinc: "bg-zinc-100 text-zinc-600"
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center justify-between">
      <div>
        <span className="text-xs text-zinc-400 font-semibold block uppercase">
          {title}
        </span>

        <span className="text-2xl font-black text-zinc-900 block mt-1.5">
          {value}
        </span>
      </div>

      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles[color]}`}>
        <div className="w-5 h-5">
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4">
      <p className="text-xs uppercase text-zinc-400 font-bold">
        {label}
      </p>

      <p className="text-xl font-black text-zinc-900 mt-2">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status || "Pending";

  const cls =
    normalized === "Paid" ||
      normalized === "Completed" ||
      normalized === "Success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : normalized === "Failed" ||
        normalized === "Rejected" ||
        normalized === "Cancelled"
        ? "bg-red-50 text-red-700 border-red-200"
        : normalized === "Not Requested"
          ? "bg-zinc-50 text-zinc-500 border-zinc-200"
          : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {normalized}
    </span>
  );
}