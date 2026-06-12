import express from "express";
import axios from "axios";
import {
    getShiprocketToken,
    createShipment,
    getCourierOptions
} from "../services/shiprocketService.js";

import Order from "../models/Order.js";

const router = express.Router();

router.get("/test", async (req, res) => {

    try {

        const token =
            await getShiprocketToken();

        res.json({
            success: true,
            tokenExists: !!token
        });

    } catch (error) {

        console.error(error.response?.data);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get(
    "/create-shipment/:orderId",
    async (req, res) => {

        try {

            const order =
                await Order.findById(
                    req.params.orderId
                );

            if (!order) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found"
                });

            }

            const shipmentData =
                await createShipment(
                    order
                );

            console.log(
                "SHIPROCKET RESPONSE:",
                shipmentData
            );

            order.shiprocketOrderId =
                shipmentData.order_id || "";

            order.shipmentId =
                shipmentData.shipment_id || "";

            await order.save();

            res.json({
                success: true,
                shipmentData
            });

        } catch (error) {

            console.error(
                "SHIPROCKET ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(500).json({
                success: false,
                error:
                    error.response?.data ||
                    error.message
            });

        }
    }
);

router.get(
    "/couriers/:shipmentId",
    async (req, res) => {

        try {

            const data =
                await getCourierOptions(
                    req.params.shipmentId
                );

            res.json(data);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false
            });

        }

    }
);

router.get("/generate-awb/:shipmentId", async (req, res) => {
    try {
        const token = await getShiprocketToken();

        const response = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
            {
                shipment_id: Number(req.params.shipmentId)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            success: false,
            error:
                error.response?.data ||
                error.message
        });

    }
});

export default router;