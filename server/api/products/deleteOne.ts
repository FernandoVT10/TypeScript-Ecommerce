import { Request, Response } from "express";

import Product from "../../models/Product";

import { deleteImages } from "../../utils/services/ImageController";

import { PRODUCTS_IMAGE_SIZES } from "../../utils/imagesSizes";

const LABELS = PRODUCTS_IMAGE_SIZES.map(size => size.label);

export default async (req: Request, res: Response) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);

	if(!product) {
	    return res.json({
	    	status: 404,
		error: "Product not found",
		message: `The product '${productId}' doesn't exist`,
		path: req.originalUrl
	    });
	}

	deleteImages(product.images, LABELS, "products/");

	const deletedProduct = await product.delete();

	res.json({ data: { deletedProduct } });
    } catch (err) {
	res.json({
	    status: 500,
	    error: "Internal server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
}
