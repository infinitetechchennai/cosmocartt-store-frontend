import { useState } from "react";
import { Order } from "../types";
import {
  Search,
  Trash2,
  SlidersHorizontal,
  CheckCircle,
  Ban
} from "lucide-react";

interface OrdersViewProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

export default function OrdersView({ orders, setOrders }: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const [statusFilter, setStatusFilter] = useState<"All" | "Order Placed" | "Shipped" | "Delivered" | "Cancelled">("All");

  const filteredOrders = orders.filter((o) => {

    const customer =
      o.customerName || "";

    const orderId =
      o._id || "";

    const matchesSearch =
      customer
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      orderId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const createShipment = async (
    orderId: string
  ) => {

    try {

      console.log("STEP 1");

      const response = await fetch(
        `http://localhost:5000/api/shiprocket/create-shipment/${orderId}`
      );

      console.log("STEP 2");

      console.log(
        "STATUS:",
        response.status
      );

      const text =
        await response.text();

      console.log("STEP 3");

      console.log(
        "RAW RESPONSE:",
        text
      );

      const data =
        JSON.parse(text);

      console.log("STEP 4");

      console.log(data);

      if (!data.success) {

        alert(
          JSON.stringify(
            data,
            null,
            2
          )
        );

        return;
      }

      const ordersResponse =
        await fetch(
          "http://localhost:5000/api/orders"
        );

      const ordersData =
        await ordersResponse.json();

      if (ordersData.success) {

        setOrders(
          ordersData.orders
        );

      }



      console.log("STEP 6");

      alert(
        "Shipment created successfully"
      );

      console.log("STEP 7");

    } catch (error) {

      console.log(
        "FAILED HERE"
      );

      console.error(error);

    }

  };


  const updateStatus = async (
    id: string,
    status: string
  ) => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {

        setOrders(
          orders.map((o) =>
            o._id === id
              ? data.order
              : o
          )
        );
      }

    } catch (error) {
      console.error(error);
    }
  };

  const cancelOrder = async (
    id: string
  ) => {

    try {

      const response =
        await fetch(
          `http://localhost:5000/api/orders/cancel/${id}`,
          {
            method: "PUT"
          }
        );

      const data =
        await response.json();

      if (data.success) {

        setOrders(
          orders.map((o) =>
            o._id === id
              ? data.order
              : o
          )
        );

      }

    } catch (error) {

      console.error(error);

    }

  };

  const deleteOrder = async (
    id: string
  ) => {

    if (
      !confirm(
        "Delete this order?"
      )
    ) return;

    try {

      const response =
        await fetch(
          `http://localhost:5000/api/orders/${id}`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      if (!data.success) {

        alert(
          "Delete failed"
        );

        return;

      }

      setOrders(
        orders.filter(
          (o) =>
            o._id !== id
        )
      );

    } catch (error) {

      console.error(error);

    }

  };

  const createSelectedShipments = async () => {

    try {

      await Promise.all(

        selectedOrders
          .filter((id) => {
            const order = orders.find(
              (o) => o._id === id
            );

            return (
              order &&
              !order.shipmentId
            );
          })
          .map(async (id) => {

            await fetch(
              `http://localhost:5000/api/shiprocket/create-shipment/${id}`
            );

          })

      );

      const ordersResponse =
        await fetch(
          "http://localhost:5000/api/orders"
        );

      const ordersData =
        await ordersResponse.json();

      if (ordersData.success) {

        setOrders(
          ordersData.orders
        );

      }

      setSelectedOrders([]);

    } catch (error) {

      console.error(error);

    }

  };

  const deleteSelectedOrders = async () => {

    const deletableIds =
      selectedOrders.filter((id) => {

        const order =
          orders.find(
            (o) => o._id === id
          );

        return (
          order &&
          order.status !== "Delivered"
        );

      });

    await Promise.all(

      deletableIds.map(async (id) => {

        await fetch(
          `http://localhost:5000/api/orders/${id}`,
          {
            method: "DELETE"
          }
        );

      })

    );

    setOrders(
      orders.filter(
        (order) =>
          !deletableIds.includes(
            order._id
          )
      )
    );

    setSelectedOrders([]);
  };

  const exportOrdersCSV = () => {

    const headers = [
      "Order Number",
      "Customer",
      "Email",
      "Status",
      "Payment",
      "Amount",
      "Date"
    ];

    const rows = orders.map((order) => [

      order.orderNumber,

      order.customerName,

      order.email,

      order.status,

      order.paymentStatus,

      order.totalAmount,

      new Date(order.createdAt).toLocaleDateString()

    ]);

    const csvContent = [

      headers.join(","),

      ...rows.map((row) => row.join(","))

    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      "orders.csv";

    link.click();
  };

  // const addRandomOrder = () => {
  //   const clients = [
  //     { name: "Priya Traders", type: "B2B" as const, min: 25000, max: 95000 },
  //     { name: "Kushal Kumar", type: "B2C" as const, min: 1200, max: 8000 },
  //     { name: "Apex Retailers Ltd.", type: "B2B" as const, min: 45000, max: 155000 },
  //     { name: "Divya Singh", type: "B2C" as const, min: 900, max: 3500 }
  //   ];

  //   const pick = clients[Math.floor(Math.random() * clients.length)];
  //   const amount = Math.floor(Math.random() * (pick.max - pick.min) + pick.min);

  //   const newOrder: Order = {
  //     id: `ORD-2026-00${orders.length + 1}`,
  //     customer: pick.name,
  //     type: pick.type,
  //     amount,
  //     status: "Processing",
  //     date: new Date().toISOString().split("T")[0]
  //   };

  //   setOrders([newOrder, ...orders]);
  // };

  return (
    <div id="orders-view-container" className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 font-sans">Corporate & Retail Orders</h1>
          <p className="text-sm text-zinc-500 mt-1">Fulfill ongoing logistics, cancel payments, or capture enterprise revenue logs.</p>
        </div>

        <div className="flex gap-2 shrink-0">
          {/* <button
            onClick={addRandomOrder}
            className="border border-zinc-200 hover:bg-zinc-50 bg-white text-zinc-800 font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Simulate Random Order
          </button> */}
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
        <div className="flex items-center gap-3 flex-wrap">

          <button
            onClick={createSelectedShipments}
            disabled={
              selectedOrders.filter((id) => {
                const order = orders.find(
                  (o) => o._id === id
                );

                return (
                  order &&
                  !order.shipmentId
                );
              }).length === 0
            }
            className="
      px-4
      py-2
      rounded-xl
      bg-[#4B1E78]
      text-white
      text-sm
      disabled:opacity-50
    "
          >
            Create Shipment
  </button>

          <button
            onClick={deleteSelectedOrders}
            disabled={
              selectedOrders.length === 0
            }
            className="
    px-4
    py-2
    rounded-xl
    bg-red-600
    text-white
    text-sm
    disabled:opacity-50
  "
          >
            Delete Selected
</button>

          <button
            onClick={exportOrdersCSV}
            className="
      px-4
      py-2
      rounded-xl
      border
      text-sm
      bg-white
    "
          >
            Export Orders CSV
  </button>

          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as any)
            }
            className="
      bg-zinc-50
      border
      border-zinc-200
      rounded-xl
      px-2.5
      py-1.5
      text-xs
      font-semibold
    "
          >
            <option value="All">All Statuses</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Shipped">Shipped</option>
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

                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders
                        .filter(
                          (o) =>
                            o.status === "Order Placed" &&
                            !o.shipmentId
                        )
                        .length > 0 &&
                      selectedOrders.length ===
                      filteredOrders.filter(
                        (o) =>
                          o.status === "Order Placed" &&
                          !o.shipmentId
                      ).length
                    }
                    onChange={() => {

                      const eligibleOrders =
                        filteredOrders
                          .filter(
                            (o) =>
                              o.status === "Order Placed" &&
                              !o.shipmentId
                          )
                          .map((o) => o._id);

                      const allSelected =
                        eligibleOrders.length > 0 &&
                        eligibleOrders.every(
                          (id) =>
                            selectedOrders.includes(id)
                        );

                      if (allSelected) {

                        setSelectedOrders([]);

                      } else {

                        setSelectedOrders(
                          eligibleOrders
                        );

                      }

                    }}
                  />
                </th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Shipment</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Qty</th>
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
                  <tr key={order._id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-4 py-4">

                      <input
                        type="checkbox"
                        disabled={
                          order.status === "Delivered"
                        }
                        checked={
                          selectedOrders.includes(
                            order._id
                          )
                        }
                        onChange={(e) => {

                          if (e.target.checked) {

                            setSelectedOrders([
                              ...selectedOrders,
                              order._id
                            ]);

                          } else {

                            setSelectedOrders(
                              selectedOrders.filter(
                                (id) =>
                                  id !== order._id
                              )
                            );

                          }

                        }}
                      />

                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-900">
                      {order.orderNumber || order._id.slice(-8)}
                    </td>

                    <td className="px-6 py-4">

                      {order.shipmentId ? (

                        <span
                          className="
        px-2
        py-1
        rounded-full
        text-xs
        bg-green-100
        text-green-700
      "
                        >
                          Created
                        </span>

                      ) : (

                        <span
                          className="
        px-2
        py-1
        rounded-full
        text-xs
        bg-orange-100
        text-orange-700
      "
                        >
                          Pending
                        </span>

                      )}

                    </td>


                    <td className="px-6 py-4 font-medium text-zinc-800">
                      {order.products
                        ?.map((p) => p.name)
                        .join(", ")}
                    </td>

                    <td className="px-6 py-4 font-semibold text-zinc-700">
                      {order.products?.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-zinc-900">
                      {new Intl.NumberFormat(
                        "en-IN",
                        {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0
                        }
                      ).format(order.totalAmount)}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : order.status === "Shipped"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : order.status === "Order Placed"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === "Delivered"
                          ? "bg-emerald-500"
                          : order.status === "Shipped"
                            ? "bg-blue-500"
                            : order.status === "Order Placed"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}></span>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {/* Dropdown status update triggers */}
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status !== "Delivered" && order.status !== "Cancelled" && (
                          <>


                            {order.shipmentId &&
                              order.status === "Order Placed" && (
                                <button
                                  onClick={() =>
                                    updateStatus(
                                      order._id,
                                      "Shipped"
                                    )
                                  }
                                  className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
                                >
                                  Ship
                                </button>
                              )}

                            {order.status === "Shipped" && (
                              <button
                                onClick={() => updateStatus(order._id, "Delivered")}
                                title="Mark Delivered"
                                className="p-1 hover:bg-zinc-100 rounded text-emerald-600"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() =>
                                cancelOrder(order._id)
                              }
                              title="Cancel Order"
                              className="p-1 hover:bg-zinc-100 rounded text-red-500"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {
                          !order.shipmentId &&
                          order.status !== "Cancelled" &&
                          order.status !== "Delivered" && (
                            <button
                              onClick={() =>
                                createShipment(order._id)
                              }
                              className="
        px-2
        py-1
        text-xs
        bg-purple-100
        text-purple-700
        rounded
      "
                            >
                              🚚 Create Shipment
                            </button>
                          )
                        }

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          View
</button>
                        <button
                          onClick={() => deleteOrder(order._id)}
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
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div
            className="
      bg-white
      rounded-xl
      w-full
      max-w-4xl
      max-h-[90vh]
      overflow-y-auto
      p-6
    "
          >

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Order Details
        </h2>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500"
              >
                ✕
        </button>
            </div>

            <div className="space-y-2 mb-6">

              <p>
                <strong>Order ID:</strong>{" "}
                {selectedOrder.orderNumber ||
                  selectedOrder._id}
              </p>

              <p>
                <strong>Customer:</strong>{" "}
                {selectedOrder.customerName}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedOrder.email}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedOrder.status}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  selectedOrder.createdAt
                ).toLocaleString()}
              </p>

              <p>
                <strong>Shipment ID:</strong>{" "}
                {selectedOrder.shipmentId || "-"}
              </p>

              <p>
                <strong>Shiprocket Order ID:</strong>{" "}
                {selectedOrder.shiprocketOrderId || "-"}
              </p>

              <p>
                <strong>AWB Code:</strong>{" "}
                {selectedOrder.awbCode || "-"}
              </p>

              <p>
                <strong>Courier:</strong>{" "}
                {selectedOrder.courierName || "-"}
              </p>

              <p>
                <strong>Tracking URL:</strong>{" "}
                {selectedOrder.trackingUrl ? (
                  <a
                    href={selectedOrder.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open Tracking
                  </a>
                ) : (
                  "-"
                )}
              </p>

              <p>
                <strong>Payment Method:</strong>{" "}
                {selectedOrder.paymentMethod || "-"}
              </p>

              <p>
                <strong>Payment Status:</strong>{" "}
                {selectedOrder.paymentStatus || "-"}
              </p>

              <p>
                <strong>Razorpay Order ID:</strong>{" "}
                {selectedOrder.razorpayOrderId || "-"}
              </p>

              <p>
                <strong>Razorpay Payment ID:</strong>{" "}
                {selectedOrder.razorpayPaymentId || "-"}
              </p>



            </div>

            <h3 className="font-semibold text-lg mb-3">
              Ordered Products
</h3>

            <div className="space-y-3">

              {selectedOrder.products?.map(
                (product, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-4 flex gap-4 items-center"
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />

                    <div className="flex-1">

                      <p className="font-semibold text-zinc-900">
                        {product.name}
                      </p>

                      <p className="text-sm text-zinc-500">
                        Product ID:
            {" "}
                        {product.productId}
                      </p>

                      <p className="text-sm text-zinc-500">
                        Qty: {product.quantity}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-semibold">
                        ₹{product.price}
                      </p>

                      <p className="text-sm text-zinc-500">
                        Total:
            {" "}
            ₹{product.price * product.quantity}
                      </p>



                    </div>

                  </div>
                )
              )}

            </div>

            <div className="mt-6 border-t pt-4">

              <div className="flex justify-between mb-2">
                <span className="text-zinc-500">
                  Items
    </span>

                <span>
                  {selectedOrder.products?.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </span>
              </div>

              {selectedOrder.shipmentId && (
                <p>
                  <strong>Shipment ID:</strong>{" "}
                  {selectedOrder.shipmentId}
                </p>
              )}

              {selectedOrder.shiprocketOrderId && (
                <p>
                  <strong>Shiprocket Order ID:</strong>{" "}
                  {selectedOrder.shiprocketOrderId}
                </p>
              )}

              {/* {/* {selectedOrder.trackingUrl && (

                <p>
                  <strong>Tracking Status:</strong>{" "}
                  {selectedOrder.trackingUrl || "-"}
                </p>
              )}
              {selectedOrder.shippingStatus && (
                <p>
                  <strong>Shipping Status:</strong>{" "}
                  {selectedOrder.shippingStatus || "-"}
                </p> */}
              {/* )}  */}



              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>

                <span>
                  ₹{selectedOrder.totalAmount}
                </span>
              </div>



            </div>

          </div>

        </div>
      )}
    </div>
  );
}
