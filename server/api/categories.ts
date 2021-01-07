import { Router } from "express";

import Category from "../models/Category";

import withAdmin from "../utils/middlewares/withAdmin";
import withJWTAuth from "../utils/middlewares/withJWTAuth";

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

router.post("/", withJWTAuth, withAdmin, async (req, res) => {
    try {
	const createdCategory = await Category.create(req.body);

	res.json({ data: { createdCategory } });
    } catch(err) {
	res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
});

router.delete("/:categoryId", withJWTAuth, withAdmin, async (req, res) => {
    const { categoryId } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

	if(!deletedCategory) {
	    return res.json({
		status: 404,
		error: "Category not found",
		message: `The category '${categoryId}' doesn't exist`,
		path: req.originalUrl
	    });
	}

	res.json({ data: { deletedCategory } });
    } catch (err) {
	res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
});

export default router;
