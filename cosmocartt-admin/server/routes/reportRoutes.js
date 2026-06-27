import express from "express";
import { Parser } from "json2csv";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";

const router = express.Router();

const money = (value) => Number(value || 0);

const isCancelled = (order) =>
    String(order.status || "").toLowerCase() === "cancelled";

const isDelivered = (order) =>
    String(order.status || "").toLowerCase() === "delivered";

const isPaidOrder = (order) => {
    const paymentStatus = String(order.paymentStatus || "").toLowerCase();
    const paymentMethod = String(order.paymentMethod || "").toLowerCase();

    if (paymentMethod === "cod") {
        return !isCancelled(order);
    }

    return paymentStatus === "paid" || paymentStatus === "success";
};

const getRange = (range = "all") => {
    const now = new Date();
    const start = new Date(now);

    if (range === "day" || range === "today") {
        start.setHours(0, 0, 0, 0);
        return { start, end: now, group: "hour" };
    }

    if (range === "week" || range === "weekly") {
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return { start, end: now, group: "day" };
    }

    if (range === "month" || range === "monthly") {
        start.setDate(now.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        return { start, end: now, group: "day" };
    }

    return { start: null, end: now, group: "month" };
};

const buildDateQuery = (range) => {
    const { start, end } = getRange(range);

    if (!start) return {};

    return {
        createdAt: {
            $gte: start,
            $lte: end
        }
    };
};

const getCustomerMap = async () => {
    const customers = await Customer.find().lean();
    const customerMap = {};

    customers.forEach((customer) => {
        customerMap[customer._id.toString()] = customer;
    });

    return customerMap;
};

const getCustomerType = (order, customerMap) => {
    if (order.customerType) {
        return order.customerType === "b2b" ? "b2b" : "b2c";
    }

    const customer = customerMap[String(order.userId || "")];

    return customer?.customerType === "b2b" ? "b2b" : "b2c";
};

const makeTimelineKey = (date, group) => {
    const d = new Date(date);

    if (group === "hour") {
        return `${String(d.getHours()).padStart(2, "0")}:00`;
    }

    if (group === "day") {
        return d.toISOString().slice(0, 10);
    }

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const makeTimelineLabel = (key, group) => {
    if (group === "hour") return key;

    if (group === "day") {
        const d = new Date(key);
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short"
        });
    }

    const [year, month] = key.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);

    return d.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric"
    });
};

const buildTimeline = (orders, group) => {
    const map = {};

    orders.forEach((order) => {
        const key = makeTimelineKey(order.createdAt, group);

        if (!map[key]) {
            map[key] = {
                key,
                label: makeTimelineLabel(key, group),
                orders: 0,
                revenue: 0
            };
        }

        map[key].orders += 1;

        if (isPaidOrder(order)) {
            map[key].revenue += money(order.totalAmount);
        }
    });

    return Object.values(map).sort((a, b) =>
        String(a.key).localeCompare(String(b.key))
    );
};

const getProductStats = (orders) => {
    const categoryMap = {};
    const brandMap = {};
    const productMap = {};

    orders.forEach((order) => {
        (order.products || []).forEach((item) => {
            const quantity = Number(item.quantity || 1);
            const revenue = money(item.price) * quantity;
            const brand = item.brand || "Unknown Brand";
            const name = item.name || "Unknown Product";

            brandMap[brand] = brandMap[brand] || {
                name: brand,
                orders: 0,
                quantity: 0,
                revenue: 0
            };

            brandMap[brand].orders += 1;
            brandMap[brand].quantity += quantity;
            brandMap[brand].revenue += revenue;

            productMap[name] = productMap[name] || {
                name,
                quantity: 0,
                revenue: 0
            };

            productMap[name].quantity += quantity;
            productMap[name].revenue += revenue;

            const category = item.category || order.category || "Products";

            categoryMap[category] = categoryMap[category] || {
                name: category,
                quantity: 0,
                revenue: 0
            };

            categoryMap[category].quantity += quantity;
            categoryMap[category].revenue += revenue;
        });
    });

    return {
        topBrands: Object.values(brandMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10),

        topProducts: Object.values(productMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10),

        topCategories: Object.values(categoryMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)
    };
};

