import mongoose from "mongoose";

import { Request, Response } from "express";

import paypal from "../../utils/services/paypal";

import Order from "../../models/Order";
import Product from "../../models/Product";

export default async (req: Request, res: Response) => {
    const orderId: string = req.body.orderId;

    try {
	const order = await Order.findOne({ paypalOrderId: orderId });

	if(!order) {
	    return res.json({
		status: 400,
		error: "Bad Request",
		message: "The orderId doesn't exists",
		path: req.originalUrl
	    });

	}
	const orderStatus = await paypal.executeOrder(orderId);

	if(!orderStatus) {
	    return res.json({
		status: 400,
		error: "Bad Request",
		message: "Payment has not been made",
		path: req.originalUrl
	    });
	}

	// Here we go to update the stock of the products
	for(const orderProduct of order.products) {
	    // originalProduct is the an object id
	    const product = await Product.findById(orderProduct.originalProduct);
	    
	    product.inStock -= orderProduct.quantity;
	    await product.save();
	}

	order.status = "COMPLETED";
	await order.save();

	res.json({
	    data: {
		message: "The purchase has been completed successfully"
	    }
	});
    } catch (err) {
	if(err instanceof mongoose.Error) {
	    return res.json({
		status: 400,
		error: "Bad Request",
		message: err.message,
		path: req.originalUrl
	    });
	}

	res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});       
    }
}
