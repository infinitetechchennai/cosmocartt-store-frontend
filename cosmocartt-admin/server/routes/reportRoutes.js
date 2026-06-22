import express from "express";
import { Parser } from "json2csv";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";

const router = express.Router();

const getCustomerMap = async () => {

    const customers =
        await Customer.find().lean();

    const customerMap =
        {};

    customers.forEach((customer) => {

        customerMap[
            customer._id.toString()
        ] = customer;

    });

    return customerMap;

};

router.get(
    "/summary",
    async (req, res) => {

        try {

            const orders =
                await Order.find().sort({
                    createdAt: -1
                }).lean();

            const customerMap =
                await getCustomerMap();

            let b2bOrders =
                0;

            let b2cOrders =
                0;

            let b2bRevenue =
                0;

            let b2cRevenue =
                0;

            let totalRevenue =
                0;

            orders.forEach((order) => {

                if (
                    order.status === "Cancelled"
                ) {
                    return;
                }

                const customer =
                    customerMap[
                    order.userId
                    ];

                const customerType =
                    customer?.customerType || "b2c";

                totalRevenue +=
                    order.totalAmount || 0;

                if (
                    customerType === "b2b"
                ) {

                    b2bOrders++;
                    b2bRevenue +=
                        order.totalAmount || 0;

                } else {

                    b2cOrders++;
                    b2cRevenue +=
                        order.totalAmount || 0;

                }

            });

            res.json({
                success: true,
                summary: {
                    totalOrders:
                        orders.length,

                    totalRevenue,

                    delivered:
                        orders.filter(
                            order =>
                                order.status === "Delivered"
                        ).length,

                    cancelled:
                        orders.filter(
                            order =>
                                order.status === "Cancelled"
                        ).length,

                    refunds:
                        orders.filter(
                            order =>
                                order.refundStatus === "Requested"
                        ).length,

                    exchanges:
                        orders.filter(
                            order =>
                                order.exchangeStatus === "Requested"
                        ).length,

                    b2bOrders,
                    b2cOrders,
                    b2bRevenue,
                    b2cRevenue
                }
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    error.message
            });

        }

    }
);

router.get(
    "/orders.csv",
    async (req, res) => {

        try {

            const orders =
                await Order.find().sort({
                    createdAt: -1
                }).lean();

            const customerMap =
                await getCustomerMap();

            const rows =
                orders.map((order) => {

                    const customer =
                        customerMap[
                        order.userId
                        ];

                    return {
                        orderNumber:
                            order.orderNumber,

                        customerName:
                            order.customerName,

                        email:
                            order.email,

                        phone:
                            order.phone,

                        customerType:
                            customer?.customerType || "b2c",

                        city:
                            order.city,

                        state:
                            order.state,

                        pincode:
                            order.pincode,

                        totalAmount:
                            order.totalAmount,

                        paymentMethod:
                            order.paymentMethod,

                        paymentStatus:
                            order.paymentStatus,

                        status:
                            order.status,

                        refundStatus:
                            order.refundStatus,

                        exchangeStatus:
                            order.exchangeStatus,

                        createdAt:
                            order.createdAt
                    };

                });

            const parser =
                new Parser();

            const csv =
                parser.parse(rows);

            res.header(
                "Content-Type",
                "text/csv"
            );

            res.attachment(
                "orders-report.csv"
            );

            res.send(csv);

        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    error.message
            });

        }

    }
);

router.get(
    "/refunds-exchanges.csv",
    async (req, res) => {

        try {

            const orders =
                await Order.find({
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
                }).sort({
                    createdAt: -1
                }).lean();

            const rows =
                orders.map((order) => ({
                    orderNumber:
                        order.orderNumber,

                    customerName:
                        order.customerName,

                    totalAmount:
                        order.totalAmount,

                    refundStatus:
                        order.refundStatus,

                    refundReason:
                        order.refundReason,

                    refundDecisionNote:
                        order.refundDecisionNote,

                    exchangeStatus:
                        order.exchangeStatus,

                    exchangeReason:
                        order.exchangeReason,

                    exchangeDecisionNote:
                        order.exchangeDecisionNote,

                    createdAt:
                        order.createdAt
                }));

            const parser =
                new Parser();

            const csv =
                parser.parse(rows);

            res.header(
                "Content-Type",
                "text/csv"
            );

            res.attachment(
                "refunds-exchanges-report.csv"
            );

            res.send(csv);

        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    error.message
            });

        }

    }
);

export default router;