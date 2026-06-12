import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import { importProductsCSV } from "../controllers/productController.js";
import {
    exportProductsCSV
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);

router.post(
    "/import",
    upload.single("file"),
    importProductsCSV
);
router.get("/", getProducts);

router.get(
    "/export",
    exportProductsCSV
);
router.get("/:id", getProductById);

router.delete("/:id", deleteProduct);

router.put("/:id", updateProduct);

export default router;