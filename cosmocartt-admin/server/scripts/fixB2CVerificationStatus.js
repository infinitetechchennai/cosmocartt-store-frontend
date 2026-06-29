import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "../models/Customer.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const result = await Customer.updateMany(
    { customerType: { $ne: "b2b" } },
    {
        $set: {
            customerType: "b2c",
            verificationStatus: null
        }
    }
);

console.log(`Fixed B2C customers: ${result.modifiedCount}`);

await mongoose.disconnect();
process.exit(0);
