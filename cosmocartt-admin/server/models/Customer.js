import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: String,

        email: {
            type: String,
            unique: true
        },

        phone: String,

        password: String,

        customerType: {
            type: String,
            enum: ["b2c", "b2b"],
            default: "b2c"
        },

        verificationStatus: {
            type: String,
            enum: [
                "Pending",
                "Verified",
                "Rejected"
            ],
            default: "Pending"
        },

        status: {
            type: String,
            default: "Active"
        },

        businessName: String,

        contactPerson: String,

        gstNumber: String,

        businessAddress: String,

        gstCertificate: String,

        wishlist: [
            {
                type: String
            }
        ],

        lastLogin: Date
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Customer",
    customerSchema
);