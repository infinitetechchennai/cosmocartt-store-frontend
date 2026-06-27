import Customer from "../models/Customer.js";
import bcrypt from "bcryptjs";

// GET CUSTOMERS

export const getCustomers = async (req, res) => {

    try {

        const customers = await Customer.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(customers);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// REGISTER CUSTOMER

export const registerCustomer = async (req, res) => {

    try {

        const email = String(req.body.email || "").toLowerCase().trim();

        const customerType =
            req.body.customerType === "b2b"
                ? "b2b"
                : "b2c";

        const existingCustomer =
            await Customer.findOne({
                email
            });

        if (existingCustomer) {

            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });

        }

        const hashedPassword =
            await bcrypt.hash(
                req.body.password,
                10
            );

        const customer =
            await Customer.create({

                ...req.body,

                email,

                customerType,

                verificationStatus:
                    customerType === "b2b"
                        ? "Pending"
                        : null,

                emailVerified: false,

                gstCertificate:
                    req.file
                        ? req.file.filename
                        : "",

                password: hashedPassword

            });

        res.status(201).json({
            success: true,
            customer: {
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                customerType: customer.customerType,
                emailVerified: customer.emailVerified,
                verificationStatus:
                    customer.customerType === "b2b"
                        ? customer.verificationStatus
                        : null,
                status: customer.status
            }
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

        const customer =
            await Customer.findOne({
                email: String(email || "").toLowerCase().trim()
            });

        if (!customer) {

            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });

        }

        const validPassword =
            await bcrypt.compare(
                password,
                customer.password
            );

        if (!validPassword) {

            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
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
            customer: {
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                customerType: customer.customerType,
                emailVerified: customer.emailVerified || false,
                verificationStatus:
                    customer.customerType === "b2b"
                        ? customer.verificationStatus
                        : null
            }
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
            ).select("-password");

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
