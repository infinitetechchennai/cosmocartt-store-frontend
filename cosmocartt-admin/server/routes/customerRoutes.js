import express from "express";

import {
    getCustomers,
    registerCustomer,
    loginCustomer,
    updateCustomer,
    deleteCustomer
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/", getCustomers);

router.post("/register", registerCustomer);

router.post("/login", loginCustomer);

router.put("/:id", updateCustomer);

router.delete("/:id", deleteCustomer);

export default router;