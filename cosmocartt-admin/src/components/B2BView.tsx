import { useState } from "react";
import { B2BClient } from "../types";
import { Search, Percent, ShieldCheck, ShieldAlert, BadgeInfo, CheckCircle2, Lock, Unlock } from "lucide-react";

interface B2BViewProps {
  b2bClients: B2BClient[];
  setB2bClients: (clients: B2BClient[]) => void;
}

export default function B2BView({ b2bClients, setB2bClients }: B2BViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLimitId, setEditingLimitId] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<number>(0);

  const filteredClients = b2bClients.filter((c) =>
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupeeVal = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const updateStatus = (id: string, status: "Approved" | "Pending" | "Suspended") => {
    setB2bClients(
      b2bClients.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const saveCreditLimit = (id: string) => {
    setB2bClients(
      b2bClients.map((c) => (c.id === id ? { ...c, creditLimit: tempLimit } : c))
    );
    setEditingLimitId(null);
  };

  return (
    <div id="b2b-view-container" className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950 font-sans">B2B Management</h1>
        <p className="text-sm text-zinc-500 mt-1">Configure credit lines, verify corporations, and control wholesale transaction limits.</p>
      </div>

      {/* Grid summarizing balance information */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0B0C10] text-[#ff4b4b] border border-zinc-900 rounded-2xl p-6">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block">Active Accounts</span>
          <span className="text-3xl font-black block mt-2">
            {b2bClients.filter(c => c.status === "Approved").length}
          </span>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Pending Applications</span>
          <span className="text-3xl font-bold text-zinc-900 block mt-2">
            {b2bClients.filter(c => c.status === "Pending").length}
          </span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Total Outstanding Credit</span>
          <span className="text-3xl font-bold text-[#e31e24] block mt-2">
            {formatRupeeVal(b2bClients.reduce((sum, c) => sum + c.outstandingBalance, 0))}
          </span>
        </div>
      </div>

      {/* Corporate Table list */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-150 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search enterprise clients by brand or representative..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full py-1 text-zinc-800 focus:ring-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-150 text-left">
                <th className="px-6 py-4">Company & Agent</th>
                <th className="px-6 py-4">Credit Margin Limit</th>
                <th className="px-6 py-4">Outstanding Bal</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Access Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {filteredClients.map((client) => {
                const isEditing = editingLimitId === client.id;
                return (
                  <tr key={client.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900">{client.companyName}</span>
                        <span className="text-xs text-zinc-400 mt-0.5">Contact: {client.contactName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={tempLimit}
                            onChange={(e) => setTempLimit(Number(e.target.value))}
                            className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 w-28 text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => saveCreditLimit(client.id)}
                            className="bg-emerald-600 text-white rounded px-2 py-1 text-[10px] uppercase font-bold text-center hover:bg-emerald-700"
                          >
                            Set
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-800">
                            {formatRupeeVal(client.creditLimit)}
                          </span>
                          <button
                            onClick={() => {
                              setEditingLimitId(client.id);
                              setTempLimit(client.creditLimit);
                            }}
                            className="text-[10px] font-bold text-blue-500 uppercase hover:underline"
                          >
                            Adjust
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono font-semibold text-zinc-900">
                      {formatRupeeVal(client.outstandingBalance)}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        client.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        client.status === "Suspended" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          client.status === "Approved" ? "bg-emerald-500" :
                          client.status === "Suspended" ? "bg-red-500" : "bg-amber-500"
                        }`}></span>
                        {client.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {/* Operational toggles */}
                      <div className="flex items-center justify-end gap-2">
                        {client.status !== "Approved" && (
                          <button
                            onClick={() => updateStatus(client.id, "Approved")}
                            title="Approve corporate account"
                            className="p-1 px-2.5 rounded-lg border border-emerald-100 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        {client.status === "Approved" && (
                          <button
                            onClick={() => updateStatus(client.id, "Suspended")}
                            title="Suspend wholesale credit"
                            className="p-1 px-2.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <Lock className="w-3.5 h-3.5" /> Suspend
                          </button>
                        )}
                        {client.status === "Suspended" && (
                          <button
                            onClick={() => updateStatus(client.id, "Pending")}
                            title="Unlock back to Pending Review"
                            className="p-1 px-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <Unlock className="w-3.5 h-3.5" /> Unsuspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
