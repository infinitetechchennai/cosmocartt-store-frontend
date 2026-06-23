import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "Homepage Banner",
                "Flash Sale",
                "Coupon",
                "Festival Offer",
                "Email Campaign"
            ],
            default: "Homepage Banner"
        },

        description: String,

        discountCode: String,

        discountPercentage: {
            type: Number,
            default: 0
        },

        bannerText: String,

        startDate: String,

        endDate: String,

        status: {
            type: String,
            enum: [
                "Draft",
                "Active",
                "Scheduled",
                "Expired"
            ],
            default: "Draft"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Campaign",
    campaignSchema
);