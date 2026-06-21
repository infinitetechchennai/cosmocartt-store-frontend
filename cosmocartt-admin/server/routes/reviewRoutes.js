import express from "express";
import Review from "../models/Review.js";
import Order from "../models/Order.js";

const router = express.Router();

// CREATE REVIEW (Verified Purchase Only)
router.post("/", async (req, res) => {

    try {

        const {
            productId,
            userId,
            customerName,
            rating,
            comment
        } = req.body;

        if (
            !productId ||
            !userId ||
            !customerName ||
            !rating
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        if (
            rating < 1 ||
            rating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const purchasedOrder =
            await Order.findOne({
                userId: userId,
                status: {
                    $ne: "Cancelled"
                },
                "products.productId": productId
            });

        if (!purchasedOrder) {

            return res.status(403).json({
                success: false,
                message:
                    "You can only review products you have purchased"
            });

        }

        const existingReview =
            await Review.findOne({
                productId,
                userId
            });

        if (existingReview) {

            return res.status(400).json({
                success: false,
                message:
                    "You have already reviewed this product"
            });

        }

        const review = new Review({
            productId,
            userId,
            customerName,
            rating,
            comment
        });

        await review.save();

        res.json({
            success: true,
            review
        });

    } catch (err) {

        console.error("REVIEW CREATE ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// GET REVIEWS FOR A PRODUCT
router.get("/product/:productId", async (req, res) => {

    try {

        const reviews =
            await Review.find({
                productId: req.params.productId
            }).sort({
                createdAt: -1
            });

        const reviewCount =
            reviews.length;

        const averageRating =
            reviewCount > 0
                ? reviews.reduce(
                    (sum, r) => sum + r.rating,
                    0
                ) / reviewCount
                : 0;

        res.json({
            success: true,
            reviews,
            reviewCount,
            averageRating:
                Math.round(averageRating * 10) / 10
        });

    } catch (err) {

        console.error("REVIEW FETCH ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

export default router;