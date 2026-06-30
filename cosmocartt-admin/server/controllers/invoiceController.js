import PDFDocument from "pdfkit";
import Order from "../models/Order.js";
import path from "path";
import fs from "fs";
import QRCode from "qrcode";
import bwipjs from "bwip-js";

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const makeInvoiceNumber = (order) => {
    const date = new Date(order.createdAt || Date.now());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const suffix = String(order.orderNumber || order._id)
        .replace(/[^0-9]/g, "")
        .slice(-6)
        .padStart(6, "0");

    return `INV-${year}-${month}-${suffix}`;
};

const isTamilNadu = (state = "") =>
    String(state).toLowerCase().includes("tamil");

const getSeller = (order) => {
    const firstItem = order.products?.[0] || {};

    return {
        name: firstItem.sellerName || process.env.COMPANY_NAME || "CosmoCartt",
        gstin: firstItem.sellerGSTIN || process.env.COMPANY_GSTIN || "UNREGISTERED",
        address: process.env.COMPANY_ADDRESS || "Chennai, Tamil Nadu, India",
        email: process.env.COMPANY_EMAIL || "support@cosmocartt.com",
        phone: process.env.COMPANY_PHONE || "+91XXXXXXXXXX",
        website: process.env.COMPANY_WEBSITE || "www.cosmocartt.com",
    };
};

const paymentColor = (status) => {
    if (status === "Paid") return "#16A34A";
    if (status === "Failed") return "#DC2626";
    return "#EA580C";
};

const qrBuffer = async (payload) =>
    QRCode.toBuffer(payload, {
        width: 120,
        margin: 1,
        errorCorrectionLevel: "M",
    });

const barcodeBuffer = async (value) =>
    bwipjs.toBuffer({
        bcid: "code128",
        text: String(value),
        scale: 2,
        height: 10,
        includetext: false,
    });

const box = (doc, x, y, w, h, title) => {
    doc.roundedRect(x, y, w, h, 7)
        .fillAndStroke("#FFFFFF", "#E9D5FF");

    doc.fillColor("#4B1E78")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(title, x + 12, y + 10);
};

const smallLabel = (doc, text, x, y) => {
    doc.fillColor("#6B7280").font("Helvetica").fontSize(7.5).text(text, x, y);
};

const value = (doc, text, x, y, options = {}) => {
    doc.fillColor("#111827").font("Helvetica-Bold").fontSize(8.5).text(text, x, y, options);
};

