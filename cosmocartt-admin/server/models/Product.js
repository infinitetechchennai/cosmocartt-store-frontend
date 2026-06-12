import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        brand: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        subcategory: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: ""
        },

        sku: {
            type: String,
            required: true,
            unique: true,
        },

        costPrice: {
            type: Number,
            required: true,
        },

        wholesalePrice: {
            type: Number,
            required: true,
        },

        retailPrice: {
            type: Number,
            required: true,
        },

        stock: {
            type: Number,
            default: 0,
        },

        image: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Product", productSchema);