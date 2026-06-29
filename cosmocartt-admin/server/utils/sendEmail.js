import axios from "axios";

const required = [
    "BREVO_API_KEY",
    "BREVO_SENDER_EMAIL",
    "BREVO_SENDER_NAME"
];

export const canSendEmail = () => {
    return required.every((key) => Boolean(process.env[key]));
};

export const sendEmail = async ({ to, subject, html }) => {
    if (!canSendEmail()) {
        console.log("BREVO CONFIG MISSING. Email not sent.");
        console.log({ to, subject });
        return false;
    }

    const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: {
                name: process.env.BREVO_SENDER_NAME,
                email: process.env.BREVO_SENDER_EMAIL
            },
            to: [{ email: to }],
            subject,
            htmlContent: html
        },
        {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        }
    );

    console.log("BREVO EMAIL SENT:", response.data);
    return true;
};

export const buildOtpEmail = ({ name, otp }) => `
<div style="font-family:Arial,sans-serif;background:#f6f3fb;padding:24px;">
  <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:18px;padding:28px;border:1px solid #eee;">
    <h2 style="margin:0;color:#3D1766;">CosmoCartt Email Verification</h2>
    <p style="color:#555;font-size:15px;">Hi ${name || "Customer"},</p>
    <p style="color:#555;font-size:15px;">Use the OTP below to verify your CosmoCartt account.</p>
    <div style="font-size:34px;letter-spacing:8px;font-weight:800;color:#4B1E78;background:#f4ecff;padding:18px;text-align:center;border-radius:14px;margin:22px 0;">
      ${otp}
    </div>
    <p style="color:#555;font-size:14px;">This OTP is valid for 10 minutes.</p>
    <p style="color:#999;font-size:12px;">If you did not request this, you can safely ignore this email.</p>
  </div>
</div>
`;

const rupee = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const productRows = (order) =>
    (order.products || [])
        .map((p) => {
            const qty = Number(p.quantity || 1);
            const price = Number(p.price || 0);
            const total = qty * price;

            return `
<tr>
  <td style="padding:14px 10px;border-bottom:1px solid #eee;">
    <div style="font-weight:700;color:#222;">${p.name || "Product"}</div>
    <div style="font-size:12px;color:#777;margin-top:4px;">
      ${p.brand ? `Brand: ${p.brand} • ` : ""}${p.sku ? `SKU: ${p.sku}` : ""}
    </div>
  </td>
  <td style="padding:14px 10px;border-bottom:1px solid #eee;text-align:center;color:#333;">${qty}</td>
  <td style="padding:14px 10px;border-bottom:1px solid #eee;text-align:right;color:#333;">${rupee(price)}</td>
  <td style="padding:14px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:#222;">${rupee(total)}</td>
</tr>`;
        })
        .join("");

