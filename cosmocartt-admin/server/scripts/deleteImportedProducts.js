import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const result = await Product.deleteMany({
  sku: { $regex: "^[A-Z]{3}-[0-9]{5}$" }
});

console.log(`Deleted ${result.deletedCount} imported products`);

await mongoose.disconnect();
process.exit(0);
