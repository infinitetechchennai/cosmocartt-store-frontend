import { useState } from "react";
import { 
  TrendingUp, 
  MapPin, 
  Truck, 
  RefreshCw, 
  Shuffle, 
  Megaphone, 
  FileText,  
  CheckCircle2, 
  User, 
  Eye, 
  Bookmark, 
  Mail, 
  Search,
  ExternalLink,
  ChevronRight,
  Plus
} from "lucide-react";

interface OtherViewsProps {
  tab: string;
}

export default function OtherViews({ tab }: OtherViewsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (tab === "reports") {
    return (
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Analytics & Reports</h1>
          <p className="text-sm text-zinc-500 mt-1">Download operational metrics, compute GTV logs, and analyze sales performance.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2"><TrendingUp className="text-[#e31e24] w-5 h-5"/> GTV Velocity Reports</h3>
            <p className="text-sm text-zinc-500">Includes wholesale versus retail split margins, quarterly estimates, and live order conversion rates.</p>
            <button className="bg-black text-white py-2 px-4 rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors">Generate PDF Statement</button>
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">🔄 Retention Reports</h3>
            <p className="text-sm text-zinc-500">Evaluate customer returning frequencies, refund velocities, and support tick rates metrics.</p>
            <button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-2 px-4 rounded-xl text-xs font-semibold transition-colors">Export CSV Data</button>
          </div>
        </div>
      </div>
    );
  }

  if (tab === "delivery-outstation" || tab === "delivery-local") {
    const isOutstation = tab === "delivery-outstation";
    const deliveries = [
      { id: "DL-109", destination: isOutstation ? "Mumbai Delivery Zone 2" : "Chennai (Adyar Hub)", carrier: isOutstation ? "BlueDart Air" : "Dunzo Fast", status: "In Transit", eta: "In 4 Hours" },
      { id: "DL-110", destination: isOutstation ? "Bangalore Wholesale Depot" : "Chennai (T-Nagar Store)", carrier: isOutstation ? "Delhivery Heavy" : "Local Rider", status: "Pending", eta: "Schedules Today" },
      { id: "DL-111", destination: isOutstation ? "Delhi NCR Depot" : "Chennai (Anna Nagar)", carrier: isOutstation ? "Gati Logistics" : "Porter Courier", status: "Delivered", eta: "Completed" }
    ];

    return (
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">
            {isOutstation ? "Outstation Deliveries" : "Local Chennai Deliveries"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isOutstation ? "Oversee long-haul courier integrations and state-to-state cargo linehauls." : "Control same-day hyperlocal dispatches, rider status logs, and Chennai area drop-offs."}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50/50 border-b border-zinc-150 flex items-center gap-2">
            <Truck className="w-5 h-5 text-zinc-500" />
            <span className="text-xs font-bold text-zinc-650 uppercase tracking-wider">Live Delivery Dispatches</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {deliveries.map((d) => (
              <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-50/50 transition-colors gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center border border-zinc-200/50">
                    {isOutstation ? <Truck className="w-5 h-5 text-zinc-600"/> : <MapPin className="w-5 h-5 text-[#e31e24]"/>}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900">{d.destination}</span>
                    <span className="text-xs text-zinc-400 font-mono mt-0.5">{d.carrier} • Tracking ID: {d.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-semibold text-zinc-400 block uppercase">Estimated ETA</span>
                    <span className="text-xs font-bold text-zinc-800">{d.eta}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    d.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    d.status === "In Transit" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "refunds" || tab === "exchanges") {
    const isRefund = tab === "refunds";
    const transactions = [
      { id: "RET-401", orderId: "ORD-2026-005", customer: "Anjali Gupta", reason: "Wrong Size Dispatched", amount: "₹4,500", status: "Approved" },
      { id: "RET-402", orderId: "ORD-2026-002", customer: "Vikram Singh", reason: "Item Defect", amount: "₹2,499", status: "Initiated" }
    ];

    return (
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">{isRefund ? "Refund Requests" : "Exchanges Console"}</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isRefund ? "Issue money back to banking partners, check credit memos, and handle dispute audits." : "Log reverse pickups, process garment size swaps, and coordinate warehouse reissue batches."}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50/50 border-b border-zinc-150 flex items-center gap-2">
            {isRefund ? <RefreshCw className="w-4 h-4 text-zinc-500"/> : <Shuffle className="w-4 h-4 text-zinc-500"/>}
            <span className="text-xs font-bold text-zinc-650 uppercase tracking-widest">{isRefund ? "Settled Return Clearances" : "Swap Queue"}</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {transactions.map((t) => (
              <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-50/50 transition-colors gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900">{t.customer}</span>
                    <span className="text-xs text-zinc-400 font-mono">({t.orderId})</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">Reason: {t.reason}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-zinc-400 block uppercase">{isRefund ? "GTV Retracted" : "Item Value"}</span>
                    <span className="text-sm font-bold text-zinc-900 font-mono">{t.amount}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    t.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "campaigns") {
    const campaigns = [
      { id: "C-01", name: "Seven Summer Splash Outstation Mega Promo", channel: "WhatsApp Marketing", conversions: 48, status: "Active" },
      { id: "C-02", name: "B2B First Cargo Delivery 10% Credit line boost", channel: "Direct Account Managers", conversions: 12, status: "Planned" }
    ];

    return (
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Marketing Campaigns</h1>
          <p className="text-sm text-zinc-500 mt-1">Design discount banners, run push notification schedules, and watch conversion velocity metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase border rounded px-2 py-0.5 ${
                c.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-50 text-zinc-500 border-zinc-200"
              }`}>
                {c.status}
              </span>

              <div className="space-y-2 text-left pr-16">
                <span className="text-xs text-[#e31e24] font-bold font-mono tracking-widest uppercase">{c.channel}</span>
                <h3 className="font-bold text-zinc-900 text-sm leading-tight">{c.name}</h3>
                <p className="text-xs font-medium text-zinc-400">Total Acquisitions: <span className="text-zinc-900 font-bold">{c.conversions} Orders</span></p>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between">
                <button className="text-xs font-bold text-zinc-900 hover:underline flex items-center gap-1">
                  Optimize Campaign <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "cms") {
    const pagesList = [
      { title: "Summer Catalog Header Banner", lastEdited: "2026-05-24", author: "Sneha Nair", size: "12kb" },
      { title: "B2B Wholesaler Terms of Service", lastEdited: "2026-05-18", author: "Abhishek Sharma", size: "22kb" },
      { title: "Chennai local cash on delivery rules", lastEdited: "2026-05-28", author: "Logesh", size: "8kb" }
    ];

    return (
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Content Management (CMS)</h1>
          <p className="text-sm text-zinc-500 mt-1">Alter mobile app banners, update policy documents, and adjust Chennai delivery messages.</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-zinc-50/50 border-b border-zinc-150 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-650 uppercase tracking-widest">Active CMS Blobs</span>
            <button className="bg-black hover:bg-zinc-900 text-white rounded-lg p-1.5 px-3 text-xs font-bold inline-flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5"/> Create Entry
            </button>
          </div>
          <div className="divide-y divide-zinc-100">
            {pagesList.map((p) => (
              <div key={p.title} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-50/50 transition-colors gap-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-900">{p.title}</span>
                  <span className="text-xs text-zinc-400 mt-0.5">Author Representative: {p.author} • Size: {p.size}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-400 mt-2">Edited {p.lastEdited}</span>
                  <button className="p-1 text-zinc-400 hover:text-zinc-900"><ExternalLink className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 text-center text-zinc-400">
      Select an Active Console Management Tab.
    </div>
  );
}
