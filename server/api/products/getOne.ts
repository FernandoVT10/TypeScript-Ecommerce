import { Request, Response } from "express";

import Product from "../../models/Product";

export default async (req: Request, res: Response) => {
    const { productId } = req.params;
    
    try {
        const product = await Product.findById(productId);

        if(product) {
            res.json({ data: { product } });
        } else {
            res.json({
		status: 404,
		error: "Product not found",
		message: `The product ${productId} doesn't exist`,
		path: `/api/products/${productId}`
            });
        }
    } catch(err) {
	res.json({
	    status: 500,
	    error: "Internal server error",
	    message: err.message,
	    path: "/api/account/register/"
	});
    }
}
