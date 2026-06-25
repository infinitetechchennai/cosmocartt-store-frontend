import mongoose from "mongoose";

const cmsPageSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true
        },

        title: {
            type: String,
            required: true
        },

        content: {
            type: String,
            default: ""
        },

        fields: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        metaTitle: {
            type: String,
            default: ""
        },

        metaDescription: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["Draft", "Published"],
            default: "Draft"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "CMSPage",
    cmsPageSchema
);