import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Truck, Package } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-24">

        <div
          className="
            relative
            overflow-hidden
            rounded-[36px]
            bg-white
            border
            border-slate-200
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
            p-12
            text-center
          "
        >

          {/* BACKGROUND GLOW */}

          <div className="absolute -top-24 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl" />

          <div className="relative z-10">

            {/* SUCCESS ICON */}

            <div className="flex justify-center mb-7">
              <div
                className="
                  h-24
                  w-24
                  rounded-full
                  bg-green-100
                  flex
                  items-center
                  justify-center
                "
              >
                <CheckCircle2
                  size={52}
                  className="text-green-600"
                />
              </div>
            </div>

            {/* TITLE */}

            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Order Confirmed
            </h1>

            <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">
              Your purchase has been placed successfully and our team
              has already started processing your order.
            </p>

            {/* ORDER ID */}

            <div
              className="
                mt-8
                bg-slate-50
                border
                border-slate-200
                rounded-3xl
                px-6
                py-5
                max-w-md
                mx-auto
              "
            >
              <p className="text-sm text-slate-500">
                Order Reference
              </p>

              <p className="text-xl font-bold text-[#4B1E78] mt-1">
                {orderId || "ORD-2026-XXXX"}
              </p>
            </div>

            {/* ORDER INFO */}

            <div className="grid md:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  bg-slate-50
                  rounded-2xl
                  py-4
                  border
                "
              >
                <Truck
                  size={20}
                  className="text-[#4B1E78]"
                />
                <span className="font-medium text-slate-700">
                  Delivery in 3–5 Days
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  bg-slate-50
                  rounded-2xl
                  py-4
                  border
                "
              >
                <Package
                  size={20}
                  className="text-[#4B1E78]"
                />
                <span className="font-medium text-slate-700">
                  Tracking Updates Enabled
                </span>
              </div>

            </div>

            {/* BUTTONS */}

            <div className="flex flex-col md:flex-row gap-4 mt-10">

              <button
                onClick={() => navigate("/orders")}
                className="
                  flex-1
                  bg-[#4B1E78]
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  hover:scale-[1.02]
                  hover:shadow-xl
                  transition-all
                "
              >
                View My Orders
              </button>

              <button
                onClick={() => navigate("/")}
                className="
                  flex-1
                  bg-slate-100
                  text-slate-800
                  py-4
                  rounded-2xl
                  font-semibold
                  hover:bg-slate-200
                  transition-all
                "
              >
                Continue Shopping
              </button>

            </div>

            {/* FOOTER NOTE */}

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