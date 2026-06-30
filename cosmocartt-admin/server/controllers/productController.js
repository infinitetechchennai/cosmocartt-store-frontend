import Product from "../models/Product.js";
import csv from "csv-parser";
import { Readable } from "stream";
import { Parser } from "json2csv";
import fs from "fs";
import { uploadBuffer } from "../utils/cloudinaryUpload.js";
import { deleteImage } from "../utils/cloudinaryDelete.js";

const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const generateUniqueSlug = async (name, existingId = null) => {
    const baseSlug = generateSlug(name || "product");

    let slug = baseSlug;
    let count = 1;

    while (
        await Product.findOne({
            slug,
            ...(existingId
                ? {
                    _id: {
                        $ne: existingId,
                    },
                }
                : {}),
        })
    ) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    return slug;
};

const parseFaqs = (faqs) => {
    if (!faqs) return [];

    let parsedFaqs = faqs;

    if (typeof faqs === "string") {
        try {
            parsedFaqs = JSON.parse(faqs);
        } catch {
            return [];
        }
    }

    if (!Array.isArray(parsedFaqs)) return [];

    return parsedFaqs
        .map((faq) => ({
            question: faq.question?.trim() || "",
            answer: faq.answer?.trim() || "",
        }))
        .filter((faq) => {
            const hasQuestion = faq.question.length > 0;
            const hasAnswer = faq.answer.length > 0;

            if (!hasQuestion && !hasAnswer) {
                return false;
            }

            if (!hasQuestion || !hasAnswer) {
                throw new Error("FAQ question and answer are both required.");
            }

            return true;
        });
};

const getCsvStream = (req) => {
    if (req.file?.path) {
        return fs.createReadStream(req.file.path);
    }

    if (req.file?.buffer) {
        return Readable.from([req.file.buffer]);
    }

    return null;
};

