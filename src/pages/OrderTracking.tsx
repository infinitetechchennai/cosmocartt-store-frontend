import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderTracking() {

    const { id } = useParams();

    const [order, setOrder] =
        useState<any>(null);

    useEffect(() => {

        fetch(
            "http://localhost:5000/api/orders"
        )
            .then((res) => res.json())
            .then((data) => {

                if (data.success) {

                    const found =
                        data.orders.find(
                            (o: any) =>
                                o._id === id
                        );

                    setOrder(found);
                }

            });

    }, [id]);

    if (!order) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold mb-2">
                    Track Order
                </h1>

                <p className="text-zinc-500 mb-8">
                    {order.orderNumber}
                </p>

                <div className="bg-white rounded-2xl border p-8">

                    {order.trackingTimeline?.map(
                        (
                            step: any,
                            index: number
                        ) => (

                            <div
                                key={index}
                                className="flex gap-4 mb-6"
                            >

                                <div
                                    className="w-4 h-4 rounded-full bg-green-500 mt-1"
                                />

                                <div>

                                    <h3 className="font-semibold">
                                        {step.status}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {new Date(
                                            step.date
                                        ).toLocaleString()}
                                    </p>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </div>

            <Footer />

        </div>

    );
}