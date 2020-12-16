import mongoose from "mongoose";

import { Request, Response } from "express";

import paypal, { IOrderItem } from "../../utils/services/paypal";

import Product from "../../models/Product";
import Order, { IOrder } from "../../models/Order";
import Address, { IAddress } from "../../models/Address";

interface ICheckoutInput {
    cartItems: {
    	productId: string,
	quantity: number
    }[],
    addressId: IAddress["_id"];
}

export default async (req: Request, res: Response) => {
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
		status: 404,
		error: "Address not found",
		message: `The address ${addressId} doesn't exists`,
		path: req.originalUrl
	    });
	}

	let error = "";

	const items: IOrderItem[] = [];
	const orderProducts: IOrder["products"] = [];

	for(const cartItem of cartItems) {
	    const product = await Product.findById(cartItem.productId);

	    if(!product) {
		error = `The product ${cartItem.productId} doesn't exists`;
		break;
	    }

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
		price: product.price,
		discount: product.discount,
		quantity: cartItem.quantity
	    });
	}

	if(error.length) {
	    return res.json({
		status: 400,
		error: "Bad Request",
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
}
