import Product from "../models/Product.js";
import csv from "csv-parser";
import { Readable } from "stream";
import { Parser } from "json2csv";

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

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
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
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

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
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
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
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
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "CSV file is required",
            });
        }

        const products = [];

        const stream = Readable.from(req.file.buffer);

        stream
            .pipe(csv())
            .on("data", (row) => {
                products.push(row);
            })
            .on("end", async () => {

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

                    await Product.create({
                        name: item.name,
                        brand: item.brand,
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
                        image:
                            item.image || "",
                        status:
                            item.status || "Active",
                    });

                    imported++;
                }

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
            "category",
            "subcategory",
            "description",
            "sku",
            "costPrice",
            "wholesalePrice",
            "retailPrice",
            "stock",
            "image",
            "status"
        ];

        const parser =
            new Parser({
                fields,
            });

        const csv =
            parser.parse(products);

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