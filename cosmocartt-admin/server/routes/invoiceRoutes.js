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
            .fontSize(30)
            .fillColor("#4B1E78")
            .text("COSMOCARTT", {
                align: "center"
            });

        doc
            .fontSize(14)
            .fillColor("black")
            .text("GST TAX INVOICE", {
                align: "center"
            });

        doc.moveDown(2);

        doc
            .fontSize(12)
            .text(`Invoice No: INV-${order.orderNumber}`);

        doc.text(
            `Order No: ${order.orderNumber}`
        );

        doc.text(
            `Invoice Date: ${new Date(order.createdAt).toLocaleDateString()}`
        );

        doc.moveDown();

        doc
            .fontSize(14)
            .fillColor("#4B1E78")
            .text("Seller Details");

        doc
            .fillColor("black")
            .fontSize(11)
            .text("CosmoCartt");

        doc.text("Chennai, Tamil Nadu");

        doc.text("GSTIN: 33ABCDE1234F1Z5");

        doc.text("support@cosmocartt.com");

        doc.moveDown();

        doc
            .fontSize(14)
            .fillColor("#4B1E78")
            .text("Customer Details");

        doc
            .fillColor("black")
            .fontSize(11)
            .text(order.customerName);

        doc.text(order.email);

        doc.text(order.phone);

        doc.text(
            `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`
        );

        doc.moveDown(2);

        doc
            .fontSize(14)
            .fillColor("#4B1E78")
            .text("Order Items");

        doc.moveDown();

        order.products.forEach(
            (item, index) => {

                doc
                    .fillColor("black")
                    .fontSize(11)
                    .text(
                        `${index + 1}. ${item.name}`
                    );

                doc.text(
                    `Qty: ${item.quantity}`
                );

                doc.text(
                    `Price: ₹${item.price}`
                );

                doc.text(
                    `Total: ₹${item.quantity * item.price}`
                );

                doc.moveDown();
            }
        );

        doc.moveDown();

        doc
            .fontSize(14)
            .fillColor("#4B1E78")
            .text("Payment Summary");

        doc.moveDown(0.5);

        doc
            .fillColor("black")
            .fontSize(11)
            .text(
                `Subtotal: ₹${order.subtotal}`
            );

        doc.text(
            `Shipping: ₹${order.shippingCharge}`
        );

        doc.text(
            `Tax: ₹${order.tax}`
        );

        doc.moveDown(0.5);

        doc
            .fontSize(13)
            .text(
                `Grand Total: ₹${order.totalAmount}`
            );

        doc.moveDown();

        doc.text(
            `Payment Method: ${order.paymentMethod}`
        );

        doc.text(
            `Payment Status: ${order.paymentStatus}`
        );

        doc.moveDown(3);

        doc.text(
            "This is a computer generated invoice.",
            {
                align: "center"
            }
        );

        doc.moveDown();

        doc.text(
            "Authorized Signature",
            {
                align: "right"
            }
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