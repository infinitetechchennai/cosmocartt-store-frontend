import express from "express";
import CMSPage from "../models/CMSPage.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const pages = await CMSPage.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            pages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put("/:key", async (req, res) => {
    try {
        const page =
            await CMSPage.findOneAndUpdate(
                { key: req.params.key },
                req.body,
                {
                    new: true,
                    upsert: true
                }
            );

        res.json({
            success: true,
            page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/:key", async (req, res) => {
    try {
        const page =
            await CMSPage.findOne({
                key: req.params.key
            });

        res.json({
            success: true,
            page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;