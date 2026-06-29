import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import csv from "csv-parser";
import Product from "../models/Product.js";

dotenv.config();

const filePath = process.argv[2];

if (!filePath) {
  console.error("CSV file path required");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI missing in .env");
  process.exit(1);
}

const clean = (value) => value ? String(value).trim() : "";

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const makeSlug = (name, sku) =>
  `${name}-${sku}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const products = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    const name = clean(row.name);
    const sku = clean(row.sku);

    if (!name || !sku) return;

    const images = [
      clean(row.image1),
      clean(row.image2),
      clean(row.image3),
      clean(row.image4),
      clean(row.image5),
      clean(row.image6)
    ].filter(Boolean);

    products.push({
      name,
      slug: clean(row.slug) || makeSlug(name, sku),
      brand: clean(row.brand) || "CosmoCartt",
      model: clean(row.model),
      category: clean(row.category) || "General",
      subcategory: clean(row.subcategory) || "General",
      description: clean(row.description),
      sku,
      costPrice: toNumber(row.costPrice),
      wholesalePrice: toNumber(row.wholesalePrice || row.retailPrice),
      retailPrice: toNumber(row.retailPrice),
      stock: toNumber(row.stock, 10),
      images,
      status: clean(row.status) || "Active",
      hsnCode: clean(row.hsnCode),
      gstPercentage: toNumber(row.gstPercentage, 18),
      sellerId: clean(row.sellerId) || "ADMIN",
      sellerName: clean(row.sellerName) || "CosmoCartt",
      sellerGSTIN: clean(row.sellerGSTIN),
      approvalStatus: clean(row.approvalStatus) || "Approved",
      specifications: []
    });
  })
  .on("end", async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);

      console.log(`CSV loaded: ${products.length} products`);

      for (const product of products) {
        await Product.findOneAndUpdate(
          { sku: product.sku },
          product,
          {
            upsert: true,
            new: true,
            runValidators: true
          }
        );
      }

      console.log("Products imported successfully");
      await mongoose.disconnect();
      process.exit(0);
    } catch (error) {
      console.error("Import failed:", error);
      await mongoose.disconnect();
      process.exit(1);
    }
  });
