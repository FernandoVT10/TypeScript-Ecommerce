import { Router } from "express";
import Category from "../models/Category";

import Product from "../models/Product";
import paginate, { IPagination } from "../utils/paginate";

const router = Router();

router.get("/", async (req, res) => {
    const { search, category } = req.query;
    const discountsOnly = req.query.discountsOnly || "false";
    const limit = req.query.limit ? parseInt(req.query.limit.toString()) || 6 : 6;
    const page = req.query.page ? parseInt(req.query.page.toString()) || 1 : 1;

    const offset = limit * (page - 1);

    try {
        const find: object = {};
        let sort:object = { createdAt: "desc" };

        if(search) {
            Object.assign(find, { title: { $regex: `.*(?i)${search}.*` } });
        }

        if(category) {
            const categoryDocument = await Category.find({ name: category.toString() });

            Object.assign(find, { categories: { $in: categoryDocument } });
        }

        if(discountsOnly === "true") {
            sort = { discount: "desc" }
            
            Object.assign(find, { discount: { $gt: 0 } });
        }

        const products = await Product.find(find)
            .sort(sort)
            .skip(offset)
            .limit(limit);

        const totalResults = await Product.find(find)
            .sort(sort)
            .countDocuments();

        const totalPages = Math.ceil(totalResults / limit);

        const pagination: IPagination = paginate(totalPages, page);

        res.json({ data: { products, totalResults, pagination } });
    } catch {
        res.json({
            data: { products: [] }
        });
    }
});

export default router;