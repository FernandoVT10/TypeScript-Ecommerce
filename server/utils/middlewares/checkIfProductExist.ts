import express from "express";

import Product, { IProduct } from "../../models/Product";

export default async function checkIfProductExist(req: express.Request, res: express.Response, next: express.NextFunction) {
    const productId = req.params.productId as IProduct["_id"];

    try {
	if(await Product.exists({ _id: productId })) {
	    next();
	} else {
	    res.json({
		errors: [
		    {
			status: 404,
			message: `The product ${productId} doesn't exist`
		    }
		]
	    });
	}
    } catch(error) {
	res.json({ errors: [ error ] });
    }
}
