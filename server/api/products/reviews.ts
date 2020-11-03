import { Router } from "express";
import mongoose from "mongoose";

import checkIfProductExist from "../../utils/middlewares/checkIfProductExist";

import Product, { IProduct } from "../../models/Product";
import Review from "../../models/Review";

const REVIEWS_PER_PAGE = 6;

const router = Router({ mergeParams: true });

router.get("/", checkIfProductExist, async (req, res) => {
    const { productId } = req.params;

    const limit = parseInt(req.query.limit as string) || REVIEWS_PER_PAGE;
    const offset = parseInt(req.query.offset as string) || 0; 

    try {
	const reviews = await Review.find({ productId })
	    .sort({ createdAt: "desc" })
	    .skip(offset)
	    .limit(limit);

	res.json({ data: { reviews } });
    } catch {
	res.json({ data: { reviews: [] } });
    }
});

router.get("/getTotalStarsCount/", checkIfProductExist, async (req, res) => {
    const { productId } = req.params;

    const response = {
	totalReviews: 0,
	oneStar: 0,
	twoStars: 0,
	threeStars: 0,
	fourStars: 0,
	fiveStars: 0
    }

    try {
	const totalStarsCount = await Review.aggregate<{ _id: number, count: number }>(
	    [
		{ $match: { productId: mongoose.Types.ObjectId(productId) } }, 
		{ $group: {
			_id: "$calification",
			count: { $sum: 1 }
		    }
		}
	    ]
	);

	const labels = ["oneStar", "twoStars", "threeStars", "fourStars", "fiveStars"];

	// Here we format the "-id"(is the review calification) to its labels
	const starsCountLabelled = totalStarsCount.reduce((acc, starsCount) => {
	    response.totalReviews += starsCount.count;

	    acc[ labels[ starsCount._id - 1 ] ] = starsCount.count;
	    return acc;
	}, {}); 

	Object.assign(response, starsCountLabelled);
	
	res.json({
	    data: {
		reviewsCount: response 
	    }
	});
    } catch {
    	res.json({
	    data: { reviewsCount: response }
	});
    } 
});

router.post("/", checkIfProductExist, async (req, res) => {
    const productId = req.params.productId as IProduct["_id"];
    const { content, calification } = req.body;

    try {
	const createdReview = await Review.create({
	    productId,
	    content,
	    calification
	});

	const calificationAverage = await Review.aggregate<{ _id: null, average: number }>([
	    { $match: { productId: mongoose.Types.ObjectId(productId) } },
	    {
		$group: {
		    _id: null,
		    average: { $avg: "$calification" }
		}
	    }
	]);

	const fixedProductCalification = calificationAverage[0].average.toFixed(1);
	const productCalification = parseFloat(fixedProductCalification);

	await Product.update({ _id: productId }, { $set: { calification: productCalification } });

	res.json({ data: { createdReview } });
    } catch(error) {
	res.json({ errors: [ error ] });
    }
});

export default router;
