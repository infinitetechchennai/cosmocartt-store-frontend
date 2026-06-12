import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const product = {
    name: "Apple iPhone 15",
    brand: "Apple",
    category: "Mobile Accessories",
    subcategory: "Mobile Chargers",
    sku: "APL-IP15-001",
    costPrice: 70000,
    wholesalePrice: 75000,
    retailPrice: 80000,
    stock: 50,
    image: "",
};

async function seed() {
    await Product.create(product);

    console.log("Product Added");
    process.exit();
}

seed();