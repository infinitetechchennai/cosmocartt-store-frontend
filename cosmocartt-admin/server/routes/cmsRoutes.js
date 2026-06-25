import express from "express";
import CMSPage from "../models/CMSPage.js";

const router = express.Router();

const defaultPages = [
    {
        key: "about",
        title: "About Us",
        fields: {
            heroTitle: "",
            heroSubtitle: "",
            content: "",
            mission: "",
            vision: ""
        }
    },
    {
        key: "contact",
        title: "Contact Us",
        fields: {
            phone: "",
            email: "",
            address: "",
            supportHours: "",
            mapUrl: ""
        }
    },
    {
        key: "privacy",
        title: "Privacy Policy",
        fields: {
            content: "",
            effectiveDate: ""
        }
    },
    {
        key: "terms",
        title: "Terms & Conditions",
        fields: {
            content: "",
            effectiveDate: ""
        }
    },
    {
        key: "faq",
        title: "FAQ",
        fields: {
            questions: [
                {
                    question: "",
                    answer: ""
                }
            ]
        }
    },
    {
        key: "refund-policy",
        title: "Refund Policy",
        fields: {
            content: "",
            effectiveDate: ""
        }
    },
    {
        key: "shipping-policy",
        title: "Shipping Policy",
        fields: {
            content: "",
            effectiveDate: ""
        }
    }
];

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

router.get("/defaults", async (req, res) => {
    res.json({
        success: true,
        pages: defaultPages
    });
});

router.put("/:key", async (req, res) => {
    try {
        const template =
            defaultPages.find(
                (p) => p.key === req.params.key
            );

        if (!template) {
            return res.status(400).json({
                success: false,
                message: "Invalid CMS page key"
            });
        }

        const page = await CMSPage.findOneAndUpdate(
            { key: req.params.key },
            {
                key: req.params.key,
                title: req.body.title || template.title,
                content: req.body.content || "",
                fields: req.body.fields || {},
                metaTitle: req.body.metaTitle || "",
                metaDescription: req.body.metaDescription || "",
                status: req.body.status || "Draft"
            },
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
        const page = await CMSPage.findOne({
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