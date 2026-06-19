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
import productUpload from "../middleware/productUploadMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post(
    "/",
    productUpload.array(
        "images",
        6
    ),
    createProduct
);

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

router.get(
    "/models/:brand",
    async (req, res) => {

        try {

            const models =
                await Product.distinct(
                    "model",
                    {
                        brand: req.params.brand,
                        model: {
                            $ne: ""
                        }
                    }
                );

            res.json({
                success: true,
                models
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }
);

router.get("/:id", getProductById);

router.delete("/:id", deleteProduct);

router.put("/:id", updateProduct);

export default router;