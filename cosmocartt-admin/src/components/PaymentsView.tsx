import { useState } from "react";
import { PaymentTransaction } from "../types";
import { Search, CreditCard, DollarSign, Wallet, ShieldCheck, Check, AlertCircle } from "lucide-react";

interface PaymentsViewProps {
  transactions: PaymentTransaction[];
  setTransactions: (txns: PaymentTransaction[]) => void;
}

export default function PaymentsView({ transactions, setTransactions }: PaymentsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTxns = transactions.filter((t) =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupee = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const approveTransaction = (id: string) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, status: "Success" } : t))
    );
  };

  return (
    <div id="payments-view-container" className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950 font-sans">Payments & Finance</h1>
        <p className="text-sm text-zinc-500 mt-1">Audit bank transfers, watch transactional gateway histories, and settle credit books.</p>
      </div>

      {/* Grid summarizing balance information */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-semibold block uppercase">Settled Payments</span>
            <span className="text-2xl font-black text-zinc-900 block mt-1.5">
              {formatRupee(transactions.filter(t => t.status === "Success").reduce((sum, t) => sum + t.amount, 0))}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-semibold block uppercase">Unconfirmed Drafts</span>
            <span className="text-2xl font-black text-zinc-900 block mt-1.5">
              {formatRupee(transactions.filter(t => t.status === "Pending").reduce((sum, t) => sum + t.amount, 0))}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-semibold block uppercase">Corporate Credit Split</span>
            <span className="text-2xl font-black text-zinc-900 block mt-1.5">
              37% B2B
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-semibold block uppercase">Gateway Status</span>
            <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Razorpay Operational
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Corporate Table list */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-150 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search auditing traces by payment method or TXN order values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full py-1 text-zinc-800 focus:ring-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-150 text-left">
                <th className="px-6 py-4">Transaction Identification</th>
                <th className="px-6 py-4">Associated Order ID</th>
                <th className="px-6 py-4">Channel Payment Channel</th>
                <th className="px-6 py-4">Transferred Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Approve Capture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {filteredTxns.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-800">
                    {t.id}
                  </td>

                  <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                    {t.orderId}
                  </td>

                  <td className="px-6 py-4 text-zinc-600">
                    {t.method}
                  </td>

                  <td className="px-6 py-4 font-mono font-bold text-zinc-900">
                    {formatRupee(t.amount)}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      t.status === "Success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      t.status === "Failed" ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        t.status === "Success" ? "bg-emerald-500" :
                        t.status === "Failed" ? "bg-red-500" : "bg-amber-500"
                      }`}></span>
                      {t.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    {t.status === "Pending" ? (
                      <button
                        onClick={() => approveTransaction(t.id)}
                        className="bg-zinc-900 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-black"
                      >
                        Confirm Transfer
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-400 font-semibold select-none">Settled</span>
                    )}
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
