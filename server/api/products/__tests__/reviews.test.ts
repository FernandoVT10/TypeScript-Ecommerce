import app from "../../../app";
import supertest from "supertest";

import Product from "../../../models/Product";
import Review, { IReview } from "../../../models/Review";
import Order, { IOrder } from "../../../models/Order";
import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_products_reviews_api");
mockAuthentication();

const PRODUCT_MOCK = {
    title: "test title",
    images: [],
    price: 25,
    inStock: 2,
    arrivesIn: "1 day",
    warranty: "6 months",
    description: "test description",
    categories: []
}

const REVIEWS_NOCK = [
    {
	productId: "",
	content: "Five stars review",
	calification: 5,
	createdAt: Date.now()
    },
    {
	productId: "",
	content: "Four stars review",
	calification: 4,
	createdAt: Date.now() + 100
    },
    {
	productId: "",
	content: "One star review",
	calification: 1,
	createdAt: Date.now() + 500
    }
];

const ORDER_MOCK = {
    userId: "",
    total: 50,
    paypalOrderId: "test",
    status: "PENDING",
    address: {
	fullName: "Test Man",
	postalCode: "12345",
	state: "test state",
	municipality: "test municipality",
	suburb: "test suburb",
	street: "test street",
	outdoorNumber: "123",
	interiorNumber: "456",
	phoneNumber: "123-456-7890",
	additionalInformation: "test additional information"
    },
    shipping: null,
    products: [
	{
	    price: 25,
	    discount: 0,
	    quantity: 2,
	    originalProduct: ""
	}
    ]
}

describe("Reviews API", () => {
    let productId = "";

    beforeEach(async () => {
	const product = await Product.create(PRODUCT_MOCK); 

	productId = product._id;

	for(const review of REVIEWS_NOCK) {
	    review.productId = product._id;

	    await Review.create(review as any as IReview);
	}

	const user = await User.findOne();

	ORDER_MOCK.userId = user._id;
	ORDER_MOCK.products[0].originalProduct = product._id;

	await Order.create(ORDER_MOCK as any as IOrder);
    });

    describe("Get reviews", () => {
        it("should get two reviews with limit parameter", async () => {
            const res = await request.get(`/api/products/${productId}/reviews?limit=2`);

	    const reviews: IReview[] = res.body.data.reviews;

	    expect(reviews).toHaveLength(2);

	    expect(reviews[0].calification).toBe(1);
	    expect(reviews[0].content).toBe("One star review");
	    
	    expect(reviews[1].calification).toBe(4);
	    expect(reviews[1].content).toBe("Four stars review");
        });

	it("should the last review with offset parameter", async () => {
            const res = await request.get(`/api/products/${productId}/reviews?offset=2`);

	    const reviews: IReview[] = res.body.data.reviews;

	    expect(reviews).toHaveLength(1);

	    expect(reviews[0].calification).toBe(5);
	    expect(reviews[0].content).toBe("Five stars review");
	});
    });

    describe("Get Total Stars Count", () => {
	it("should get the stars count correclty", async () => {
            const res = await request.get(`/api/products/${productId}/reviews/getTotalStarsCount/`);

	    const { reviewsCount } = res.body.data;

	    expect(reviewsCount.totalReviews).toBe(3);
	    expect(reviewsCount.oneStar).toBe(1);
	    expect(reviewsCount.twoStars).toBe(0);
	    expect(reviewsCount.threeStars).toBe(0);
	    expect(reviewsCount.fourStars).toBe(1);
	    expect(reviewsCount.fiveStars).toBe(1);
	});
    });

    describe("User Status", () => {
	it("should return canWriteAReview in true when the user has bought the product and hasn't written a review", async () => {
            const res = await request.get(`/api/products/${productId}/reviews/userStatus/`)
		.set("Authorization", "Bearer token");

	    expect(res.body.data.canWriteAReview).toBeTruthy();
	});

	it("should return canWriteAReview in false when the user hasn't bought the product", async () => {
	    await Order.updateOne({}, { $set: { products: [] } });

            const res = await request.get(`/api/products/${productId}/reviews/userStatus/`)
		.set("Authorization", "Bearer token");

	    expect(res.body.data.canWriteAReview).toBeFalsy();
	});

	it("should return canWriteAReview in false when the user already has written a review", async () => {
	    const user = await User.findOne();
	    await Review.updateOne({}, { $set: { userId: user._id } });

            const res = await request.get(`/api/products/${productId}/reviews/userStatus/`)
		.set("Authorization", "Bearer token");

	    expect(res.body.data.canWriteAReview).toBeFalsy();
	});
    });

    describe("Create Review", () => {
	it("should create a review correclty", async () => {
            const res = await request.post(`/api/products/${productId}/reviews/`).send({
            	content: "Test Review",
		calification: 2
            }).set("Authorization", "Bearer token");

	    const createdReview: IReview = res.body.data.createdReview;

	    expect(await Review.findById(createdReview._id)).toBeTruthy();

	    expect(createdReview.content).toBe("Test Review");
	    expect(createdReview.calification).toBe(2);
	    expect(createdReview.productId).toBe(productId.toString());
	});
	
	it("should change the calification of the product", async () => {
	    await request.post(`/api/products/${productId}/reviews/`).send({
		content: "Test Review",
		calification: 5
            }).set("Authorization", "Bearer token");

	    const product = await Product.findById(productId);

	    expect(product.calification).toBe(3.8);
	});
	
	it("should return an error when the user hasn't bought the product", async () => {
	    await Order.updateOne({}, { $set: { products: [] } });

	    const res = await request.post(`/api/products/${productId}/reviews/`).send({
		content: "Test Review",
		calification: 5
            }).set("Authorization", "Bearer token");

	    expect(res.body).toEqual({
	    	status: 400,
		error: "Bad Request",
		message: "You can't write a review if you've never bought this product",
		path: `/api/products/${productId}/reviews/`
	    });
	});
	
	it("should return an error when the user already has written a review", async () => {
	    const user = await User.findOne();
	    await Review.updateOne({}, { $set: { userId: user._id } });

	    const res = await request.post(`/api/products/${productId}/reviews/`).send({
		content: "Test Review",
		calification: 5
            }).set("Authorization", "Bearer token");

	    expect(res.body).toEqual({
	    	status: 400,
		error: "Bad Request",
		message: "You've already written a review",
		path: `/api/products/${productId}/reviews/`
	    });
	});
    });
});
