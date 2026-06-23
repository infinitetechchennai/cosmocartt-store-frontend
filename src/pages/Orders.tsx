import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/cancel/${orderId}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? data.order : o
        )
      );

      setSelectedOrder(data.order);
    } catch (err) {
      console.error(err);
    }
  };

  const requestRefund = async (
    orderId: string
  ) => {
    const reason = prompt(
      "Reason for refund?"
    );

    if (!reason) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/request-refund`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            reason,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                refundStatus:
                  "Requested",
              }
            : order
        )
      );

      alert(
        "Refund requested successfully"
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/orders/user/${user?._id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch((err) =>
        console.error(err)
      );
  }, [user]);

  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* HEADER */}

        <div className="mb-12">

          <span
            className="
              inline-flex
              px-5
              py-2
              rounded-full
              bg-purple-50
              border
              border-purple-100
              text-[#4B1E78]
              text-sm
              font-semibold
            "
          >
            ORDER HISTORY
          </span>

          <h1
            className="
              mt-5
              text-5xl
              font-black
              tracking-tight
              text-slate-900
            "
          >
            My Orders
          </h1>

          <p className="mt-3 text-slate-500">
            Track, manage and review all your purchases.
          </p>

        </div>

        {/* EMPTY */}

        {orders.length === 0 && (

          <div
            className="
              rounded-[38px]
              bg-gradient-to-br
              from-[#15052b]
              via-[#2B1055]
              to-[#4B1E78]
              p-16
              text-center
              text-white
              shadow-[0_25px_70px_rgba(40,10,80,0.14)]
            "
          >

            <div className="text-7xl mb-6">
              📦
            </div>

            <h2 className="text-3xl font-black">
              No Orders Yet
            </h2>

            <p className="mt-3 text-purple-200">
              Start shopping premium products now.
            </p>

            <Link
              to="/products"
              className="
                inline-block
                mt-8
                px-8
                py-4
                rounded-2xl
                bg-white
                text-[#4B1E78]
                font-semibold
              "
            >
              Start Shopping
            </Link>

          </div>
        )}

        {/* ORDERS */}

        <div className="space-y-8">

          {orders.map((order) => (

            <div
              key={order._id}
              className="
                relative
                overflow-hidden
                rounded-[38px]
                bg-gradient-to-br
                from-[#15052b]
                via-[#2B1055]
                to-[#4B1E78]
                text-white
                shadow-[0_25px_70px_rgba(40,10,80,0.12)]
              "
            >

              {/* GLASS */}

              <div className="absolute inset-0 bg-white/[0.03] border border-white/10" />

              {/* TOP */}

              <div className="relative z-10 p-8 border-b border-white/10">

                <div className="flex flex-col lg:flex-row justify-between gap-6">

                  <div>

                    <p className="text-purple-200 text-sm">
                      Order Number
                    </p>

                    <h3 className="text-2xl font-black mt-2">
                      #
                      {order.orderNumber.slice(
                        -8
                      )}
                    </h3>

                    <p className="text-sm text-purple-200 mt-2">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "No date"}
                    </p>

                  </div>

                  {/* STATUS */}

                  <div>

                    <span
                      className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold

                        ${
                          order.status ===
                          "Delivered"
                            ? "bg-green-500/20 text-green-200"
                            : order.status ===
                              "Processing"
                            ? "bg-yellow-500/20 text-yellow-200"
                            : "bg-blue-500/20 text-blue-200"
                        }
                      `}
                    >
                      {order.status}
                    </span>

                    <p className="mt-3 text-sm text-purple-200">
                      Payment:{" "}
                      {order.paymentStatus}
                    </p>

                  </div>

                </div>

              </div>

              {/* PRODUCTS */}

              <div className="relative z-10 p-8 space-y-4">

                {order.products?.map(
                  (item: any) => (

                    <div
                      key={item.productId}
                      className="
                        bg-white/10
                        backdrop-blur-xl
                        rounded-3xl
                        p-4
                        flex
                        justify-between
                        items-center
                        gap-4
                      "
                    >

                      <div className="flex gap-4 items-center">

                        {/* PRODUCT BOX */}

                        <div
                          className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-white/10
                            flex
                            items-center
                            justify-center
                            text-2xl
                          "
                        >
                          📦
                        </div>

                        <div>

                          <p className="font-semibold">
                            {item.name}
                          </p>

                          <p className="text-sm text-purple-200 mt-1">
                            Qty:{" "}
                            {item.quantity}
                          </p>

                        </div>

                      </div>

                      <p className="font-bold">

                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}

                      </p>

                    </div>
                  )
                )}

              </div>

              {/* TIMELINE */}

              <div className="relative z-10 px-8 pb-6">

                <div className="flex flex-wrap gap-3">

                  {[
                    "Order Placed",
                    "Processing",
                    "Shipped",
                    "Delivered",
                  ].map((step) => {
                    const completed =
                      order.trackingTimeline?.some(
                        (t: any) =>
                          t.status ===
                          step
                      );

                    return (
                      <div
                        key={step}
                        className={`
                          px-4
                          py-2
                          rounded-full
                          text-xs
                          font-medium

                          ${
                            completed
                              ? "bg-white/20 text-white"
                              : "bg-white/5 text-purple-300"
                          }
                        `}
                      >
                        {completed
                          ? "✓"
                          : "○"}{" "}
                        {step}
                      </div>
                    );
                  })}

                </div>

              </div>

              {/* FOOTER */}

              <div
                className="
                  relative
                  z-10
                  p-8
                  border-t
                  border-white/10
                  flex
                  flex-col
                  md:flex-row
                  justify-between
                  gap-6
                "
              >

                <div>

                  <p className="text-purple-200 text-sm">
                    Total Amount
                  </p>

                  <h3 className="text-3xl font-black mt-2">

                    ₹
                    {order.totalAmount?.toLocaleString()}

                  </h3>

                </div>

                {/* BUTTONS */}

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={() =>
                      setSelectedOrder(
                        order
                      )
                    }
                    className="
                      px-6
                      py-3
                      rounded-2xl
                      bg-white
                      text-[#4B1E78]
                      font-semibold
                      hover:scale-105
                      transition-all
                    "
                  >
                    View Details
                  </button>

                  <Link
                    to={`/track-order/${order._id}`}
                    className="
                      px-6
                      py-3
                      rounded-2xl
                      bg-white/10
                      backdrop-blur-xl
                      border
                      border-white/10
                      text-white
                    "
                  >
                    Track Order
                  </Link>

                </div>

              </div>

            </div>
          ))}

        </div>
      </div>
            {/* ORDER DETAILS MODAL */}

      {selectedOrder && (

        <div
          className="
            fixed
            inset-0
            bg-black/60
            backdrop-blur-md
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >

          <div
            className="
              relative
              overflow-hidden
              w-full
              max-w-5xl
              max-h-[92vh]
              overflow-y-auto
              rounded-[40px]
              bg-gradient-to-br
              from-[#15052b]
              via-[#2B1055]
              to-[#4B1E78]
              text-white
              shadow-[0_30px_80px_rgba(20,10,60,0.25)]
            "
          >

            {/* GLASS */}

            <div className="absolute inset-0 bg-white/[0.03] border border-white/10" />

            <div className="relative z-10 p-8">

              {/* HEADER */}

              <div className="flex justify-between items-center mb-8">

                <div>

                  <p className="text-purple-200 text-sm">
                    ORDER DETAILS
                  </p>

                  <h2 className="text-3xl font-black mt-2">
                    #{selectedOrder.orderNumber}
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setSelectedOrder(null)
                  }
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/10
                    hover:bg-white/15
                    text-2xl
                    transition-all
                  "
                >
                  ×
                </button>

              </div>

              {/* INFO GRID */}

              <div className="grid md:grid-cols-2 gap-5 mb-8">

                {[
                  {
                    label: "Status",
                    value: selectedOrder.status,
                  },
                  {
                    label: "Payment Status",
                    value:
                      selectedOrder.paymentStatus,
                  },
                  {
                    label: "Payment Method",
                    value:
                      selectedOrder.paymentMethod,
                  },
                  {
                    label: "Customer",
                    value:
                      selectedOrder.customerName,
                  },
                  {
                    label: "Phone",
                    value:
                      selectedOrder.phone,
                  },
                  {
                    label: "Refund Status",
                    value:
                      selectedOrder.refundStatus ||
                      "Not Requested",
                  },
                ].map((item, index) => (

                  <div
                    key={index}
                    className="
                      bg-white/10
                      backdrop-blur-xl
                      rounded-3xl
                      p-5
                    "
                  >

                    <p className="text-sm text-purple-200">
                      {item.label}
                    </p>

                    <p className="font-semibold mt-2">
                      {item.value}
                    </p>

                  </div>
                ))}

              </div>

              {/* ADDRESS */}

              <div
                className="
                  bg-white/10
                  backdrop-blur-xl
                  rounded-3xl
                  p-6
                  mb-8
                "
              >

                <p className="text-purple-200 text-sm">
                  Delivery Address
                </p>

                <p className="mt-3 leading-relaxed">

                  {selectedOrder.address},{" "}
                  {selectedOrder.city},{" "}
                  {selectedOrder.state}
                  {" - "}
                  {selectedOrder.pincode}

                </p>

              </div>

              {/* PRODUCTS */}

              <div className="mb-8">

                <h3 className="text-xl font-bold mb-5">
                  Products
                </h3>

                <div className="space-y-4">

                  {selectedOrder.products?.map(
                    (item: any) => (

                      <div
                        key={item.productId}
                        className="
                          bg-white/10
                          backdrop-blur-xl
                          rounded-3xl
                          p-5
                          flex
                          justify-between
                          items-center
                          gap-4
                        "
                      >

                        <div className="flex items-center gap-4">

                          <div
                            className="
                              w-16
                              h-16
                              rounded-2xl
                              bg-white/10
                              flex
                              items-center
                              justify-center
                              text-2xl
                            "
                          >
                            📦
                          </div>

                          <div>

                            <p className="font-semibold">
                              {item.name}
                            </p>

                            <p className="text-sm text-purple-200 mt-1">
                              Qty:{" "}
                              {item.quantity}
                            </p>

                            <p className="text-sm text-purple-200">
                              ₹
                              {item.price.toLocaleString()}
                              {" "}each
                            </p>

                          </div>

                        </div>

                        <span className="font-bold text-lg">

                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}

                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* BILLING */}

              <div
                className="
                  bg-white/10
                  backdrop-blur-xl
                  rounded-3xl
                  p-6
                "
              >

                <div className="space-y-4">

                  <div className="flex justify-between text-purple-200">

                    <span>Subtotal</span>

                    <span>
                      ₹
                      {selectedOrder.subtotal?.toLocaleString() ||
                        0}
                    </span>

                  </div>

                  <div className="flex justify-between text-purple-200">

                    <span>Shipping</span>

                    <span>
                      ₹
                      {selectedOrder.shippingCharge?.toLocaleString() ||
                        0}
                    </span>

                  </div>

                  <div className="flex justify-between text-purple-200">

                    <span>Tax</span>

                    <span>
                      ₹
                      {selectedOrder.tax?.toLocaleString() ||
                        0}
                    </span>

                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between">

                    <span className="text-xl font-bold">
                      Grand Total
                    </span>

                    <span className="text-2xl font-black">
                      ₹
                      {selectedOrder.totalAmount?.toLocaleString()}
                    </span>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-6 space-y-3">

                  {(selectedOrder.status ===
                    "Order Placed" ||
                    selectedOrder.status ===
                      "Processing") && (

                    <button
                      onClick={() =>
                        cancelOrder(
                          selectedOrder._id
                        )
                      }
                      className="
                        w-full
                        py-4
                        rounded-2xl
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        font-semibold
                        transition-all
                      "
                    >
                      Cancel Order
                    </button>

                  )}

                  {selectedOrder.status ===
                    "Delivered" &&
                    selectedOrder.refundStatus !==
                      "Requested" && (

                    <button
                      onClick={() =>
                        requestRefund(
                          selectedOrder._id
                        )
                      }
                      className="
                        w-full
                        py-4
                        rounded-2xl
                        bg-white
                        text-[#4B1E78]
                        font-semibold
                        hover:scale-[1.01]
                        transition-all
                      "
                    >
                      Request Refund
                    </button>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      <Footer />

    </div>
  );
}