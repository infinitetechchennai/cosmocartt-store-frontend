import { useState } from "react";
import { Order } from "../types";
import { Search, Plus, Trash2, SlidersHorizontal, Layers, CheckCircle, Clock, Ban } from "lucide-react";

interface OrdersViewProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

export default function OrdersView({ orders, setOrders }: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "B2B" | "B2C">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Processing" | "Delivered" | "Cancelled">("All");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || o.type === typeFilter;
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const updateStatus = (id: string, status: "Pending" | "Processing" | "Delivered" | "Cancelled") => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const deleteOrder = (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((o) => o.id !== id));
    }
  };

  const addRandomOrder = () => {
    const clients = [
      { name: "Priya Traders", type: "B2B" as const, min: 25000, max: 95000 },
      { name: "Kushal Kumar", type: "B2C" as const, min: 1200, max: 8000 },
      { name: "Apex Retailers Ltd.", type: "B2B" as const, min: 45000, max: 155000 },
      { name: "Divya Singh", type: "B2C" as const, min: 900, max: 3500 }
    ];

    const pick = clients[Math.floor(Math.random() * clients.length)];
    const amount = Math.floor(Math.random() * (pick.max - pick.min) + pick.min);
    
    const newOrder: Order = {
      id: `ORD-2026-00${orders.length + 1}`,
      customer: pick.name,
      type: pick.type,
      amount,
      status: "Processing",
      date: new Date().toISOString().split("T")[0]
    };

    setOrders([newOrder, ...orders]);
  };

  return (
    <div id="orders-view-container" className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 font-sans">Corporate & Retail Orders</h1>
          <p className="text-sm text-zinc-500 mt-1">Fulfill ongoing logistics, cancel payments, or capture enterprise revenue logs.</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={addRandomOrder}
            className="border border-zinc-200 hover:bg-zinc-50 bg-white text-zinc-800 font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Simulate Random Order
          </button>
        </div>
      </div>

      {/* Filter and settings bar */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-xs">
        {/* Search */}
        <div className="flex-1 w-full flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-150">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search orders by customer or ORD identification ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full py-0.5 text-zinc-800 focus:ring-0"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="B2B">Corporate B2B</option>
            <option value="B2C">Retail B2C</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table layout */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-150 text-left">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Target Customer</th>
                <th className="px-6 py-4">Split Class</th>
                <th className="px-6 py-4">Grand GTV</th>
                <th className="px-6 py-4">Delivery Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 font-medium">
                    No orders qualify for current filters. Add a random order or clear search!
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-900">
                      {order.id}
                    </td>

                    <td className="px-6 py-4 font-medium text-zinc-800">
                      {order.customer}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.type === "B2B" 
                          ? "bg-blue-50 text-blue-600 border border-blue-200" 
                          : "bg-purple-50 text-purple-600 border border-purple-200"
                      }`}>
                        {order.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-zinc-900">
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(order.amount)}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        order.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        order.status === "Processing" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.status === "Delivered" ? "bg-emerald-500" :
                          order.status === "Pending" ? "bg-amber-500" :
                          order.status === "Processing" ? "bg-blue-500" :
                          "bg-red-500"
                        }`}></span>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {/* Dropdown status update triggers */}
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status !== "Delivered" && order.status !== "Cancelled" && (
                          <>
                            <button
                              onClick={() => updateStatus(order.id, "Delivered")}
                              title="Mark Delivered"
                              className="p-1 hover:bg-zinc-100 rounded text-emerald-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(order.id, "Cancelled")}
                              title="Cancel Order"
                              className="p-1 hover:bg-zinc-100 rounded text-red-500"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteOrder(order.id)}
                          title="Purge order trace"
                          className="p-1 hover:bg-zinc-100 rounded hover:text-red-500 text-zinc-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
