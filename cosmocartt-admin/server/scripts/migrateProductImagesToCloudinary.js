import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

dotenv.config();

const execute = process.argv.includes("--execute");

await mongoose.connect(process.env.MONGO_URI);

const products = await Product.find();

const backupFile = `products-images-backup-${Date.now()}.json`;

fs.writeFileSync(
    backupFile,
    JSON.stringify(
        products.map(p => ({
            _id: p._id,
            name: p.name,
            images: p.images
        })),
        null,
        2
    )
);

console.log("Backup created:", backupFile);

let updatedProducts = 0;
let uploadedImages = 0;
let skippedImages = 0;
let missingImages = 0;

for (const product of products) {
    const newImages = [];

    for (const image of product.images || []) {
        if (!image) continue;

        if (
            image.includes("cloudinary.com") ||
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            newImages.push(image);
            skippedImages++;
            continue;
        }

        const cleanPath = image.replace(/^\/+/, "");
        const localPath = path.join(process.cwd(), cleanPath);

        if (!fs.existsSync(localPath)) {
            console.log("Missing file:", localPath);
            newImages.push(image);
            missingImages++;
            continue;
        }

        console.log("Uploading:", localPath);

        if (!execute) {
            newImages.push(image);
            continue;
        }

        const uploaded = await cloudinary.uploader.upload(localPath, {
            folder: "CosmoCartt/products"
        });

        newImages.push(uploaded.secure_url);
        uploadedImages++;
    }

    if (execute) {
        product.images = newImages;
        await product.save();
        updatedProducts++;
    }
}

console.log({
    execute,
    totalProducts: products.length,
    updatedProducts,
    uploadedImages,
    skippedImages,
    missingImages
});

await mongoose.disconnect();
