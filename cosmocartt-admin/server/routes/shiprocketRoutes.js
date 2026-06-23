import express from "express";
import axios from "axios";
import {
    getShiprocketToken,
    createShipment,
    getCourierOptions,
    getShipmentDetails
} from "../services/shiprocketService.js";

import Order from "../models/Order.js";

const router = express.Router();

const isMockMode = () =>
    process.env.SHIPROCKET_MODE !== "live";

const buildMockTrackingUrl = (awbCode) =>
    `https://www.delhivery.com/track/package/${awbCode}`;

router.get("/test", async (req, res) => {

    try {

        if (isMockMode()) {
            return res.json({
                success: true,
                mode: "mock",
                message: "Shiprocket mock mode active"
            });
        }

        const token =
            await getShiprocketToken();

        res.json({
            success: true,
            mode: "live",
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
                    message: "Order not found"
                });

            }

            if (
                !order.phone ||
                !order.address ||
                !order.city ||
                !order.state ||
                !order.pincode
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Order missing shipping details"
                });

            }

            if (order.shipmentId) {

                return res.json({
                    success: true,
                    message: "Shipment already exists",
                    order
                });

            }

            let shipmentData = {};

            if (isMockMode()) {

                const mockShipmentId =
                    `MOCK-SHIP-${Date.now()}`;

                const mockOrderId =
                    `MOCK-ORDER-${Date.now()}`;

                const mockAwb =
                    `AWB${Date.now()}`;

                order.shiprocketOrderId =
                    mockOrderId;

                order.shipmentId =
                    mockShipmentId;

                order.awbCode =
                    mockAwb;

                order.courierName =
                    order.city?.toLowerCase() === "chennai"
                        ? "Local Delivery"
                        : "Delhivery";

                order.trackingUrl =
                    buildMockTrackingUrl(mockAwb);

                order.shippingStatus =
                    "Shipped";

                shipmentData = {
                    mode: "mock",
                    order_id: mockOrderId,
                    shipment_id: mockShipmentId,
                    awb_code: mockAwb,
                    courier_name: order.courierName,
                    tracking_url: order.trackingUrl
                };

            } else {

                shipmentData =
                    await createShipment(order);

                order.shiprocketOrderId =
                    shipmentData.order_id || "";

                order.shipmentId =
                    shipmentData.shipment_id || "";

                order.shippingStatus =
                    "Shipment Created";

            }

            order.status =
                "Shipped";

            order.trackingTimeline.push({
                status: "Shipped",
                date: new Date().toISOString()
            });

            await order.save();

            res.json({
                success: true,
                mode: isMockMode() ? "mock" : "live",
                order,
                shipmentData
            });

        } catch (error) {

            console.error(
                "SHIPROCKET CREATE SHIPMENT ERROR:",
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

            if (isMockMode()) {

                return res.json({
                    success: true,
                    mode: "mock",
                    couriers: [
                        {
                            courier_company_id: 1,
                            courier_name: "Delhivery",
                            rate: 55,
                            estimated_delivery_days: 3
                        },
                        {
                            courier_company_id: 2,
                            courier_name: "BlueDart",
                            rate: 85,
                            estimated_delivery_days: 2
                        }
                    ]
                });

            }

            const data =
                await getCourierOptions(
                    req.params.shipmentId
                );

            res.json(data);

        } catch (error) {

            console.error(error);

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
    "/generate-awb/:shipmentId",
    async (req, res) => {

        try {

            if (isMockMode()) {

                return res.json({
                    success: true,
                    mode: "mock",
                    awb_assign_status: 1,
                    response: {
                        data: {
                            awb_code:
                                `AWB${Date.now()}`,
                            courier_name:
                                "Delhivery"
                        }
                    }
                });

            }

            const token =
                await getShiprocketToken();

            const response =
                await axios.post(
                    "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
                    {
                        shipment_id:
                            Number(req.params.shipmentId)
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
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

    }
);

router.get(
    "/tracking/:orderId",
    async (req, res) => {

        try {

            const order =
                await Order.findById(
                    req.params.orderId
                );

            if (
                !order ||
                !order.shipmentId
            ) {

                return res.status(404).json({
                    success: false,
                    message: "Shipment not found"
                });

            }

            if (isMockMode()) {

                return res.json({
                    success: true,
                    mode: "mock",
                    trackingData: {
                        shipment_id:
                            order.shipmentId,
                        awb_code:
                            order.awbCode,
                        courier_name:
                            order.courierName,
                        current_status:
                            order.status,
                        tracking_url:
                            order.trackingUrl,
                        timeline:
                            order.trackingTimeline || []
                    }
                });

            }

            const trackingData =
                await getShipmentDetails(
                    order.shipmentId
                );

            res.json({
                success: true,
                mode: "live",
                trackingData
            });

        } catch (error) {

            console.error(error);

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
    "/create-return/:orderId",
    async (req, res) => {

        try {

            const order =
                await Order.findById(
                    req.params.orderId
                );

            if (!order) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });

            }

            if (
                order.returnShipmentId
            ) {

                return res.json({
                    success: true,
                    message: "Return shipment already exists",
                    order
                });

            }

            if (
                order.refundStatus !== "Requested" &&
                order.exchangeStatus !== "Requested" &&
                order.exchangeStatus !== "Completed"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Return can be created only for refund or exchange orders"
                });

            }

            if (isMockMode()) {

                const returnShipmentId =
                    `MOCK-RETURN-${Date.now()}`;

                const returnAwb =
                    `R-AWB${Date.now()}`;

                order.returnShipmentId =
                    returnShipmentId;

                order.returnAwbCode =
                    returnAwb;

                order.returnCourierName =
                    "Delhivery Reverse Pickup";

                order.returnTrackingUrl =
                    buildMockTrackingUrl(returnAwb);

                order.trackingTimeline.push({
                    status: "Return Pickup Created",
                    date: new Date().toISOString()
                });

                await order.save();

                return res.json({
                    success: true,
                    mode: "mock",
                    order,
                    returnShipment: {
                        returnShipmentId,
                        returnAwb,
                        courierName:
                            order.returnCourierName,
                        trackingUrl:
                            order.returnTrackingUrl
                    }
                });

            }

            return res.status(501).json({
                success: false,
                message:
                    "Live Shiprocket return API will be enabled after KYC/API access is active"
            });

        } catch (error) {

            console.error(
                "SHIPROCKET RETURN ERROR:",
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

export default router;