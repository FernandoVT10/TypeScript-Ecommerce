
import app from "../../../app";
import supertest from "supertest";
import Product, { IProduct } from "../../../models/Product";

const request = supertest(app);

setupTestDB("test_products_getOne_api");

const PRODUCT_NOCK = {
    title: "product with discount 2",
    images: ["discount-2.jpg"],
    price: 100,
    discount: 25,
    inStock: 4,
    arrivesIn: "3 day",
    warranty: "3 years",
    description: "test description 2",
    categories: [],
    createdAt: Date.now() + 30
}

describe("/api/products/getOne", () => {
    let productId = "";

    beforeEach(async () => {
	const product = await Product.create(PRODUCT_NOCK);
	productId = product._id;
    });

    it("should get a product", async () => {
	const res = await request.get(`/api/products/${productId}`);

	const product: IProduct = res.body.data.product;

	expect(product.title).toBe("product with discount 2");
	expect(product.price).toBe(100);
	expect(product.discount).toBe(25);
    });

    it("should get a 404 not found error", async () => {
	const res = await request.get("/api/products/abcdefabcdef");

	expect(res.body).toEqual({
	    status: 404,
	    error: "Product not found",
	    message: "The product abcdefabcdef doesn't exist",
	    path: `/api/products/abcdefabcdef`
	});
    });
});
