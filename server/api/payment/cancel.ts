import mongoose from "mongoose";

import { Request, Response } from "express";

import Order from "../../models/Order";

export default async (req: Request, res: Response) => {
    const orderId: string = req.body.orderId;

    try {
	const order = await Order.deleteOne({ paypalOrderId: orderId });

	if(!order.deletedCount) {
	    return res.json({
		status: 400,
		error: "Bad Request",
		message: "The orderId doesn't exists",
		path: req.originalUrl
	    });
	}

	res.json({
	    data: {
		message: "The purchase has been canceled successfully"
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