export const buildOrderConfirmationEmail = ({ order }) => `
<div style="font-family:Arial,sans-serif;background:#f5f0fb;padding:28px;">
  <div style="max-width:760px;margin:auto;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #eadff7;">
    <div style="background:linear-gradient(135deg,#2B1055,#6F2DBD);padding:28px;color:#fff;">
      <h1 style="margin:0;font-size:28px;">CosmoCartt</h1>
      <p style="margin:10px 0 0;font-size:18px;font-weight:700;">Order Confirmed 🎉</p>
      <p style="margin:6px 0 0;color:#eadcff;">Thanks ${order.customerName || "Customer"}, your order has been placed successfully.</p>
    </div>

    <div style="padding:26px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:22px;">
        <div style="background:#f8f4ff;border-radius:14px;padding:14px;">
          <div style="font-size:12px;color:#777;">Order ID</div>
          <div style="font-weight:800;color:#4B1E78;">${order.orderNumber}</div>
        </div>
        <div style="background:#f8f4ff;border-radius:14px;padding:14px;">
          <div style="font-size:12px;color:#777;">Order Date</div>
          <div style="font-weight:800;color:#222;">${new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}</div>
        </div>
        <div style="background:#f8f4ff;border-radius:14px;padding:14px;">
          <div style="font-size:12px;color:#777;">Payment</div>
          <div style="font-weight:800;color:#222;">${order.paymentMethod || "-"} • ${order.paymentStatus || "Pending"}</div>
        </div>
        <div style="background:#f8f4ff;border-radius:14px;padding:14px;">
          <div style="font-size:12px;color:#777;">Status</div>
          <div style="font-weight:800;color:#0f8a4b;">${order.status || "Order Placed"}</div>
        </div>
      </div>

      <h3 style="margin:0 0 12px;color:#222;">Items Ordered</h3>
      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #eee;border-radius:14px;overflow:hidden;">
        <thead>
          <tr style="background:#faf7ff;">
            <th align="left" style="padding:12px 10px;color:#555;font-size:13px;">Product</th>
            <th align="center" style="padding:12px 10px;color:#555;font-size:13px;">Qty</th>
            <th align="right" style="padding:12px 10px;color:#555;font-size:13px;">Price</th>
            <th align="right" style="padding:12px 10px;color:#555;font-size:13px;">Total</th>
          </tr>
        </thead>
        <tbody>${productRows(order)}</tbody>
      </table>

      <div style="margin-top:22px;background:#fafafa;border-radius:16px;padding:18px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Subtotal</span><b>${rupee(order.subtotal)}</b></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Shipping</span><b>${rupee(order.shippingCharge)}</b></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Tax</span><b>${rupee(order.tax)}</b></div>
        <hr style="border:none;border-top:1px solid #ddd;margin:12px 0;">
        <div style="display:flex;justify-content:space-between;font-size:20px;color:#4B1E78;"><span><b>Grand Total</b></span><b>${rupee(order.totalAmount)}</b></div>
      </div>

      <div style="margin-top:24px;">
        <h3 style="margin:0 0 10px;color:#222;">Delivery Address</h3>
        <p style="margin:0;color:#555;line-height:1.7;">
          <b>${order.customerName || ""}</b><br>
          ${order.address || ""}<br>
          ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}<br>
          Phone: ${order.phone || ""}
        </p>
      </div>

      <div style="margin-top:26px;text-align:center;">
        <a href="${
    order.trackingUrl
        ? order.trackingUrl
        : `${process.env.STORE_URL || "https://cosmocartt.com"}/orders`
}" style="display:inline-block;background:#4B1E78;color:#fff;text-decoration:none;padding:13px 24px;border-radius:14px;font-weight:800;">
          View / Track Order
        </a>
      </div>

      <p style="margin-top:26px;color:#777;line-height:1.6;">
        We will notify you once your order is packed and shipped. For help, contact CosmoCartt support.
      </p>
    </div>
  </div>
</div>
`;

export const buildOrderStatusEmail = ({ order, status }) => {
    const isDelivered = status === "Delivered";

    return `
<div style="font-family:Arial,sans-serif;background:#f5f0fb;padding:28px;">
  <div style="max-width:720px;margin:auto;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #eadff7;">
    <div style="background:linear-gradient(135deg,#2B1055,#6F2DBD);padding:28px;color:#fff;">
      <h1 style="margin:0;font-size:28px;">CosmoCartt</h1>
      <p style="margin:10px 0 0;font-size:18px;font-weight:700;">
        ${isDelivered ? "Order Delivered ✅" : "Order Shipped 🚚"}
      </p>
      <p style="margin:6px 0 0;color:#eadcff;">
        Order ${order.orderNumber}
      </p>
    </div>

    <div style="padding:26px;">
      <p>Hello <b>${order.customerName || "Customer"}</b>,</p>
      <p style="color:#555;line-height:1.7;">
        ${
            isDelivered
                ? "Your order has been delivered successfully. Thank you for shopping with CosmoCartt."
                : "Your order has been shipped and is now on the way to you."
        }
      </p>

      <h3 style="margin-top:22px;">Order Summary</h3>
      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #eee;">
        <thead>
          <tr style="background:#faf7ff;">
            <th align="left" style="padding:12px 10px;">Product</th>
            <th align="center" style="padding:12px 10px;">Qty</th>
            <th align="right" style="padding:12px 10px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${(order.products || []).map(p => `
            <tr>
              <td style="padding:12px 10px;border-top:1px solid #eee;">${p.name}</td>
              <td style="padding:12px 10px;border-top:1px solid #eee;text-align:center;">${p.quantity}</td>
              <td style="padding:12px 10px;border-top:1px solid #eee;text-align:right;">${rupee(p.price)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <p style="margin-top:18px;"><b>Total:</b> ${rupee(order.totalAmount)}</p>
      ${order.courierName ? `<p><b>Courier:</b> ${order.courierName}</p>` : ""}
      ${order.awbCode ? `<p><b>AWB:</b> ${order.awbCode}</p>` : ""}
      ${order.trackingUrl ? `<p><a href="${order.trackingUrl}" style="color:#4B1E78;font-weight:800;">Track your order</a></p>` : ""}

      <p style="margin-top:24px;color:#777;">Team CosmoCartt ❤️</p>
    </div>
  </div>
</div>
`;
};