export const generateInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const invoiceNumber = makeInvoiceNumber(order);
        const seller = getSeller(order);
        const intraState = isTamilNadu(order.state || "");
        const gstType = intraState ? "CGST + SGST" : "IGST";
        const totalAmount = Number(order.totalAmount || 0);
        const taxableValue = totalAmount / 1.18;
        const gstAmount = totalAmount - taxableValue;
        const cgst = intraState ? gstAmount / 2 : 0;
        const sgst = intraState ? gstAmount / 2 : 0;
        const igst = intraState ? 0 : gstAmount;

        const totalQty = (order.products || []).reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
        );

        const qr = await qrBuffer(
            JSON.stringify({
                invoiceNumber,
                orderNumber: order.orderNumber,
                amount: totalAmount,
                paymentStatus: order.paymentStatus,
                awbCode: order.awbCode || "",
                website: seller.website,
            })
        );

        const barcode = order.awbCode ? await barcodeBuffer(order.awbCode) : null;

        const doc = new PDFDocument({
            size: "A4",
            margin: 36,
            bufferPages: true,
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${invoiceNumber}-${order.orderNumber}.pdf`
        );

        doc.pipe(res);

        const pageW = 595;
        const left = 42;
        const right = 553;
        const purple = "#4B1E78";

        doc.rect(0, 0, pageW, 90).fill("#FAF7FF");

        const logoPath = path.join(process.cwd(), "assets/logo.png");
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, left, 28, { width: 62 });
        }

        doc.fillColor(purple)
            .font("Helvetica-Bold")
            .fontSize(24)
            .text("COSMOCARTT", 115, 33);

        doc.fillColor("#111827")
            .fontSize(15)
            .text("TAX INVOICE", 392, 35, { width: 150, align: "right" });

        doc.fillColor("#6B7280")
            .font("Helvetica")
            .fontSize(8.5)
            .text(invoiceNumber, 392, 56, { width: 150, align: "right" });

        doc.moveTo(left, 88).lineTo(right, 88).strokeColor(purple).lineWidth(2).stroke();

        box(doc, left, 108, 245, 125, "SOLD BY");
        value(doc, seller.name, 54, 134);
        doc.font("Helvetica").fontSize(8).fillColor("#374151")
            .text(seller.address, 54, 150, { width: 215, lineGap: 2 })
            .text(`GSTIN: ${seller.gstin}`, 54, 184)
            .text(`Email: ${seller.email}`, 54, 198)
            .text(`Phone: ${seller.phone}`, 54, 212);

        box(doc, 308, 108, 245, 125, "BILL TO / SHIP TO");
        value(doc, order.customerName || "Customer", 320, 134);
        doc.font("Helvetica").fontSize(8).fillColor("#374151")
            .text(
                `${order.address || ""}, ${order.city || ""}, ${order.state || ""}${order.pincode ? " - " + order.pincode : ""}`,
                320,
                150,
                { width: 215, lineGap: 2 }
            )
            .text(`Phone: ${order.phone || "N/A"}`, 320, 198)
            .text(`Email: ${order.email || "N/A"}`, 320, 212);

        box(doc, left, 250, 365, 78, "INVOICE DETAILS");

        smallLabel(doc, "Invoice No", 54, 278);
        smallLabel(doc, "Order No", 180, 278);
        smallLabel(doc, "Date", 300, 278);

        value(doc, invoiceNumber, 54, 293);
        value(doc, order.orderNumber || "N/A", 180, 293);
        value(doc, new Date(order.createdAt).toLocaleDateString("en-IN"), 300, 293);

        smallLabel(doc, "Customer Type", 54, 310);
        smallLabel(doc, "GST Type", 180, 310);
        smallLabel(doc, "Total Qty", 300, 310);

        value(doc, String(order.customerType || "B2C").toUpperCase(), 125, 310);
        value(doc, gstType, 225, 310);
        value(doc, String(totalQty), 352, 310);

        doc.roundedRect(425, 250, 128, 78, 7).fillAndStroke("#FFFFFF", "#E9D5FF");
        doc.image(qr, 462, 259, { width: 48, height: 48 });
        doc.font("Helvetica").fontSize(6.8).fillColor("#6B7280")
            .text("Scan to verify invoice", 440, 310, { width: 98, align: "center" });

        let y = 345;

        if (barcode) {
            doc.roundedRect(left, y, 511, 68, 8).fillAndStroke("#EFF6FF", "#BFDBFE");

            doc.fillColor("#1D4ED8")
                .font("Helvetica-Bold")
                .fontSize(8.5)
                .text("AWB TRACKING", 54, y + 12);

            doc.image(barcode, 205, y + 13, { width: 190, height: 32 });

            doc.fillColor("#374151")
                .font("Helvetica-Bold")
                .fontSize(8)
                .text(order.awbCode, 54, y + 36, { width: 140 });

            doc.font("Helvetica")
                .fontSize(7.5)
                .fillColor("#6B7280")
                .text(order.courierName || "Courier assigned", 410, y + 34, {
                    width: 120,
                    align: "right",
                });

            y += 88;
        }

        doc.fillColor(purple).font("Helvetica-Bold").fontSize(11).text("Order Items", left, y);
        y += 18;

        doc.rect(left, y, 511, 24).fill(purple);
        doc.fillColor("#FFFFFF").fontSize(8.2).font("Helvetica-Bold")
            .text("#", 50, y + 8, { width: 20 })
            .text("Product", 72, y + 8, { width: 170 })
            .text("SKU / HSN", 248, y + 8, { width: 78 })
            .text("Qty", 328, y + 8, { width: 30, align: "center" })
            .text("Price", 365, y + 8, { width: 65, align: "right" })
            .text("GST", 438, y + 8, { width: 35, align: "center" })
            .text("Total", 480, y + 8, { width: 65, align: "right" });

        y += 24;

        (order.products || []).forEach((item, index) => {
            const qty = Number(item.quantity || 0);
            const price = Number(item.price || 0);
            const lineTotal = qty * price;
            const rowHeight = 34;

            if (y + rowHeight > 720) {
                doc.addPage();
                y = 45;
            }

            doc.rect(left, y, 511, rowHeight)
                .fillAndStroke(index % 2 === 0 ? "#F9FAFB" : "#FFFFFF", "#E5E7EB");

            doc.fillColor("#111827").font("Helvetica").fontSize(8)
                .text(String(index + 1), 50, y + 11, { width: 20 })
                .text(item.name || "Product", 72, y + 11, { width: 170 })
                .text(item.sku || item.hsnCode || "N/A", 248, y + 11, { width: 78 })
                .text(String(qty), 328, y + 11, { width: 30, align: "center" })
                .text(formatCurrency(price), 365, y + 11, { width: 65, align: "right" })
                .text(`${item.gstPercentage || 18}%`, 438, y + 11, { width: 35, align: "center" })
                .text(formatCurrency(lineTotal), 480, y + 11, { width: 65, align: "right" });

            y += rowHeight;
        });

        y += 22;

        if (y + 160 > 735) {
            doc.addPage();
            y = 45;
        }

        box(doc, left, y, 245, 138, "PAYMENT & SHIPPING");
        doc.font("Helvetica").fontSize(8).fillColor("#374151")
            .text(`Payment Method: ${order.paymentMethod || "COD"}`, 54, y + 34)
            .text("Payment Status:", 54, y + 50);

        doc.fillColor(paymentColor(order.paymentStatus))
            .font("Helvetica-Bold")
            .text(order.paymentStatus || "Pending", 130, y + 50);

        doc.font("Helvetica").fontSize(8).fillColor("#374151")
            .text(`Razorpay Order: ${order.razorpayOrderId || "N/A"}`, 54, y + 68, { width: 210 })
            .text(`Razorpay Payment: ${order.razorpayPaymentId || "N/A"}`, 54, y + 84, { width: 210 })
            .text(`AWB: ${order.awbCode || "Not assigned"}`, 54, y + 102)
            .text(`Courier: ${order.courierName || "Not assigned"}`, 54, y + 118);

        box(doc, 308, y, 245, 138, "GST SUMMARY");

        doc.font("Helvetica").fontSize(8).fillColor("#111827")
            .text("Taxable Value:", 320, y + 34)
            .text(formatCurrency(taxableValue), 440, y + 34, { width: 95, align: "right" });

        if (intraState) {
            doc.text("CGST (9%):", 320, y + 52)
                .text(formatCurrency(cgst), 440, y + 52, { width: 95, align: "right" })
                .text("SGST (9%):", 320, y + 70)
                .text(formatCurrency(sgst), 440, y + 70, { width: 95, align: "right" });
        } else {
            doc.text("IGST (18%):", 320, y + 52)
                .text(formatCurrency(igst), 440, y + 52, { width: 95, align: "right" });
        }

        doc.text("Shipping:", 320, y + 88)
            .text(formatCurrency(order.shippingCharge || 0), 440, y + 88, { width: 95, align: "right" });

        doc.roundedRect(320, y + 104, 220, 26, 5).fill(purple);
        doc.fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(9.5)
            .text("GRAND TOTAL", 332, y + 113)
            .text(formatCurrency(totalAmount), 440, y + 113, { width: 88, align: "right" });

        y += 165;

        doc.moveTo(left, y).lineTo(right, y).strokeColor("#E5E7EB").lineWidth(1).stroke();

        doc.font("Helvetica-Bold").fontSize(8.5).fillColor(purple)
            .text("Thank you for shopping with CosmoCartt.", left, y + 12, { width: 310 });

        doc.font("Helvetica").fontSize(7.5).fillColor("#6B7280")
            .text("This is a computer-generated invoice and does not require a physical signature.", left, y + 27, { width: 330 })
            .text("Returns, refunds and exchanges are subject to CosmoCartt policies.", left, y + 40, { width: 330 });

        doc.font("Helvetica-Bold").fontSize(8.5).fillColor(purple)
            .text(`For ${seller.name}`, 400, y + 12, { width: 140, align: "right" });

        doc.font("Helvetica").fontSize(8.5).fillColor("#111827")
            .text("Authorized Signatory", 400, y + 44, { width: 140, align: "right" });

        doc.end();
    } catch (error) {
        console.error("INVOICE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
