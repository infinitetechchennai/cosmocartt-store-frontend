import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderTracking() {
    const { id } = useParams();

    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/orders")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const found = data.orders.find(
                        (o: any) => o._id === id
                    );

                    setOrder(found);
                }
            });
    }, [id]);

    if (!order) {
        return (
            <div className="min-h-screen bg-[#F7F5FB] flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-xl border border-purple-100 px-10 py-8 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-100 animate-pulse" />
                    <p className="font-bold text-slate-700">
                        Loading order tracking...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F5FB]">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="mb-8">
                    <p className="text-sm text-slate-500">
                        Home / Orders / Tracking
                    </p>

                    <h1 className="text-4xl font-black text-slate-900 mt-2">
                        Track Your Order
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Stay updated with your package journey.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl border border-purple-100 p-6 sm:p-8">

                        <div className="flex items-center justify-between gap-4 border-b border-purple-100 pb-5 mb-6">
                            <div>
                                <p className="text-xs font-black text-purple-600 uppercase tracking-[0.2em]">
                                    Order Number
                                </p>

                                <h2 className="text-2xl font-black text-[#6F2DBD] mt-1">
                                    {order.orderNumber}
                                </h2>
                            </div>

                            <span className="bg-purple-50 text-purple-700 border border-purple-100 px-4 py-2 rounded-full text-sm font-bold">
                                In Progress
                            </span>
                        </div>

                        <div className="space-y-0">
                            {order.trackingTimeline?.map((step: any, index: number) => {
                                const isLast = index === order.trackingTimeline.length - 1;

                                return (
                                    <div key={index} className="relative flex gap-5 pb-8">

                                        {!isLast && (
                                            <div className="absolute left-[17px] top-9 w-0.5 h-full bg-purple-100" />
                                        )}

                                        <div className="relative z-10 w-9 h-9 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center text-green-700 font-black">
                                            ✓
                                        </div>

                                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                                            <h3 className="font-black text-slate-900">
                                                {step.status}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1">
                                                {new Date(step.date).toLocaleString()}
                                            </p>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                    </div>

                    <div className="space-y-5">

                        <div className="bg-white rounded-[2rem] shadow-lg border border-purple-100 p-6">
                            <p className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-2">
                                Shipment
                            </p>

                            <h3 className="text-xl font-black text-slate-900">
                                Package Status
                            </h3>

                            <div className="mt-5 bg-purple-50 rounded-2xl p-4 border border-purple-100">
                                <p className="text-sm text-slate-500">
                                    Current Status
                                </p>

                                <p className="font-bold text-purple-700 mt-1">
                                    {order.trackingTimeline?.[order.trackingTimeline.length - 1]?.status || "Processing"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-lg border border-purple-100 p-6">
                            <p className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-2">
                                Courier Info
                            </p>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Courier</span>
                                    <span className="font-bold text-slate-800">CosmoCartt Logistics</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">AWB</span>
                                    <span className="font-bold text-slate-800">Pending</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">Delivery</span>
                                    <span className="font-bold text-slate-800">3 - 5 days</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <Footer />
        </div>
    );
}