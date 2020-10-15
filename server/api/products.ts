import { Router } from "express";

import Product from "../models/Product";

const router = Router();

router.get("/", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit.toString()) || 6 : 6;
    const discountsOnly = req.query.discountsOnly || "false";

    try {
        let sort:object = { createdAt: "desc" };
        let find: object = {};

        if(discountsOnly === "true") {
            sort = { discount: "desc" }
            find = { discount: { $gt: 0 } }
        }

        const products = await Product.find(find)
            .sort(sort)
            .limit(limit);

        res.json({ data: { products } });
    } catch {
        res.json({
            data: { products: [] }
        });
    }
});

export default router;