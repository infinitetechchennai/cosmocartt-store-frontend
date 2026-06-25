import express from "express";
import Campaign from "../models/Campaign.js";

const router = express.Router();

const cleanBody = (body) => ({
    title: body.title?.trim(),
    type: body.type || "Homepage Banner",
    status: body.status || "Draft",
    bannerText: body.bannerText || "",
    description: body.description || "",
    discountCode: body.discountCode || "",
    discountPercentage: Number(body.discountPercentage || 0),
    startDate: body.startDate || "",
    endDate: body.endDate || "",
    placement: body.placement || "Home"
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

router.get("/active/home", async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            status: "Active",
            placement: {
                $in: ["Home", "All Store"]
            }
        }).sort({
            updatedAt: -1
        });

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

router.post("/", async (req, res) => {
    try {
        const payload = cleanBody(req.body);

        if (!payload.title) {
            return res.status(400).json({
                success: false,
                message: "Campaign title is required"
            });
        }

        if (payload.status === "Active") {
            await Campaign.updateMany(
                { status: "Active" },
                { status: "Draft" }
            );
        }

        const campaign = await Campaign.create(payload);

        const campaigns = await Campaign.find().sort({
            createdAt: -1
        });

        res.status(201).json({
            success: true,
            campaign,
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
        const payload = cleanBody(req.body);

        if (!payload.title) {
            return res.status(400).json({
                success: false,
                message: "Campaign title is required"
            });
        }

        if (payload.status === "Active") {
            await Campaign.updateMany(
                {
                    _id: { $ne: req.params.id },
                    status: "Active"
                },
                {
                    status: "Draft"
                }
            );
        }

        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            payload,
            { new: true }
        );

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        const campaigns = await Campaign.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            campaign,
            campaigns
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

export default router;