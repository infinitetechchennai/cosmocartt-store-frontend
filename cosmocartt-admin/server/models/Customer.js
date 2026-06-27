import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: String,

        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: String,

        password: String,

        customerType: {
            type: String,
            enum: ["b2c", "b2b"],
            default: "b2c"
        },

        emailVerified: {
            type: Boolean,
            default: false
        },

        verificationStatus: {
            type: String,
            enum: [
                "Pending",
                "Verified",
                "Rejected",
                null
            ],
            default: null
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

customerSchema.pre("save", function (next) {
    if (this.customerType === "b2b") {
        if (!this.verificationStatus) {
            this.verificationStatus = "Pending";
        }
    }

    if (this.customerType === "b2c") {
        this.verificationStatus = null;
    }

    next();
});

export default mongoose.model(
    "Customer",
    customerSchema
);
