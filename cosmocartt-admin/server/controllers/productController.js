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

const generateUniqueSlug = async (
    name,
    existingId = null
) => {

    let baseSlug =
        generateSlug(name);

    let slug =
        baseSlug;

    let count =
        1;

    while (
        await Product.findOne({
            slug,
            ...(existingId
                ? {
                    _id: {
                        $ne: existingId
                    }
                }
                : {})
        })
    ) {

        slug =
            `${baseSlug}-${count}`;

        count++;

    }

    return slug;

};

export const createProduct = async (
    req,
    res
) => {

    try {

        const imagePaths = [];

        if (req.files?.length) {

            for (const file of req.files) {

                try {

                    const uploaded =
                        await uploadBuffer(
                            file.buffer,
                            "CosmoCartt/products"
                        );

                    imagePaths.push(
                        uploaded.secure_url
                    );

                } catch (err) {

                    console.error(
                        "Cloudinary Upload Failed:",
                        err.message
                    );

                }

            }

        }

        const slug =
            await generateUniqueSlug(
                req.body.name
            );

        const product =
            await Product.create({

                ...req.body,

                slug,

                images: imagePaths,

            });

        res.status(201).json({
            success: true,
            product,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {

        console.error("UPDATE PRODUCT ERROR:", error?.message);
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Update product failed",
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

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProductBySlug = async (
    req,
    res
) => {

    try {

        const product =
            await Product.findOne({
                slug: req.params.slug
            });

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found",
            });

        }

        res.status(200).json({
            success: true,
            product,
        });

    } catch (error) {

        res.status(500).json({
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

        res.status(200).json({
            success: true,
            message: "Product deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {

        const updateData = {
            ...req.body
        };

        if (typeof updateData.existingImages === "string") {
            try {
                updateData.images = JSON.parse(updateData.existingImages);
            } catch {
                updateData.images = updateData.existingImages
                    .split("|")
                    .map(img => img.trim())
                    .filter(Boolean);
            }
        } else if (typeof updateData.images === "string") {
            try {
                updateData.images = JSON.parse(updateData.images);
            } catch {
                updateData.images = updateData.images
                    .split("|")
                    .map(img => img.trim())
                    .filter(Boolean);
            }
        }

        delete updateData.existingImages;

        if (!Array.isArray(updateData.images)) {
            updateData.images = [];
        }

        if (req.files?.length) {

            for (const file of req.files) {

                try {

                    const uploaded =
                        await uploadBuffer(
                            file.buffer,
                            "CosmoCartt/products"
                        );

                    updateData.images.push(
                        uploaded.secure_url
                    );

                } catch (err) {

                    console.error(
                        "Cloudinary Update Upload Failed:",
                        err.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            err.message ||
                            "Cloudinary image upload failed"
                    });

                }

            }

        }

        updateData.images =
            updateData.images
                .filter(Boolean)
                .slice(0, 6);

        if (req.body.name) {

            updateData.slug =
                await generateUniqueSlug(
                    req.body.name,
                    req.params.id
                );

        }

        const existingProduct = await Product.findById(req.params.id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const oldImages = Array.isArray(existingProduct.images)
            ? existingProduct.images
            : [];

        const newImages = Array.isArray(updateData.images)
            ? updateData.images
            : [];

        const removedImages = oldImages.filter(
            image => !newImages.includes(image)
        );

        for (const image of removedImages) {
            await deleteImage(image);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const importProductsCSV = async (req, res) => {
    console.log("IMPORT ROUTE HIT");
    try {

        if (!req.file) {
            console.log("FILE NAME:", req.file?.originalname);
            console.log("FILE SIZE:", req.file?.size);
            console.log("BUFFER EXISTS:", !!req.file?.buffer);
            return res.status(400).json({
                success: false,
                message: "CSV file is required",
            });
        }

        const products = [];



        const stream =
            fs.createReadStream(
                req.file.path
            );

        stream
            .pipe(csv())
            .on("error", (err) => {
                console.error("CSV ERROR:", err);
            })
            .on("data", (row) => {

                console.log("ROW:", row);

                products.push(row);


            })
            .on("end", async () => {
                console.log("ROWS FOUND:", products.length);

                let imported = 0;
                let skipped = 0;

                for (const item of products) {

                    const existingProduct =
                        await Product.findOne({
                            sku: item.sku,
                        });

                    if (existingProduct) {
                        skipped++;
                        continue;
                    }

                    const slug =
                        await generateUniqueSlug(
                            item.name
                        );

                    await Product.create({
                        name: item.name,
                        slug,
                        brand: item.brand,
                        model: item.model || "",
                        category: item.category,
                        subcategory: item.subcategory,
                        description:
                            item.description || "",
                        sku: item.sku,
                        costPrice:
                            Number(item.costPrice),
                        wholesalePrice:
                            Number(item.wholesalePrice),
                        retailPrice:
                            Number(item.retailPrice),
                        stock:
                            Number(item.stock || 0),
                        images:
                            item.images
                                ? item.images
                                    .split("|")
                                    .map(img => img.trim())
                                : [],
                        hsnCode:
                            item.hsnCode || "",

                        gstPercentage:
                            Number(item.gstPercentage || 18),

                        sellerId:
                            item.sellerId || "ADMIN",

                        sellerName:
                            item.sellerName || "CosmoCartt",

                        sellerGSTIN:
                            item.sellerGSTIN || "",

                        approvalStatus:
                            item.approvalStatus || "Approved",
                        status:
                            item.status || "Active",
                    });

                    imported++;
                }

                console.log({
                    imported,
                    skipped,
                    totalRows: products.length
                });

                console.log({
                    imported,
                    skipped,
                    totalRows: products.length
                });

                return res.status(200).json({
                    success: true,
                    imported,
                    skipped,
                    totalRows: products.length,
                });
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

        const products =
            await Product.find().lean();

        const fields = [
            "name",
            "brand",
            "model",
            "category",
            "subcategory",
            "description",
            "sku",
            "costPrice",
            "wholesalePrice",
            "retailPrice",
            "stock",
            "images",
            "status"
        ];

        const parser =
            new Parser({
                fields,
            });

        const formattedProducts =
            products.map(product => ({
                ...product,
                images:
                    product.images?.join("|") || ""
            }));

        const csv =
            parser.parse(formattedProducts);



        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment(
            "products.csv"
        );

        return res.send(csv);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};