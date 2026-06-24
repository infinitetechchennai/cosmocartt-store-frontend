import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import StatusBanner from "./StatusBanner";

export default function ExchangesView() {
    const [exchangeOrders, setExchangeOrders] = useState<any[]>([]);
    const [exchangeLoading, setExchangeLoading] = useState(false);

    const [statusMessage, setStatusMessage] =
        useState<{
            type: "success" | "error" | "warning";
            title: string;
            message: string;
        } | null>(null);

    const loadExchanges = async () => {
        try {
            setExchangeLoading(true);

            const res = await fetch("http://localhost:5000/api/orders");
            const data = await res.json();

            if (data.success) {
                const filtered =
                    (data.orders || []).filter(
                        (order: any) =>
                            order.exchangeStatus &&
                            order.exchangeStatus !== "Not Requested"
                    );

                setExchangeOrders(filtered);
            }
        } catch (error) {
            console.error("Exchange loading error:", error);

            setStatusMessage({
                type: "error",
                title: "Loading Failed",
                message: "Could not load exchange requests."
            });
        } finally {
            setExchangeLoading(false);
        }
    };

    useEffect(() => {
        loadExchanges();
    }, []);

    const decideExchange = async (
        orderId: string,
        decision: "Approved" | "Rejected"
    ) => {
        try {
            const res = await fetch(
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
                                ? "Exchange approved and replacement order created."
                                : "Exchange rejected by admin."
                    })
                }
            );

            const data = await res.json();

            if (!data.success) {
                setStatusMessage({
                    type: "error",
                    title: "Exchange Update Failed",
                    message:
                        data.message ||
                        "Could not update exchange request."
                });

                return;
            }

            await loadExchanges();

            setStatusMessage({
                type: "success",
                title:
                    decision === "Approved"
                        ? "Exchange Approved"
                        : "Exchange Rejected",
                message:
                    decision === "Approved"
                        ? "Replacement order was created successfully."
                        : "Exchange request was rejected successfully."
            });
        } catch (error) {
            console.error("Exchange decision error:", error);

            setStatusMessage({
                type: "error",
                title: "Exchange Update Failed",
                message: "Something went wrong while updating exchange."
            });
        }
    };

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

            <div>
                <h1 className="text-2xl font-bold text-zinc-950">
                    Exchange Requests
        </h1>

                <p className="text-sm text-zinc-500 mt-1">
                    Review exchange requests, create replacement orders and track exchange decisions.
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

                    {!exchangeLoading && exchangeOrders.length === 0 && (
                        <div className="p-8 text-center text-zinc-400 text-sm">
                            No exchange requests yet.
                        </div>
                    )}

                    {!exchangeLoading &&
                        exchangeOrders.map((order) => (
                            <div
                                key={order._id}
                                className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between hover:bg-zinc-50/50 transition-colors gap-4"
                            >
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-zinc-900">
                                            {order.customerName}
                                        </span>

                                        <span className="text-xs text-zinc-400 font-mono">
                                            ({order.orderNumber})
                    </span>

                                        <StatusBadge status={order.exchangeStatus} />
                                    </div>

                                    <p className="text-xs text-zinc-500 mt-1">
                                        Reason: {order.exchangeReason || "-"}
                                    </p>

                                    {order.exchangeDecisionNote && (
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            Admin note: {order.exchangeDecisionNote}
                                        </p>
                                    )}

                                    {order.replacementOrderId && (
                                        <p className="text-xs text-emerald-700 mt-1 font-mono">
                                            Replacement Order ID: {order.replacementOrderId}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {order.exchangeStatus === "Requested" ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    decideExchange(order._id, "Approved")
                                                }
                                                className="px-3 py-2 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all"
                                            >
                                                Approve
                      </button>

                                            <button
                                                onClick={() =>
                                                    decideExchange(order._id, "Rejected")
                                                }
                                                className="px-3 py-2 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all"
                                            >
                                                Reject
                      </button>
                                        </>
                                    ) : (
                                        <span className="text-xs text-zinc-400 font-semibold">
                                            Decision completed
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const cls =
        status === "Completed" || status === "Approved"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : status === "Rejected"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-amber-50 text-amber-700 border-amber-200";

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}