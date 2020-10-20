import { Router } from "express";

import Category from "../models/Category";

const router = Router();

router.get("/", async (_, res) => {
    try {
        const categories = await Category.find();

        res.json({ data: { categories } });
    } catch {
        res.json({
            data: { categories: [] }
        });
    }
});

export default router;