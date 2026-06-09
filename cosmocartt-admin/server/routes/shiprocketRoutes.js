import express from "express";
import { getShiprocketToken } from "../services/shiprocketService.js";

const router = express.Router();

router.get("/test", async (req, res) => {

    try {

        const token =
            await getShiprocketToken();

        res.json({
            success: true,
            tokenExists: !!token
        });

    } catch (error) {

        console.error(error.response?.data);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;