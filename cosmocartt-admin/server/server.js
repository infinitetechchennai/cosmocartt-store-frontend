import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import shiprocketRoutes
  from "./routes/shiprocketRoutes.js";
import invoiceRoutes
  from "./routes/invoiceRoutes.js";
import reviewRoutes
  from "./routes/reviewRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();


const app = express();
app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use(
  "/api/shiprocket",
  shiprocketRoutes
);

app.use("/", seoRoutes);

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/customers", customerRoutes);
app.use(
  "/api/invoice",
  invoiceRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

console.log("MONGO_URI =", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });


app.use(
  "/api/reports",
  reportRoutes
);
app.use("/api/auth", authRoutes);

app.use("/api/campaigns", campaignRoutes);

app.use("/api/cms", cmsRoutes);

app.use("/api/products", productRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

