import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
    res.json({ message: "Orders API working ✅" });
});

// CREATE ORDER
router.post("/", async (req, res) => {

    try {

        const count = await Order.countDocuments();
        console.log("TOTAL ORDERS:", count);

        const order = new Order({
            ...req.body,

            orderNumber:
                `CC-${String(count + 1).padStart(6, "0")}`,
        });

        await order.save();

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

// UPDATE STATUS
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

export default router;