import mongoose from "mongoose";
import { Router } from "express";

import Product, { IProduct } from "../../models/Product";
import Review from "../../models/Review";
import Order from "../../models/Order";

import withJWTAuth from "../../utils/middlewares/withJWTAuth";

const REVIEWS_PER_PAGE = 6;

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
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

router.get("/getTotalStarsCount/", async (req, res) => {
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

router.get("/userStatus/", withJWTAuth, async (req, res) => {
    const { productId } = req.params;
    const { userId } = req;

    try {
	const orderExist = await Order.exists({
	    userId: req.userId,
	    "products.originalProduct": productId
	});
	if(!orderExist) {
	    return res.json({ data: { canWriteAReview: false } });
	}

	const reviewExist = await Review.exists({ userId, productId});
	if(!reviewExist) {
	    return res.json({ data: { canWriteAReview: true } });
	}

        res.json({ data: { canWriteAReview: false } });
    } catch (err) {
        res.json({
            status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
        });
    }
});

router.post("/", withJWTAuth, async (req, res) => {
    const productId = req.params.productId as IProduct["_id"];
    const { content, calification } = req.body;

    try {
	const orderExist = await Order.exists({
	    userId: req.userId,
	    "products.originalProduct": productId
	});

	if(!orderExist) {
	    return res.json({
	    	status: 400,
		error: "Bad Request",
		message: "You can't write a review if you've never bought this product",
		path: req.originalUrl
	    });
	}

	const reviewExist = await Review.exists({ userId: req.userId, productId });

	if(reviewExist) {
	    return res.json({
	    	status: 400,
		error: "Bad Request",
		message: "You've already written a review",
		path: req.originalUrl
	    });
	}

	const createdReview = await Review.create({
	    userId: req.userId,
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

	await Product.updateOne({ _id: productId }, { $set: { calification: productCalification } });

	res.json({ data: { createdReview } });
    } catch(err) {
	res.json({
	    status: 500,
	    error: "Internal server error",
	    message: err.message,
	    path: "/api/account/register/"
	});
    }
});

export default router;
