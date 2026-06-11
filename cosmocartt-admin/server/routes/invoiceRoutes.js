import express from "express";
import PDFDocument from "pdfkit";
import Order from "../models/Order.js";

const router = express.Router();

router.get("/:orderId", async (req, res) => {

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

        const doc = new PDFDocument({
            margin: 50
        });

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${order.orderNumber}.pdf`
        );

        doc.pipe(res);

        doc
            .fontSize(24)
            .fontSize(28)
            .text("COSMOCARTT", {
                align: "center"
            });

        doc
            .fontSize(16)
            .text("TAX INVOICE", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(12)
            .text(`Invoice Date: ${new Date().toLocaleDateString()}`);

        doc.text(
            `Order Number: ${order.orderNumber}`
        );

        doc.moveDown();

        doc.text(
            `Customer: ${order.customerName}`
        );

        doc.text(
            `Email: ${order.email}`
        );

        doc.text(
            `Phone: ${order.phone}`
        );

        doc.moveDown();

        doc.text("Shipping Address:");

        doc.text(
            `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`
        );

        doc.moveDown();

        doc.fontSize(14).text("Products");

        doc.moveDown(0.5);

        order.products.forEach(
            (item) => {

                doc.fontSize(12).text(
                    `${item.name} | Qty: ${item.quantity} | ₹${item.price}`
                );

            }
        );

        doc.moveDown();

        doc.text(
            `Subtotal: ₹${order.subtotal}`
        );

        doc.text(
            `Shipping: ₹${order.shippingCharge}`
        );

        doc.text(
            `Tax: ₹${order.tax}`
        );

        doc.text(
            `Total: ₹${order.totalAmount}`
        );

        doc.moveDown();

        doc.text(
            `Payment Method: ${order.paymentMethod}`
        );

        doc.text(
            `Payment Status: ${order.paymentStatus}`
        );

        doc.end();

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

export default router;