router.get(
    "/summary",
    async (req, res) => {
        try {
            const range = req.query.range || req.query.period || "all";
            const dateQuery = buildDateQuery(range);
            const { group } = getRange(range);

            const orders = await Order.find(dateQuery)
                .sort({ createdAt: -1 })
                .lean();

            const allOrders = await Order.find().lean();

            const customers = await Customer.find().lean();
            const customerMap = {};
            customers.forEach((customer) => {
                customerMap[customer._id.toString()] = customer;
            });

            let totalRevenue = 0;
            let codRevenue = 0;
            let onlineRevenue = 0;
            let b2bRevenue = 0;
            let b2cRevenue = 0;

            let b2bOrders = 0;
            let b2cOrders = 0;

            let paidOrders = 0;
            let pendingOrders = 0;
            let delivered = 0;
            let cancelled = 0;

            let refunds = 0;
            let exchanges = 0;

            const paymentMethods = {};
            const orderStatuses = {};

            orders.forEach((order) => {
                const customerType = getCustomerType(order, customerMap);
                const amount = money(order.totalAmount);

                if (customerType === "b2b") {
                    b2bOrders++;
                } else {
                    b2cOrders++;
                }

                if (isDelivered(order)) delivered++;
                if (isCancelled(order)) cancelled++;

                if (order.refundStatus && order.refundStatus !== "Not Requested") {
                    refunds++;
                }

                if (order.exchangeStatus && order.exchangeStatus !== "Not Requested") {
                    exchanges++;
                }

                const status = order.status || "Unknown";
                orderStatuses[status] = (orderStatuses[status] || 0) + 1;

                const paymentMethod = order.paymentMethod || "Unknown";
                paymentMethods[paymentMethod] =
                    (paymentMethods[paymentMethod] || 0) + 1;

                if (isPaidOrder(order)) {
                    paidOrders++;
                    totalRevenue += amount;

                    if (customerType === "b2b") {
                        b2bRevenue += amount;
                    } else {
                        b2cRevenue += amount;
                    }

                    if (String(order.paymentMethod || "").toLowerCase() === "cod") {
                        codRevenue += amount;
                    } else {
                        onlineRevenue += amount;
                    }
                } else if (!isCancelled(order)) {
                    pendingOrders++;
                }
            });

            const newCustomersInRange =
                range === "all"
                    ? customers.length
                    : customers.filter((customer) => {
                          const createdAt = new Date(customer.createdAt);
                          const { start, end } = getRange(range);
                          return start && createdAt >= start && createdAt <= end;
                      }).length;

            const b2bCustomers = customers.filter(
                (customer) => customer.customerType === "b2b"
            ).length;

            const b2cCustomers = customers.filter(
                (customer) => customer.customerType !== "b2b"
            ).length;

            const productStats = getProductStats(orders);
            const timeline = buildTimeline(orders, group);

            const allRevenue = allOrders.reduce((sum, order) => {
                if (isPaidOrder(order)) {
                    return sum + money(order.totalAmount);
                }
                return sum;
            }, 0);

            res.json({
                success: true,
                range,
                summary: {
                    totalOrders: orders.length,
                    paidOrders,
                    pendingOrders,
                    totalRevenue,
                    allTimeRevenue: allRevenue,
                    averageOrderValue:
                        paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0,

                    delivered,
                    cancelled,
                    refunds,
                    exchanges,

                    b2bOrders,
                    b2cOrders,
                    b2bRevenue,
                    b2cRevenue,

                    codRevenue,
                    onlineRevenue,

                    totalCustomers: customers.length,
                    newCustomers: newCustomersInRange,
                    b2bCustomers,
                    b2cCustomers
                },
                charts: {
                    timeline,
                    paymentMethods: Object.entries(paymentMethods).map(
                        ([name, value]) => ({ name, value })
                    ),
                    orderStatuses: Object.entries(orderStatuses).map(
                        ([name, value]) => ({ name, value })
                    ),
                    topBrands: productStats.topBrands,
                    topProducts: productStats.topProducts,
                    topCategories: productStats.topCategories
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.get(
    "/orders.csv",
    async (req, res) => {
        try {
            const orders = await Order.find()
                .sort({ createdAt: -1 })
                .lean();

            const customerMap = await getCustomerMap();

            const rows = orders.map((order) => {
                const customer = customerMap[String(order.userId || "")];

                return {
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    email: order.email,
                    phone: order.phone,
                    customerType:
                        order.customerType ||
                        customer?.customerType ||
                        "b2c",
                    city: order.city,
                    state: order.state,
                    pincode: order.pincode,
                    totalAmount: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: order.paymentStatus,
                    status: order.status,
                    refundStatus: order.refundStatus,
                    exchangeStatus: order.exchangeStatus,
                    createdAt: order.createdAt
                };
            });

            const parser = new Parser();
            const csv = parser.parse(rows);

            res.header("Content-Type", "text/csv");
            res.attachment("orders-report.csv");
            res.send(csv);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.get(
    "/refunds-exchanges.csv",
    async (req, res) => {
        try {
            const orders = await Order.find({
                $or: [
                    {
                        refundStatus: {
                            $ne: "Not Requested"
                        }
                    },
                    {
                        exchangeStatus: {
                            $ne: "Not Requested"
                        }
                    }
                ]
            })
                .sort({ createdAt: -1 })
                .lean();

            const rows = orders.map((order) => ({
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                totalAmount: order.totalAmount,
                refundStatus: order.refundStatus,
                refundReason: order.refundReason,
                refundDecisionNote: order.refundDecisionNote,
                exchangeStatus: order.exchangeStatus,
                exchangeReason: order.exchangeReason,
                exchangeDecisionNote: order.exchangeDecisionNote,
                createdAt: order.createdAt
            }));

            const parser = new Parser();
            const csv = parser.parse(rows);

            res.header("Content-Type", "text/csv");
            res.attachment("refunds-exchanges-report.csv");
            res.send(csv);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

export default router;
