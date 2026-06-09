import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();



router.post("/create-order", async (req, res) => {

    try {

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order =
            await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }


});

router.post("/verify", async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");

        const isValid =
            generatedSignature ===
            razorpay_signature;

        res.json({
            success: isValid
        });

    } catch (error) {

        res.status(500).json({
            success: false
        });

    }

});

router.get("/ping", (req, res) => {
    res.json({
        success: true,
        message: "Payment routes working"
    });
});

export default router;