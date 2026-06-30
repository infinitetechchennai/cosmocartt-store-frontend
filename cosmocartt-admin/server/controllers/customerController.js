import Customer from "../models/Customer.js";
import bcrypt from "bcryptjs";
import { sendEmail, buildOtpEmail } from "../utils/sendEmail.js";

const generateOtp = () =>
    String(Math.floor(100000 + Math.random() * 900000));

const getOtpExpiry = () =>
    new Date(Date.now() + 10 * 60 * 1000);

const safeCustomer = (customer) => ({
    _id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    customerType: customer.customerType,
    emailVerified: customer.emailVerified || false,
    verificationStatus:
        customer.customerType === "b2b"
            ? customer.verificationStatus
            : null,
    status: customer.status,
    authProvider: customer.authProvider || "local"
});

// GET CUSTOMERS

export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({
            emailVerified: true
        })
            .select("-password -emailOtp")
            .sort({ createdAt: -1 });

        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// REGISTER CUSTOMER WITH OTP

export const registerCustomer = async (req, res) => {
    try {
        const email = String(req.body.email || "").toLowerCase().trim();

        const customerType =
            req.body.customerType === "b2b"
                ? "b2b"
                : "b2c";

        if (!req.body.name || !email || !req.body.password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingCustomer = await Customer.findOne({ email });

        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const customer = await Customer.create({
            ...req.body,
            email,
            customerType,
            verificationStatus:
                customerType === "b2b"
                    ? "Pending"
                    : null,
            emailVerified: false,
            emailOtp: hashedOtp,
            emailOtpExpiry: getOtpExpiry(),
            emailOtpAttempts: 0,
            authProvider: "local",
            gstCertificate:
                req.file
                    ? req.file.filename
                    : "",
            password: hashedPassword
        });

        await sendEmail({
            to: email,
            subject: "Verify your CosmoCartt account",
            html: buildOtpEmail({
                name: customer.name,
                otp
            })
        });

        res.status(201).json({
            success: true,
            message: "Registration successful. OTP sent to email.",
            requiresOtp: true,
            customer: safeCustomer(customer)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// VERIFY OTP

export const verifyCustomerOtp = async (req, res) => {
    try {
        const email = String(req.body.email || "").toLowerCase().trim();
        const otp = String(req.body.otp || "").trim();

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        if (customer.emailVerified) {
            return res.json({
                success: true,
                message: "Email already verified",
                customer: safeCustomer(customer)
            });
        }

        if (!customer.emailOtp || !customer.emailOtpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP not found. Please resend OTP."
            });
        }

        if (customer.emailOtpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired. Please resend OTP."
            });
        }

        if ((customer.emailOtpAttempts || 0) >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many wrong attempts. Please resend OTP."
            });
        }

        const isValidOtp = await bcrypt.compare(
            otp,
            customer.emailOtp
        );

        if (!isValidOtp) {
            customer.emailOtpAttempts =
                (customer.emailOtpAttempts || 0) + 1;

            await customer.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        customer.emailVerified = true;
        customer.emailOtp = "";
        customer.emailOtpExpiry = undefined;
        customer.emailOtpAttempts = 0;

        if (customer.customerType === "b2c") {
            customer.verificationStatus = null;
        }

        await customer.save();

        res.json({
            success: true,
            message: "Email verified successfully",
            customer: safeCustomer(customer)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// RESEND OTP

export const resendCustomerOtp = async (req, res) => {
    try {
        const email = String(req.body.email || "").toLowerCase().trim();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        if (customer.emailVerified) {
            return res.json({
                success: true,
                message: "Email already verified"
            });
        }

        const otp = generateOtp();

        const hashedOtp = await bcrypt.hash(otp, 10);

        await Customer.updateOne(
            { _id: customer._id },
            {
                $set: {
                    emailOtp: hashedOtp,
                    emailOtpExpiry: getOtpExpiry(),
                    emailOtpAttempts: 0
                }
            }
        );

        console.log("OTP GENERATED FOR:", customer.email);
        console.log("OTP DEBUG LOCAL:", otp);

        await sendEmail({
            to: email,
            subject: "Your new CosmoCartt OTP",
            html: buildOtpEmail({
                name: customer.name,
                otp
            })
        });

        res.json({
            success: true,
            message: "OTP resent successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// LOGIN CUSTOMER

export const loginCustomer = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const customer = await Customer.findOne({
            email: String(email || "").toLowerCase().trim()
        });

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (customer.authProvider !== "local" && !customer.password) {
            return res.status(400).json({
                success: false,
                message: `Please login using ${customer.authProvider}`
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            customer.password
        );

        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (!customer.emailVerified) {
            return res.status(403).json({
                success: false,
                requiresOtp: false,
                message: "Please verify your email from the registration OTP before login.",
                customer: safeCustomer(customer)
            });
        }

        if (
            customer.customerType === "b2b" &&
            customer.verificationStatus === "Rejected"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Your B2B application has been rejected. Please contact support."
            });
        }

        if (
            customer.customerType === "b2b" &&
            customer.verificationStatus === "Pending"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Your B2B account is awaiting verification."
            });
        }

        customer.lastLogin = new Date();

        if (customer.customerType === "b2c") {
            customer.verificationStatus = null;
        }

        await customer.save();

        res.json({
            success: true,
            customer: safeCustomer(customer)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE CUSTOMER

export const updateCustomer = async (req, res) => {
    try {
        const updateData = { ...req.body };

        delete updateData.password;
        delete updateData.emailOtp;

        if (updateData.customerType === "b2c") {
            updateData.verificationStatus = null;
        }

        if (
            updateData.customerType === "b2b" &&
            !updateData.verificationStatus
        ) {
            updateData.verificationStatus = "Pending";
        }

        const updatedCustomer =
            await Customer.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            ).select("-password -emailOtp");

        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE CUSTOMER

export const deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// FORGOT PASSWORD - SEND OTP

export const forgotCustomerPassword = async (req, res) => {
    try {
        const email = String(req.body.email || "").toLowerCase().trim();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            });
        }

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        await Customer.updateOne(
            { _id: customer._id },
            {
                $set: {
                    emailOtp: hashedOtp,
                    emailOtpExpiry: getOtpExpiry(),
                    emailOtpAttempts: 0
                }
            }
        );

        await sendEmail({
            to: email,
            subject: "Reset your CosmoCartt password",
            html: buildOtpEmail({
                name: customer.name,
                otp
            })
        });

        res.json({
            success: true,
            message: "Password reset OTP sent to email"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// RESET PASSWORD USING OTP

export const resetCustomerPassword = async (req, res) => {
    try {
        const email = String(req.body.email || "").toLowerCase().trim();
        const otp = String(req.body.otp || "").trim();
        const newPassword = String(req.body.newPassword || "");

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        if (!customer.emailOtp || !customer.emailOtpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP not found. Please request a new OTP."
            });
        }

        if (customer.emailOtpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new OTP."
            });
        }

        if ((customer.emailOtpAttempts || 0) >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many wrong attempts. Please request a new OTP."
            });
        }

        const validOtp = await bcrypt.compare(
            otp,
            customer.emailOtp
        );

        if (!validOtp) {
            customer.emailOtpAttempts =
                (customer.emailOtpAttempts || 0) + 1;

            await customer.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        customer.password = await bcrypt.hash(newPassword, 10);
        customer.emailVerified = true;
        customer.emailOtp = "";
        customer.emailOtpExpiry = undefined;
        customer.emailOtpAttempts = 0;
        customer.authProvider = "local";

        if (customer.customerType === "b2c") {
            customer.verificationStatus = null;
        }

        await customer.save();

        res.json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


