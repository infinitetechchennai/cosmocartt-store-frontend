import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
        },

        userId: {
            type: String,
            required: true,
        },

        customerName: String,

        email: String,

        phone: String,

        address: String,

        city: String,

        state: String,

        pincode: String,

        products: [
            {
                productId: String,

                name: String,

                image: String,

                quantity: Number,

                price: Number,
            },
        ],

        subtotal: Number,

        shippingCharge: {
            type: Number,
            default: 100,
        },

        tax: {
            type: Number,
            default: 200,
        },

        totalAmount: Number,

        paymentMethod: {
            type: String,
            default: "COD",
        },

        razorpayOrderId: String,

        razorpayPaymentId: String,

        paymentStatus: {
            type: String,
            default: "Pending"
        },

        shiprocketOrderId: String,

        shipmentId: String,

        awbCode: String,

        courierName: String,

        trackingUrl: String,

        status: {
            type: String,
            default: "Order Placed",
        },

        refundStatus: {
            type: String,
            enum: [
                "Not Requested",
                "Requested",
                "Approved",
                "Rejected",
                "Completed"
            ],
            default: "Not Requested"
        },

        refundReason: {
            type: String,
            default: ""
        },

        refundRequestedAt: Date,

        refundProcessedAt: Date,

        trackingTimeline: [
            {
                status: String,
                date: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Order", orderSchema);