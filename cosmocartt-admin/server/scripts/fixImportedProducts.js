import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI missing in .env");
  process.exit(1);
}

const makeSlug = (name, sku) =>
  `${name}-${sku}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

try {
  await mongoose.connect(process.env.MONGO_URI);

  const products = await Product.find({});
  console.log(`Found ${products.length} products`);

  let fixed = 0;

  for (const product of products) {
    let changed = false;

    if (!product.slug && product.name && product.sku) {
      product.slug = makeSlug(product.name, product.sku);
      changed = true;
    }

    if (!product.model) {
      product.model = product.sku || "Standard Model";
      changed = true;
    }

    if (!product.hsnCode) {
      product.hsnCode = "8517";
      changed = true;
    }

    if (product.gstPercentage === undefined || product.gstPercentage === null) {
      product.gstPercentage = 18;
      changed = true;
    }

    if (!product.sellerId) {
      product.sellerId = "ADMIN";
      changed = true;
    }

    if (!product.sellerName) {
      product.sellerName = "CosmoCartt";
      changed = true;
    }

    if (!product.sellerGSTIN) {
      product.sellerGSTIN = "UNREGISTERED";
      changed = true;
    }

    if (!product.approvalStatus) {
      product.approvalStatus = "Approved";
      changed = true;
    }

    if (!product.status) {
      product.status = "Active";
      changed = true;
    }

    if (!Array.isArray(product.specifications)) {
      product.specifications = [];
      changed = true;
    }

    if (!Array.isArray(product.images)) {
      product.images = [];
      changed = true;
    }

    if (changed) {
      await product.save();
      fixed++;
    }
  }

  console.log(`Fixed ${fixed} products successfully`);
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error("Fix failed:", error);
  await mongoose.disconnect();
  process.exit(1);
}
