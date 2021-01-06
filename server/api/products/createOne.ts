import { Request, Response } from "express";

import mongoose from "mongoose";
import multer from "multer";

import Product, { IProduct } from "../../models/Product";
import Category from "../../models/Category";

import { uploadImages, fileFilter } from "../../utils/services/ImageController";

const storage = multer.memoryStorage();

const IMAGEE_SIZES = [
    { label: "large", width: 1920, height: 1080 },
    { label: "medium", width: 1024, height: 768 },
    { label: "thumb", width: 250, height: 250 }
];

const upload = multer({ storage, fileFilter });

interface ICreateInput {
    title: IProduct["title"],
    price: IProduct["price"],
    discount: IProduct["discount"],
    inStock: IProduct["inStock"],
    warranty: IProduct["warranty"],
    description: IProduct["description"],
    images: IProduct["images"],
    categories: string[]
}

const create =  async (req: Request, res: Response) => {
    const productData = req.body as ICreateInput;
    const { categories } = productData;

    try {
	const categoriesDocument = await Category.find({ name: { $in: categories } });

	const product = await Product.create({
	    ...productData,
	    categories: categoriesDocument
	});

	const images = await uploadImages(req.files as Express.Multer.File[], IMAGEE_SIZES, "products/");
	product.images = images;
	await product.save();

	res.json({ createdProduct: product });
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

export default [upload.array("test", 12), create];
