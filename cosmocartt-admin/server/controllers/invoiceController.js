import PDFDocument from "pdfkit";
import Order from "../models/Order.js";
import path from "path";
import fs from "fs";

export const generateInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Initialize document layout with A4 Standard grid configurations
        const doc = new PDFDocument({ size: "A4", margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.orderNumber}.pdf`);
        doc.pipe(res);

        // System standard font (safe for clean text output across all environments)
        doc.font('Helvetica');

        // Currency Formatter utilizing standard text literal "₹"
        const formatCurrency = (val) =>
            `₹${Number(val || 0).toFixed(2)}`;

        // ==========================================
        // 1. BRANDING & PROFESSIONAL HEADER WITH LOGO
        // ==========================================
        let headerY = 45;
        let companyNameX = 40;

        // Dynamic Production Logo Check & Injection
        const logoPath =
            path.join(
                process.cwd(),
                "assets/logo.png"
            );

        if (fs.existsSync(logoPath)) {
            // Scales and injects logo without distortion
            doc.image(
                logoPath,
                40,
                headerY - 5,
                {
                    width: 70
                }
            );
            companyNameX = 115; // Offsets text to align right next to the logo
        }

        // Brand Identity Title Layout
        doc.fontSize(24).fillColor("#4B1E78").text("COSMOCARTT", companyNameX, headerY, { lineBreak: false });
        doc.fontSize(16).fillColor("#111827").text("TAX INVOICE", 400, headerY + 6, { align: "right", width: 155 });

        // Accent Bar Separator
        doc.moveTo(40, 82).lineTo(555, 82).strokeColor("#4B1E78").lineWidth(2).stroke();

        // ==========================================
        // 2. SELLER & CUSTOMER INFORMATION SECTIONS
        // ==========================================
        let sectionTop = 95;

        // --- Left Column: Environmental Managed Seller Variables ---
        doc.roundedRect(40, sectionTop, 250, 135, 4).strokeColor("#4B1E78").lineWidth(1).stroke();
        doc.fontSize(10).fillColor("#4B1E78").text("Sold By:", 50, sectionTop + 10);

        doc.fillColor("#1F2937").fontSize(9)
            .text(process.env.COMPANY_NAME || "CosmoCartt", 50, sectionTop + 26, { lineGap: 2 })
            .text(process.env.COMPANY_ADDRESS || "Chennai, Tamil Nadu, India", 50, sectionTop + 40, { width: 230, lineGap: 2 })
            .text(`GSTIN: ${process.env.COMPANY_GSTIN || "33ABCDE1234F1Z5"}`, 50, sectionTop + 76)
            .text(`Email: ${process.env.COMPANY_EMAIL || "support@cosmocartt.com"}`, 50, sectionTop + 90)
            .text(`Phone: ${process.env.COMPANY_PHONE || "+91 98765 43210"}`, 50, sectionTop + 104)
            .text(`Website: ${process.env.COMPANY_WEBSITE || "www.cosmocartt.com"}`, 50, sectionTop + 118);

        // --- Right Column: Structured Billing / Shipping Target ---
        doc.roundedRect(305, sectionTop, 250, 135, 4).strokeColor("#4B1E78").lineWidth(1).stroke();
        doc.fontSize(10).fillColor("#4B1E78").text("Shipping Address / Bill To:", 315, sectionTop + 10);

        // Dynamic non-truncated bounding tracking for customer multi-line address
        doc.fillColor("#1F2937").fontSize(9)
            .text(order.customerName || "N/A", 315, sectionTop + 26, { lineGap: 2 })
            .text(`${order.address || ""}, ${order.city || ""}, ${order.state || ""}${order.pincode ? ' - ' + order.pincode : ''}`, 315, sectionTop + 40, { width: 220, lineGap: 2 })
            .text(`Phone: ${order.phone || "N/A"}`, 315, sectionTop + 90)
            .text(`Email: ${order.email || "N/A"}`, 315, sectionTop + 104);

        // ==========================================
        // 3. INVOICE META-DATA TIMELINE ROW
        // ==========================================
        let metaTop = sectionTop + 150;
        doc.roundedRect(40, metaTop, 515, 45, 4).strokeColor("#D1D5DB").lineWidth(1).stroke();

        doc.fillColor("#4B1E78").fontSize(8.5);
        doc.text("Invoice ID:", 50, metaTop + 10)
            .text("Order Reference ID:", 210, metaTop + 10)
            .text("Date of Issue:", 400, metaTop + 10);

        doc.fillColor("#111827").fontSize(9.5);
        doc.text(
            `CC-INV-${String(order.orderNumber)
                .replace("CC-", "")
                .padStart(6, "0")}`,
            50,
            metaTop + 24
        );
        doc.text(`${order.orderNumber}`, 210, metaTop + 24);
        doc.text(`${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, metaTop + 24);

        // ==========================================
        // 4. ENTERPRISE LEVEL PRODUCT GRID TABLE
        // ==========================================
        let tableTop = metaTop + 65;
        doc.fillColor("#4B1E78").fontSize(11).text("Order Items", 40, tableTop);

        tableTop += 18;
        doc.rect(40, tableTop, 515, 24).fill("#4B1E78");
        doc.fillColor("#FFFFFF").fontSize(9);

        // Column Header alignments (Adjusted spacing for INR text placement)
        doc.text("Product Details", 48, tableTop + 8, { width: 175 });
        doc.text("SKU / HSN", 230, tableTop + 8, { width: 75 });
        doc.text("Qty", 310, tableTop + 8, { width: 30, align: "center" });
        doc.text("Unit Price", 345, tableTop + 8, { width: 80, align: "right" });
        doc.text("GST %", 435, tableTop + 8, { width: 40, align: "center" });
        doc.text("Line Total", 480, tableTop + 8, { width: 70, align: "right" });

        let currentY = tableTop + 24;

        order.products.forEach((item, index) => {
            // Dynamic text height safety checks
            const textHeight = doc.heightOfString(item.name || "Product Specification", { width: 175 });
            const rowHeight = Math.max(textHeight + 16, 34);

            // Safe Overflow Page Handling
            if (currentY + rowHeight > 720) {
                doc.addPage();
                currentY = 40;
            }

            // Alternating Row Background Fills
            if (index % 2 === 0) {
                doc.rect(40, currentY, 515, rowHeight).fill("#F9FAFB");
            }

            // Clean table borders
            doc.rect(40, currentY, 515, rowHeight).strokeColor("#E5E7EB").lineWidth(1).stroke();
            doc.fillColor("#111827").fontSize(9);

            // Row data inputs
            doc.text(item.name || "N/A", 48, currentY + 8, { width: 175 });
            doc.text(item.sku || item.hsnCode || "N/A", 230, currentY + 8, { width: 75 });
            doc.text(item.quantity.toString(), 310, currentY + 8, { width: 30, align: "center" });
            doc.text(formatCurrency(item.price), 345, currentY + 8, { width: 80, align: "right" });
            doc.text(`${item.gstPercentage || 0}%`, 435, currentY + 8, { width: 40, align: "center" });

            const lineTotal = item.price * item.quantity;
            doc.text(formatCurrency(lineTotal), 480, currentY + 8, { width: 70, align: "right" });

            currentY += rowHeight;
        });

        // ==========================================
        // 5. TRANSACTION STACK & FINANCIAL LEDGER SUMMARY
        // ==========================================
        let summaryY = currentY + 20;

        if (summaryY + 140 > 740) {
            doc.addPage();
            summaryY = 40;
        }

        // --- Left Block: Payment Info ---
        doc.roundedRect(40, summaryY, 250, 115, 4).strokeColor("#E5E7EB").lineWidth(1).stroke();
        doc.fontSize(10).fillColor("#4B1E78").text("Payment Details", 50, summaryY + 10);

        doc.fillColor("#374151").fontSize(9)
            .text(`Method: ${order.paymentMethod || "COD"}`, 50, summaryY + 30)
            .text(`Razorpay Payment ID: ${order.razorpayPaymentId || "N/A"}`, 50, summaryY + 70)
            .text(`Razorpay Order ID: ${order.razorpayOrderId || "N/A"}`, 50, summaryY + 85);

        doc.fillColor("#374151").text("Payment Status: ", 50, summaryY + 50);

        // Exact status dynamic text coloring matches
        let statusColor = "#EA580C"; // Pending: Orange
        if (order.paymentStatus === "Paid") statusColor = "#16A34A";   // Paid: Green
        if (order.paymentStatus === "Failed") statusColor = "#DC2626"; // Failed: Red
        doc.fillColor(statusColor).text(order.paymentStatus || "Pending", 125, summaryY + 50);

        // --- Right Block: Final Ledger Pricing Breakdown ---
        doc.roundedRect(305, summaryY, 250, 115, 4).strokeColor("#4B1E78").lineWidth(1).stroke();
        doc.fillColor("#111827").fontSize(9);

        doc.text("Subtotal:", 315, summaryY + 12);
        doc.text(formatCurrency(order.subtotal), 440, summaryY + 12, { align: "right", width: 105 });

        doc.text("Shipping Charges:", 315, summaryY + 28);
        doc.text(formatCurrency(order.shippingCharge), 440, summaryY + 28, { align: "right", width: 105 });

        doc.text("Tax Amount:", 315, summaryY + 44);
        doc.text(formatCurrency(order.tax), 440, summaryY + 44, { align: "right", width: 105 });

        doc.text("Discount Applied:", 315, summaryY + 60);
        doc.text(formatCurrency(order.discount || 0), 440, summaryY + 60, { align: "right", width: 105 });

        // Highlighted Bottom Total Bar Block
        doc.rect(306, summaryY + 82, 248, 32).fill("#4B1E78");
        doc.fillColor("#FFFFFF").fontSize(10).text("GRAND TOTAL:", 315, summaryY + 93);
        doc.text(formatCurrency(order.totalAmount), 440, summaryY + 93, { align: "right", width: 105 });

        // ==========================================
        // 6. COMPLIANCE LEGAL FOOTER & SIGNATURES
        // ==========================================
        let footerBaselineY = 740;
        doc.moveTo(40, footerBaselineY).lineTo(555, footerBaselineY).strokeColor("#E5E7EB").lineWidth(1).stroke();

        // Right Side Signature Box Block
        doc.fontSize(8.5).fillColor("#4B1E78").text("For CosmoCartt", 400, footerBaselineY + 12, { align: "right", width: 155 });
        doc.fontSize(9).fillColor("#111827").text("Authorized Signatory", 400, footerBaselineY + 42, { align: "right", width: 155 });

        // Left Side Compliance Information Metadata
        doc.fontSize(8.5)
            .fillColor("#4B1E78")
            .text(
                "Thank you for shopping with CosmoCartt.",
                40,
                footerBaselineY + 15,
                {
                    width: 320
                }
            );

        doc.fontSize(8)
            .fillColor("#6B7280")
            .text(
                "Visit us: www.cosmocartt.com",
                40,
                footerBaselineY + 28,
                {
                    width: 320
                }
            );
        doc.fillColor("#9CA3AF").text(
            "This is a computer-generated invoice and does not require a physical signature.",
            40,
            footerBaselineY + 42)

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};