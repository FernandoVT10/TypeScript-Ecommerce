import { Request, Response } from "express";

import mongoose from "mongoose";
import multer from "multer";

import Product, { IProduct } from "../../models/Product";
import Category from "../../models/Category";

import { PRODUCTS_IMAGE_SIZES } from "../../utils/imagesSizes";
import { uploadImages, fileFilter, deleteImages } from "../../utils/services/ImageController";

const LABELS = PRODUCTS_IMAGE_SIZES.map(size => size.label);

const storage = multer.memoryStorage();

const upload = multer({ storage, fileFilter });

interface ICreateInput {
    title: IProduct["title"],
    price: IProduct["price"],
    discount: IProduct["discount"],
    inStock: IProduct["inStock"],
    warranty: IProduct["warranty"],
    description: IProduct["description"],
    deletedImages: string[],
    categories: string[]
}

const updateObe = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const productData = req.body as ICreateInput;

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

	if(productData.categories) {
	    const categoriesDocument = await Category.find({
		name: { $in: productData.categories }
	    });

	    productData.categories = categoriesDocument.map(category => category._id);
	}

	const { deletedImages } = productData;

	if(deletedImages) {
	    const deletedImagesArray = Array.isArray(deletedImages) ? deletedImages : [deletedImages];

	    deleteImages(deletedImagesArray, LABELS, "products/");

	    // here we remove the images name from product documennt
	    product.images = product.images.filter(image => {
		return !deletedImagesArray.find(deletedImage => deletedImage === image);
	    });
	}

	const files = req.files || [];

	const uploadedImages = await uploadImages(
	    files as Express.Multer.File[], PRODUCTS_IMAGE_SIZES, "products/"
	);

	const images = product.images.concat(uploadedImages);

	Object.assign(product, {
	    ...productData,
	    images
	});

	const updatedProduct = await product.save();

	res.json({ data: { updatedProduct } });
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

export default [upload.array("newImages", 12), updateObe];