export const createProduct = async (req, res) => {
    try {
        const imagePaths = [];

        if (req.files?.length) {
            for (const file of req.files) {
                try {
                    const uploaded = await uploadBuffer(
                        file.buffer,
                        "CosmoCartt/products"
                    );

                    imagePaths.push(uploaded.secure_url);
                } catch (err) {
                    console.error(
                        "Cloudinary Upload Failed:",
                        err.message
                    );
                }
            }
        }

        const slug = await generateUniqueSlug(req.body.name);

        const product = await Product.create({
            ...req.body,
            slug,
            images: imagePaths,
            seoTitle: req.body.seoTitle || "",
            seoDescription: req.body.seoDescription || "",
            focusKeyword: req.body.focusKeyword || "",
            canonicalUrl: req.body.canonicalUrl || "",
            faqs: parseFaqs(req.body.faqs),
        });

        return res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const {
            category,
            subcategory,
            brand,
            model,
            search
        } = req.query;

        const filter = {};

        if (category) filter.category = category;
        if (subcategory) filter.subcategory = subcategory;
        if (brand) filter.brand = brand;
        if (model) filter.model = model;

        if (search) {
            const searchRegex = new RegExp(search, "i");

            filter.$or = [
                { name: searchRegex },
                { brand: searchRegex },
                { model: searchRegex },
                { category: searchRegex },
                { subcategory: searchRegex },
                { sku: searchRegex }
            ];
        }

        const products = await Product.find(filter).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error?.message);
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Get products failed",
            stack: process.env.NODE_ENV === "production" ? undefined : error?.stack
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({
            slug: req.params.slug,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (Array.isArray(product.images)) {
            for (const image of product.images) {
                await deleteImage(image);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product deleted",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updateData = {
            ...req.body,
        };

        const existingProduct = await Product.findById(req.params.id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (typeof updateData.existingImages === "string") {
            try {
                updateData.images = JSON.parse(updateData.existingImages);
            } catch {
                updateData.images = updateData.existingImages
                    .split("|")
                    .map((img) => img.trim())
                    .filter(Boolean);
            }
        } else if (typeof updateData.images === "string") {
            try {
                updateData.images = JSON.parse(updateData.images);
            } catch {
                updateData.images = updateData.images
                    .split("|")
                    .map((img) => img.trim())
                    .filter(Boolean);
            }
        } else if (!Array.isArray(updateData.images)) {
            updateData.images = existingProduct.images || [];
        }

        delete updateData.existingImages;

        if (Object.prototype.hasOwnProperty.call(req.body, "faqs")) {
            updateData.faqs = parseFaqs(req.body.faqs);
        }

        if (req.files?.length) {
            for (const file of req.files) {
                try {
                    const uploaded = await uploadBuffer(
                        file.buffer,
                        "CosmoCartt/products"
                    );

                    updateData.images.push(uploaded.secure_url);
                } catch (err) {
                    return res.status(500).json({
                        success: false,
                        message:
                            err.message ||
                            "Cloudinary image upload failed",
                    });
                }
            }
        }

        updateData.images = updateData.images
            .filter(Boolean)
            .slice(0, 6);

        if (req.body.name) {
            updateData.slug = await generateUniqueSlug(
                req.body.name,
                req.params.id
            );
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const importProductsCSV = async (req, res) => {
    console.log("IMPORT ROUTE HIT");

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "CSV file is required",
            });
        }

        const stream = getCsvStream(req);

        if (!stream) {
            return res.status(400).json({
                success: false,
                message: "CSV file could not be read",
            });
        }

        const products = [];

        stream
            .pipe(csv())
            .on("error", (err) => {
                console.error("CSV ERROR:", err);

                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            })
            .on("data", (row) => {
                products.push(row);
            })
            .on("end", async () => {
                try {
                    let imported = 0;
                    let skipped = 0;

                    for (const item of products) {
                        const existingProduct = await Product.findOne({
                            sku: item.sku,
                        });

                        if (existingProduct) {
                            skipped++;
                            continue;
                        }

                        const slug = await generateUniqueSlug(item.name);

                        await Product.create({
                            name: item.name,
                            slug,
                            brand: item.brand,
                            model: item.model || "",
                            category: item.category,
                            subcategory: item.subcategory,
                            description: item.description || "",

                            seoTitle: item.seoTitle || "",
                            seoDescription: item.seoDescription || "",
                            focusKeyword: item.focusKeyword || "",
                            canonicalUrl: item.canonicalUrl || "",

                            sku: item.sku,
                            costPrice: Number(item.costPrice),
                            wholesalePrice: Number(item.wholesalePrice),
                            retailPrice: Number(item.retailPrice),
                            stock: Number(item.stock || 0),

                            images: item.images
                                ? item.images
                                    .split("|")
                                    .map((img) => img.trim())
                                    .filter(Boolean)
                                : [],

                            hsnCode: item.hsnCode || "",
                            gstPercentage: Number(
                                item.gstPercentage || 18
                            ),

                            sellerId: item.sellerId || "ADMIN",
                            sellerName:
                                item.sellerName || "CosmoCartt",
                            sellerGSTIN: item.sellerGSTIN || "",

                            approvalStatus:
                                item.approvalStatus || "Approved",
                            status: item.status || "Active",

                            faqs: item.faqs
                                ? parseFaqs(item.faqs)
                                : [],
                        });

                        imported++;
                    }

                    return res.status(200).json({
                        success: true,
                        imported,
                        skipped,
                        totalRows: products.length,
                    });
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: error.message,
                    });
                }
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const exportProductsCSV = async (req, res) => {
    try {
        const products = await Product.find().lean();

        const fields = [
            "name",
            "slug",
            "brand",
            "model",
            "category",
            "subcategory",
            "description",

            "seoTitle",
            "seoDescription",
            "focusKeyword",
            "canonicalUrl",

            "sku",
            "costPrice",
            "wholesalePrice",
            "retailPrice",
            "stock",
            "images",
            "status",
            "hsnCode",
            "gstPercentage",
            "sellerId",
            "sellerName",
            "sellerGSTIN",
            "approvalStatus",
            "faqs",
        ];

        const parser = new Parser({
            fields,
        });

        const formattedProducts = products.map((product) => ({
            ...product,
            images: product.images?.join("|") || "",
            faqs: product.faqs?.length
                ? JSON.stringify(product.faqs)
                : "",
        }));

        const csv = parser.parse(formattedProducts);

        res.header("Content-Type", "text/csv");

        res.attachment("products.csv");

        return res.send(csv);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};