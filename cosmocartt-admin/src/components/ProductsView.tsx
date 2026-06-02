import { useState } from "react";
import { StockAlert } from "../types";
import { Search, Plus, Trash2, Edit2, Check, RefreshCw } from "lucide-react";

interface ProductsViewProps {
  products: StockAlert[];
  setProducts: (prods: StockAlert[]) => void;
}

export default function ProductsView({ products, setProducts }: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupee = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const saveStock = (id: string, item: StockAlert) => {
    const updatedStock = tempStock;
    const isOut = updatedStock === 0;
    const isLow = updatedStock > 0 && updatedStock <= item.threshold;
    const status = isOut ? "Out of Stock" : isLow ? "Low Stock" : "";

    setProducts(products.map(p => {
      if (p.id === id) {
        return {
          ...p,
          stock: updatedStock,
          status: status as any
        };
      }
      return p;
    }));
    setEditingId(null);
  };

  const incrementStock = (id: string, current: number, step: number) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const nextStock = current + step;
        const isOut = nextStock === 0;
        const isLow = nextStock > 0 && nextStock <= p.threshold;
        const status = isOut ? "Out of Stock" : isLow ? "Low Stock animate-pulse" : "";
        return {
          ...p,
          stock: nextStock,
          status: status as any
        };
      }
      return p;
    }));
  };

  return (
    <div id="products-view-container" className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 font-sans">Corporate Inventory & Products</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage physical clothing apparel listings, adjust low-stock thresholds, and query SKUs.</p>
        </div>
      </div>

      {/* Main Filter & Table list block */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Search Header */}
        <div className="p-4 border-b border-zinc-150 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search items by product SKU details or clothing brand name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full py-1 text-zinc-800 focus:ring-0"
          />
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-150 text-left">
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Ident. SKU Code</th>
                <th className="px-6 py-4 text-center">Remaining Stock</th>
                <th className="px-6 py-4 text-center">Alert Status</th>
                <th className="px-6 py-4 text-right">Adjust Stock Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {filtered.map((item) => {
                const isEditing = editingId === item.id;
                const isUrgent = item.stock <= item.threshold;
                return (
                  <tr key={item.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-zinc-950 text-left">
                      {item.name}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {item.sku}
                    </td>

                    <td className="px-6 py-4 text-center font-mono">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            value={tempStock}
                            onChange={(e) => setTempStock(Math.max(0, Number(e.target.value)))}
                            className="w-16 bg-zinc-50 border border-zinc-200 rounded px-2 py-1 text-xs text-center focus:outline-none"
                          />
                          <button
                            onClick={() => saveStock(item.id, item)}
                            className="bg-zinc-900 border border-black hover:bg-black text-white rounded p-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-2">
                          <span className={`font-bold text-sm ${isUrgent ? "text-red-600 font-extrabold" : "text-zinc-800"}`}>
                            {item.stock}
                          </span>
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setTempStock(item.stock);
                            }}
                            className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider hover:text-black hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {item.status ? (
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                          item.status.includes("Out of Stock") 
                            ? "bg-red-50 text-red-600 border-red-200" 
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }`}>
                          {item.status}
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-xs font-semibold">Healthy (Stock ok)</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {/* Incrementor Buttons */}
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => incrementStock(item.id, item.stock, 5)}
                          className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded px-2.5 py-1 text-xs font-semibold text-zinc-800 font-mono transition-colors"
                        >
                          +5 Stock
                        </button>
                        <button
                          onClick={() => incrementStock(item.id, item.stock, 15)}
                          className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded px-2.5 py-1 text-xs font-semibold text-zinc-800 font-mono transition-colors"
                        >
                          +15 Stock
                        </button>
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
