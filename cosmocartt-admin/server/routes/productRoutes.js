import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    getProductBySlug,
    deleteProduct,
    updateProduct,
    importProductsCSV,
    exportProductsCSV,
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";
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
    "/brands",
    async (req, res) => {
        try {
            const brands = await Product.aggregate([
                {
                    $match: {
                        status: "Active",
                        brand: {
                            $exists: true,
                            $ne: ""
                        }
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $group: {
                        _id: {
                            $toLower: {
                                $trim: {
                                    input: "$brand"
                                }
                            }
                        },
                        name: {
                            $first: {
                                $trim: {
                                    input: "$brand"
                                }
                            }
                        },
                        productCount: {
                            $sum: 1
                        },
                        image: {
                            $first: {
                                $arrayElemAt: [
                                    "$images",
                                    0
                                ]
                            }
                        },
                        minPrice: {
                            $min: "$retailPrice"
                        },
                        maxPrice: {
                            $max: "$retailPrice"
                        },
                        inStockProducts: {
                            $sum: {
                                $cond: [
                                    {
                                        $gt: [
                                            "$stock",
                                            0
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        productCount: 1,
                        image: 1,
                        minPrice: 1,
                        maxPrice: 1,
                        inStockProducts: 1
                    }
                }
            ]);

            res.json({
                success: true,
                brands
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
    "/catalog",
    async (req, res) => {
        try {
            const products = await Product.find({
                status: "Active"
            })
                .select("category subcategory brand model images retailPrice stock createdAt")
                .lean();

            const categoryMap = new Map();

            products.forEach((product) => {
                const category = String(product.category || "").trim();
                const subcategory = String(product.subcategory || "").trim();
                const brand = String(product.brand || "").trim();
                const model = String(product.model || "").trim();

                if (!category || !subcategory || !brand) return;

                if (!categoryMap.has(category)) {
                    categoryMap.set(category, {
                        name: category,
                        productCount: 0,
                        inStockProducts: 0,
                        minPrice: null,
                        maxPrice: null,
                        image: "",
                        subcategories: new Map()
                    });
                }

                const categoryNode = categoryMap.get(category);
                categoryNode.productCount += 1;
                categoryNode.inStockProducts += Number(product.stock || 0) > 0 ? 1 : 0;
                categoryNode.image = categoryNode.image || product.images?.[0] || "";
                categoryNode.minPrice =
                    categoryNode.minPrice === null
                        ? Number(product.retailPrice || 0)
                        : Math.min(categoryNode.minPrice, Number(product.retailPrice || 0));
                categoryNode.maxPrice =
                    categoryNode.maxPrice === null
                        ? Number(product.retailPrice || 0)
                        : Math.max(categoryNode.maxPrice, Number(product.retailPrice || 0));

                if (!categoryNode.subcategories.has(subcategory)) {
                    categoryNode.subcategories.set(subcategory, {
                        name: subcategory,
                        productCount: 0,
                        inStockProducts: 0,
                        minPrice: null,
                        maxPrice: null,
                        image: "",
                        brands: new Map()
                    });
                }

                const subcategoryNode = categoryNode.subcategories.get(subcategory);
                subcategoryNode.productCount += 1;
                subcategoryNode.inStockProducts += Number(product.stock || 0) > 0 ? 1 : 0;
                subcategoryNode.image = subcategoryNode.image || product.images?.[0] || "";
                subcategoryNode.minPrice =
                    subcategoryNode.minPrice === null
                        ? Number(product.retailPrice || 0)
                        : Math.min(subcategoryNode.minPrice, Number(product.retailPrice || 0));
                subcategoryNode.maxPrice =
                    subcategoryNode.maxPrice === null
                        ? Number(product.retailPrice || 0)
                        : Math.max(subcategoryNode.maxPrice, Number(product.retailPrice || 0));

                if (!subcategoryNode.brands.has(brand)) {
                    subcategoryNode.brands.set(brand, {
                        name: brand,
                        productCount: 0,
                        inStockProducts: 0,
                        minPrice: null,
                        maxPrice: null,
                        image: "",
                        models: new Map()
                    });
                }

                const brandNode = subcategoryNode.brands.get(brand);
                brandNode.productCount += 1;
                brandNode.inStockProducts += Number(product.stock || 0) > 0 ? 1 : 0;
                brandNode.image = brandNode.image || product.images?.[0] || "";
                brandNode.minPrice =
                    brandNode.minPrice === null
                        ? Number(product.retailPrice || 0)
                        : Math.min(brandNode.minPrice, Number(product.retailPrice || 0));
                brandNode.maxPrice =
                    brandNode.maxPrice === null
                        ? Number(product.retailPrice || 0)
                        : Math.max(brandNode.maxPrice, Number(product.retailPrice || 0));

                if (model) {
                    if (!brandNode.models.has(model)) {
                        brandNode.models.set(model, {
                            name: model,
                            productCount: 0,
                            inStockProducts: 0,
                            minPrice: null,
                            maxPrice: null,
                            image: ""
                        });
                    }

                    const modelNode = brandNode.models.get(model);
                    modelNode.productCount += 1;
                    modelNode.inStockProducts += Number(product.stock || 0) > 0 ? 1 : 0;
                    modelNode.image = modelNode.image || product.images?.[0] || "";
                    modelNode.minPrice =
                        modelNode.minPrice === null
                            ? Number(product.retailPrice || 0)
                            : Math.min(modelNode.minPrice, Number(product.retailPrice || 0));
                    modelNode.maxPrice =
                        modelNode.maxPrice === null
                            ? Number(product.retailPrice || 0)
                            : Math.max(modelNode.maxPrice, Number(product.retailPrice || 0));
                }
            });

            const normalizeNode = (node) => {
                const result = { ...node };

                if (result.subcategories instanceof Map) {
                    result.subcategories = Array.from(result.subcategories.values())
                        .map(normalizeNode)
                        .sort((a, b) => a.name.localeCompare(b.name));
                }

                if (result.brands instanceof Map) {
                    result.brands = Array.from(result.brands.values())
                        .map(normalizeNode)
                        .sort((a, b) => a.name.localeCompare(b.name));
                }

                if (result.models instanceof Map) {
                    result.models = Array.from(result.models.values())
                        .map(normalizeNode)
                        .sort((a, b) => a.name.localeCompare(b.name));
                }

                return result;
            };

            const catalog = Array.from(categoryMap.values())
                .map(normalizeNode)
                .sort((a, b) => a.name.localeCompare(b.name));

            res.json({
                success: true,
                catalog
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
    "/catalog/children",
    async (req, res) => {
        try {
            const {
                category,
                subcategory,
                brand
            } = req.query;

            const match = {
                status: "Active"
            };

            let groupField = "$category";
            let level = "category";

            if (category) {
                match.category = category;
                groupField = "$subcategory";
                level = "subcategory";
            }

            if (category && subcategory) {
                match.subcategory = subcategory;
                groupField = "$brand";
                level = "brand";
            }

            if (category && subcategory && brand) {
                match.brand = brand;
                groupField = "$model";
                level = "model";
            }

            const items = await Product.aggregate([
                {
                    $match: {
                        ...match,
                        [groupField.replace("$", "")]: {
                            $exists: true,
                            $ne: ""
                        }
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $group: {
                        _id: {
                            $toLower: {
                                $trim: {
                                    input: groupField
                                }
                            }
                        },
                        name: {
                            $first: {
                                $trim: {
                                    input: groupField
                                }
                            }
                        },
                        productCount: {
                            $sum: 1
                        },
                        image: {
                            $first: {
                                $arrayElemAt: [
                                    "$images",
                                    0
                                ]
                            }
                        },
                        minPrice: {
                            $min: "$retailPrice"
                        },
                        maxPrice: {
                            $max: "$retailPrice"
                        },
                        inStockProducts: {
                            $sum: {
                                $cond: [
                                    {
                                        $gt: [
                                            "$stock",
                                            0
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        productCount: 1,
                        image: 1,
                        minPrice: 1,
                        maxPrice: 1,
                        inStockProducts: 1
                    }
                }
            ]);

            res.json({
                success: true,
                level,
                items
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
    "/export",
    exportProductsCSV
);

router.get(
    "/models/:brand",
    async (req, res) => {
        try {
            const models = await Product.distinct(
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
            const product = await Product.findById(
                req.params.id
            );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.json({
                success: true,
                seo: {
                    title:
                        product.seoTitle ||
                        `${product.name} | CosmoCartt`,

                    description:
                        product.seoDescription ||
                        product.description ||
                        `${product.name} by ${product.brand}`,

                    keywords: [
                        product.focusKeyword,
                        product.name,
                        product.brand,
                        product.category,
                        product.subcategory
                    ].filter(Boolean),

                    canonicalUrl:
                        product.canonicalUrl ||
                        `https://www.cosmocartt.com/product/${product.slug}`
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
    "/seo/slug/:slug",
    async (req, res) => {
        try {
            const product = await Product.findOne({
                slug: req.params.slug
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.json({
                success: true,
                seo: {
                    title:
                        product.seoTitle ||
                        `${product.name} | CosmoCartt`,

                    description:
                        product.seoDescription ||
                        product.description ||
                        `${product.name} by ${product.brand}`,

                    keywords: [
                        product.focusKeyword,
                        product.name,
                        product.brand,
                        product.category,
                        product.subcategory
                    ].filter(Boolean),

                    canonicalUrl:
                        product.canonicalUrl ||
                        `https://www.cosmocartt.com/product/${product.slug}`
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
            const product = await Product.findById(
                req.params.id
            );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            const relatedProducts = await Product.find({
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
