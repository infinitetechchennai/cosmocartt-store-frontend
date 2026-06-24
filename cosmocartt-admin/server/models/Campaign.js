import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "Homepage Banner",
                "Flash Sale",
                "Coupon",
                "Festival Offer"
            ],
            default: "Homepage Banner"
        },

        status: {
            type: String,
            enum: [
                "Draft",
                "Active",
                "Scheduled",
                "Expired"
            ],
            default: "Draft"
        },

        bannerText: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
        },

        discountCode: {
            type: String,
            default: ""
        },

        discountPercentage: {
            type: Number,
            default: 0
        },

        startDate: {
            type: String,
            default: ""
        },

        endDate: {
            type: String,
            default: ""
        },

        placement: {
            type: String,
            enum: [
                "Home",
                "Products",
                "All Store"
            ],
            default: "Home"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Campaign", campaignSchema);