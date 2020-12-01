import { Router } from "express";

import mongoose from "mongoose";

import paypal, { IOrderItem } from "../utils/services/paypal";

import Product from "../models/Product";
import Order, { IOrder } from "../models/Order";
import Address, { IAddress } from "../models/Address";

const router = Router();

interface ICheckoutInput {
    cartItems: {
    	productId: string,
	quantity: number
    }[],
    addressId: IAddress["_id"];
}

router.post("/create/", async (req, res) => {
    const { cartItems, addressId } = req.body as ICheckoutInput;

    let error = "";

    if(!cartItems) {
	error = "The parameter 'cartItems' is required";
    } else if(typeof cartItems !== "object") {
	error = "The parameter 'cartItems' must be an array";
    } else if(!cartItems.length) {
	error = "The parameter 'cartItems' must not be empty";
    }

    if(error.length) {
	return res.json({
	    status: 400,
	    error: "Bad Request",
	    message: error,
	    path: req.originalUrl
	});
    }

    try {
	const address = await Address.findById(addressId);

	if(!address) {
	    return res.json({
		status: 400,
		error: "Bad request",
		message: `The address ${addressId} doesn't exists`,
		path: req.originalUrl
	    });
	}

	let error = "";

	const items: IOrderItem[] = [];
	const orderProducts: IOrder["products"] = [];

	for(const cartItem of cartItems) {
	    const product = await Product.findById(cartItem.productId);

	    if(!cartItem.quantity) {
		error = `The parameter 'quantity' must be more greater than 0 for the product '${product.title}'`;
		break;
	    }

	    if(cartItem.quantity > product.inStock) {
		error = `Not enough stock for the product '${product.title}'`;
		break;
	    }

	    items.push({
		title: product.title,
		price: product.discountedPrice,
		quantity: cartItem.quantity
	    });

	    orderProducts.push({
		originalProduct: product._id,
		price: product.discountedPrice,
		discount: product.discount,
		quantity: cartItem.quantity
	    });
	}

	if(error.length) {
	    return res.json({
		status: 400,
		error: "Bad request",
		message: error,
		path: req.originalUrl
	    });
	}

	const orderId = await paypal.createOrder(items);

	const total = orderProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);

	await Order.create({
	    userId: req.userId,
	    paypalOrderId: orderId,
	    products: orderProducts,
	    total,
	    address
	});

	res.json({ data: { orderId } });
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
});

router.post("/execute/", async (req, res) => {
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
});

router.post("/cancel/", async (req, res) => {
    const orderId: string = req.body.orderId;

    try {
	const order = await Order.deleteOne({ paypalOrderId: orderId });

	if(!order) {
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
});

export default router;
