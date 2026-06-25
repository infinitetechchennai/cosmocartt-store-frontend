import { apiPath } from "../config/api";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Truck,
  Package,
  CreditCard,
  Banknote
} from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId =
    location.state?.orderId ||
    localStorage.getItem("lastOrderId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!orderId) {
          setLoading(false);
          return;
        }

        const res = await fetch(apiPath("/api/orders"));
        const data = await res.json();

        if (data.success) {
          const found = (data.orders || []).find(
            (item: any) =>
              item._id === orderId ||
              item.orderNumber === orderId
          );

          setOrder(found || null);
        }
      } catch (error) {
        console.error("Order success load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const paymentMethod =
    order?.paymentMethod || location.state?.paymentMethod || "COD";

  const paymentStatus =
    order?.paymentStatus || location.state?.paymentStatus || "Pending";

  const isCOD =
    paymentMethod === "COD";

  const isPaid =
    paymentStatus === "Paid" ||
    paymentStatus === "Completed" ||
    paymentStatus === "Success";

  const paymentCard = isCOD
    ? {
      title: "Payment Status",
      text: "Cash on Delivery Pending",
      subText: "Collect payment at delivery",
      style: "bg-amber-50 border-amber-100 text-amber-700",
      Icon: Banknote
    }
    : isPaid
      ? {
        title: "Payment Status",
        text: "Paid Successfully",
        subText: "Online payment verified",
        style: "bg-green-50 border-green-100 text-green-700",
        Icon: CreditCard
      }
      : {
        title: "Payment Status",
        text: paymentStatus || "Pending",
        subText: "Payment verification pending",
        style: "bg-red-50 border-red-100 text-red-700",
        Icon: CreditCard
      };

  const PaymentIcon = paymentCard.Icon;

  const orderStatus =
    order?.status || "Order Placed";

  const orderNumber =
    order?.orderNumber || orderId || "Order Created";

  return (
    <div className="min-h-screen bg-[#F7F5FB] flex flex-col justify-between">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-16 flex-grow w-full">
        <div className="relative overflow-hidden rounded-[36px] bg-white border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8 md:p-12 text-center">
          <div className="absolute -top-24 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-[0_10px_30px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={52} className="text-green-600" />
              </div>
            </div>

            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Order Confirmed!
            </h1>

            <p className="text-slate-500 mt-3 text-lg max-w-xl mx-auto">
              Thank you for shopping with CosmoCartt. Your order has been placed successfully.
            </p>

            <div className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl px-6 py-4 max-w-md mx-auto">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Order Reference
              </p>

              <p className="text-2xl font-black text-[#6F2DBD] mt-1">
                {loading ? "Loading..." : orderNumber}
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 mt-6 max-w-xl mx-auto shadow-sm">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Truck size={22} className="text-[#4B1E78]" />

                <p className="font-bold text-slate-800 text-lg">
                  Expected Delivery
                </p>
              </div>

              <p className="text-slate-600 font-medium">
                Within 3 - 5 Business Days
              </p>

              <p className="text-sm text-slate-400 mt-1 flex items-center justify-center gap-1.5">
                <Package size={14} />
                Tracking updates will appear once shipment is processed.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4 max-w-xl mx-auto">
              <div className={`border rounded-2xl p-4 shadow-sm ${paymentCard.style}`}>
                <div className="flex items-center justify-center gap-2">
                  <PaymentIcon size={18} />
                  <h4 className="font-bold text-sm">
                    {paymentCard.title}
                  </h4>
                </div>

                <p className="font-black mt-2">
                  {paymentCard.text}
                </p>

                <p className="text-xs mt-1 opacity-80">
                  {paymentCard.subText}
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 shadow-sm">
                <h4 className="font-bold text-slate-700 text-sm">
                  Order Status
                </h4>

                <p className="text-purple-700 font-black mt-1">
                  {orderStatus}
                </p>
              </div>
            </div>

            {order && (
              <div className="mt-5 max-w-xl mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-bold text-slate-800">
                    {paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-500">Total Amount</span>
                  <span className="font-bold text-slate-900">
                    ₹{order.totalAmount || 0}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mt-10 max-w-xl mx-auto">
              <button
                onClick={() => navigate("/orders")}
                className="flex-1 bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white py-4 rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                View My Orders
              </button>

              {order?._id && (
                <button
                  onClick={() => navigate(`/track-order/${order._id}`)}
                  className="flex-1 bg-white border border-purple-200 text-[#6F2DBD] py-4 rounded-2xl font-bold hover:bg-purple-50 hover:scale-[1.02] transition-all duration-300"
                >
                  Track Order
                </button>
              )}

              <button
                onClick={() => navigate("/")}
                className="flex-1 border border-purple-200 text-[#6F2DBD] bg-white py-4 rounded-2xl font-bold hover:bg-purple-50 hover:scale-[1.02] transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>

            {isCOD && (
              <p className="mt-6 text-sm text-amber-600 font-semibold">
                COD orders are confirmed, but payment will be collected during delivery.
              </p>
            )}

            <p className="mt-8 text-sm text-slate-400">
              Thank you for shopping with CosmoCartt ✨
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}