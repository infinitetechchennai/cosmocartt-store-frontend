import express from "express";
import Campaign from "../models/Campaign.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const campaign = await Campaign.create(req.body);

        res.status(201).json({
            success: true,
            campaign
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            campaigns
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const campaign =
            await Campaign.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true
                }
            );

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        res.json({
            success: true,
            campaign
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Campaign.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Campaign deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;