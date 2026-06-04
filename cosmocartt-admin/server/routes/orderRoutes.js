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

        console.error(err);

        res.json({
            success: false
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
router.put("/:id", async (req, res) => {
    try {

        const updateData = {
            ...req.body
        };

        if (req.body.status) {

            updateData.trackingTimeline = [
                {
                    status: req.body.status,
                    date: new Date().toISOString(),
                }
            ];
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({
            success: true,
            order
        });

    } catch (err) {
        console.error(err);

        res.json({
            success: false
        });
    }
});

export default router;