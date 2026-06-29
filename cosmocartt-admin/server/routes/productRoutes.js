import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    getProductBySlug,
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

router.get(
    "/seo/:id",
    async (req, res) => {

        try {

            const product =
                await Product.findById(
                    req.params.id
                );

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Product not found"
                });

            }

            res.json({

                success: true,

                seo: {

                    title:
                        `${product.name} | CosmoCartt`,

                    description:
                        product.description ||

                        `${product.name} by ${product.brand}`,

                    keywords: [

                        product.name,
                        product.brand,
                        product.category,
                        product.subcategory

                    ],

                    canonicalUrl:

                        `http://localhost:5173/product/${product._id}`

                }

            });

        } catch (error) {

            res.status(500).json({

                success: false,
                message: error.message

            });

        }

    }
);


router.get(
    "/related/:id",
    async (req, res) => {

        try {

            const product =
                await Product.findById(
                    req.params.id
                );

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Product not found"
                });

            }

            const relatedProducts =
                await Product.find({
                    _id: {
                        $ne: product._id
                    },
                    status: "Active",
                    category: product.category,
                    subcategory: product.subcategory
                })
                    .limit(8)
                    .sort({
                        createdAt: -1
                    });

            res.json({
                success: true,
                products: relatedProducts
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }
);

router.get(
    "/slug/:slug",
    getProductBySlug
);

router.get("/:id", getProductById);

router.delete("/:id", deleteProduct);

router.put(
    "/:id",
    productUpload.array(
        "images",
        6
    ),
    updateProduct
);

export default router;