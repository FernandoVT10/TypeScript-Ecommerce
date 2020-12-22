import mongoose from "mongoose";

import { Router } from "express";

import Order from "../../models/Order";
import Shipping from "../../models/Shipping";

const router = Router({ mergeParams: true });

interface IAddStatusInput {
    status: string
}

router.post("/addStatus/", async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body as IAddStatusInput;

    try {
        const order = await Order.findById(orderId);

	if(!order) {
	    return res.json({
	    	status: 404,
		error: "Order not found",
		message: `The order '${orderId}' doesn't exists`,
		path: req.originalUrl
	    });
	}
	
	const shipping = await Shipping.findById(order.shipping);

	shipping.history.push({
	    content: status
	});

	await shipping.save();

	res.json({
	    data: { message: "The shipping status has been added successfully" }
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
	    status: 404,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
});

export default router;
