import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
    res.json({ message: "Orders API working ✅" });
});

// router.put(
//     "/:id/request-refund",
//     requestRefund
// );

// CREATE ORDER
router.post("/", async (req, res) => {

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

export default router;