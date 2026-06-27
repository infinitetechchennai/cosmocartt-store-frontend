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
            to: [
                {
                    email: to
                }
            ],
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

export const buildOtpEmail = ({ name, otp }) => {
    return `
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
};
