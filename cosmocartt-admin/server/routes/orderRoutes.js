import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
    res.json({ message: "Orders API working ✅" });
});


// CREATE ORDER
router.post("/", async (req, res) => {

    console.log("ORDER REQUEST RECEIVED");
    console.log(JSON.stringify(req.body, null, 2));

    try {

        const {
            customerName,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            products
        } = req.body;

        for (const item of products) {

            const product =
                await Product.findById(
                    item.productId
                );

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message:
                        `${item.name} not found`
                });

            }

            if (
                product.stock <
                item.quantity
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `${item.name} has only ${product.stock} units left in stock`
                });

            }

        }

        if (
            !customerName ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "All checkout fields are required"
            });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain products"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number"
            });
        }

        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pincode"
            });
        }

        const lastOrder = await Order.findOne()
            .sort({ createdAt: -1 });

        let nextNumber = 1;

        if (
            lastOrder &&
            lastOrder.orderNumber
        ) {

            const lastNumber =
                parseInt(

                    lastOrder.orderNumber
                        .replace("CC-", "")

                );

            nextNumber =
                lastNumber + 1;

        }

        const order = new Order({

            ...req.body,

            orderNumber:
                `CC-${String(nextNumber)
                    .padStart(6, "0")}`

        });
        await order.save();

        console.log("ORDER SAVED:", order._id);

        for (const item of order.products) {

            const product =
                await Product.findById(
                    item.productId
                );

            if (product) {

                product.stock =
                    Math.max(
                        0,
                        product.stock -
                        item.quantity
                    );

                await product.save();

            }

        }

        res.json({
            success: true,
            order
        });

    } catch (err) {

        console.error("ORDER CREATE ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
});

// GET ORDERS BY CUSTOMER

router.get("/user/:userId", async (req, res) => {

    try {

        const orders = await Order.find({
            userId: req.params.userId
        }).sort({
            createdAt: -1
        });

        res.json({
            success: true,
            orders
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

// UPDATE STATUS
router.put("/:id", async (req, res) => {
    try {

        const allowedStatuses = [
            "Order Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(req.body.status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const existingOrder = await Order.findById(req.params.id);

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        existingOrder.status = req.body.status;

        existingOrder.trackingTimeline.push({
            status: req.body.status,
            date: new Date().toISOString()
        });

        await existingOrder.save();

        res.json({
            success: true,
            order: existingOrder
        });

    } catch (err) {
        console.error("ORDER STATUS UPDATE ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

router.put("/cancel/:id", async (req, res) => {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            order.status === "Shipped" ||
            order.status === "Delivered"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Order can no longer be cancelled"
            });
        }

        order.status = "Cancelled";

        order.trackingTimeline.push({
            status: "Cancelled",
            date: new Date().toISOString()
        });

        await order.save();

        res.json({
            success: true,
            order
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

export const requestRefund = async (
    req,
    res
) => {

    try {

        const {
            reason
        } = req.body;

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        order.refundStatus =
            "Requested";

        order.refundReason =
            reason;

        order.refundRequestedAt =
            new Date();

        await order.save();

        res.json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                error.message
        });

    }

};


router.put(
    "/:id/request-refund",
    requestRefund
);

export const decideRefund = async (
    req,
    res
) => {

    try {

        const {
            decision,
            note
        } = req.body;

        if (
            decision !== "Approved" &&
            decision !== "Rejected"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Decision must be Approved or Rejected"
            });

        }

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        if (
            order.refundStatus !== "Requested"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Cannot decide refund — current status is "${order.refundStatus}"`
            });

        }

        order.refundStatus =
            decision;

        order.refundDecisionNote =
            note || "";

        order.refundProcessedAt =
            new Date();

        await order.save();

        res.json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                error.message
        });

    }

};


router.put(
    "/:id/refund-decision",
    decideRefund
);

router.get(
    "/test-refund/:id",
    async (req, res) => {

        const order =
            await Order.findById(
                req.params.id
            );

        order.refundStatus =
            "Requested";

        order.refundReason =
            "Test Refund";

        order.refundRequestedAt =
            new Date();

        await order.save();

        res.json({
            success: true,
            order
        });

    }
);


export const requestExchange = async (
    req,
    res
) => {

    try {

        const {
            reason
        } = req.body;

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        if (
            order.status === "Cancelled"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Cancelled orders cannot be exchanged"
            });

        }

        if (
            order.exchangeStatus !== "Not Requested"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Exchange already exists with status "${order.exchangeStatus}"`
            });

        }

        order.exchangeStatus =
            "Requested";

        order.exchangeReason =
            reason || "";

        order.exchangeRequestedAt =
            new Date();

        await order.save();

        res.json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                error.message
        });

    }

};


router.put(
    "/:id/request-exchange",
    requestExchange
);


export const decideExchange = async (
    req,
    res
) => {

    try {

        const {
            decision,
            note
        } = req.body;

        if (
            decision !== "Approved" &&
            decision !== "Rejected"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Decision must be Approved or Rejected"
            });

        }

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        if (
            order.exchangeStatus !== "Requested"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Cannot decide exchange — current status is "${order.exchangeStatus}"`
            });

        }

        order.exchangeStatus =
            decision;

        order.exchangeDecisionNote =
            note || "";

        order.exchangeProcessedAt =
            new Date();

        await order.save();

        res.json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                error.message
        });

    }

};


router.put(
    "/:id/exchange-decision",
    decideExchange
);


router.get(
    "/test-exchange/:id",
    async (req, res) => {

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        order.exchangeStatus =
            "Requested";

        order.exchangeReason =
            "Test Exchange";

        order.exchangeRequestedAt =
            new Date();

        await order.save();

        res.json({
            success: true,
            order
        });

    }
);

export default router;