import { Request, Response } from "express";

import mongoose from "mongoose";
import multer from "multer";

import Product, { IProduct } from "../../models/Product";
import Category from "../../models/Category";

import { PRODUCTS_IMAGE_SIZES } from "../../utils/imagesSizes";
import { uploadImages, fileFilter } from "../../utils/services/ImageController";

const storage = multer.memoryStorage();

const upload = multer({ storage, fileFilter });

interface ICreateInput {
    title: IProduct["title"],
    price: IProduct["price"],
    discount: IProduct["discount"],
    inStock: IProduct["inStock"],
    warranty: IProduct["warranty"],
    description: IProduct["description"],
    categories: string[]
}

const createOne =  async (req: Request, res: Response) => {
    const productData = req.body as ICreateInput;
    const { categories } = productData;

    try {
	const categoriesDocument = await Category.find({ name: { $in: categories } });

	const product = await Product.create({
	    ...productData,
	    categories: categoriesDocument,
	    images: []
	});

	const images = await uploadImages(req.files as Express.Multer.File[], PRODUCTS_IMAGE_SIZES, "products/");
	product.images = images;
	await product.save();

	res.json({ data: { createdProduct: product } });
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

export default [upload.array("images", 12), createOne];
