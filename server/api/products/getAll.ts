import { Response, Request } from "express";

import Category from "../../models/Category";
import Product from "../../models/Product";

const PAGINATE_CUSTOM_LABELS = {
    totalDocs: "totalProducts",
    docs: "products"
}

const PRODUCTS_PER_PAGE = 6;

export default async (req: Request, res: Response) => {
    const { search, category, discountsOnly, sortBy } = req.query;

    const limit = parseInt(req.query.limit as string) || PRODUCTS_PER_PAGE;
    const page = parseInt(req.query.page as string) || 1;

    try {
	const query = {};
	const options = {
	    page,
	    limit,
	    sort: { createdAt: "desc" },
	    customLabels: PAGINATE_CUSTOM_LABELS
	}

	switch(sortBy) {
	    case "stock":
		Object.assign(options, { sort: { inStock: "desc" } });
	    break;
	    case "discount":
		Object.assign(options, { sort: { discount: "desc" } });
	    break;
	    case "price":
		Object.assign(options, { sort: { price: "desc" } });
	    break;
	    case "title":
		Object.assign(options, { sort: { title: "asc" } });
	    break;
	}

	if(search) {
	    Object.assign(query, { title: { $regex: `.*(?i)${search}.*` } });
	}

	if(category) {
	    const categoryDocument = await Category.find({ name: category.toString() });

	    Object.assign(query, { categories: { $in: categoryDocument } });
	}

	if(discountsOnly === "true") {
	    Object.assign(options, { sort: { discount: "desc" } });
	    Object.assign(query, { discount: { $gt: 0 } });
	}

	const products = await Product.paginate(query, options);

	res.json({ data: products });
    } catch {
	res.json({ data: { products: [] } });
    }   
}