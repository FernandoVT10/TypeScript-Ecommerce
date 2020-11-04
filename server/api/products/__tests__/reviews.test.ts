import app from "../../../app";
import supertest from "supertest";
import Product from "../../../models/Product";
import Review, { IReview } from "../../../models/Review";

const request = supertest(app);

setupTestDB("test_reviews_api");

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

describe("Reviews API", () => {
    let productId = "";

    beforeEach(async () => {
	const product = await Product.create(PRODUCT_MOCK); 

	productId = product._id;

	REVIEWS_NOCK[0].productId = product._id;
	REVIEWS_NOCK[1].productId = product._id;
	REVIEWS_NOCK[2].productId = product._id;

	await Review.insertMany(REVIEWS_NOCK);
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

    describe("Create Review", () => {
	it("should create a review correclty", async () => {
            const res = await request.post(`/api/products/${productId}/reviews/`).send({
            	content: "Test Review",
		calification: 2
            });

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
            });

	    const product = await Product.findById(productId);

	    expect(product.calification).toBe(3.8);
	});
    });
});
