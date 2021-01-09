import app from "../../../app";
import supertest from "supertest";

import { mocked } from "ts-jest/utils";

import Product, { IProduct } from "../../../models/Product";
import User from "../../../models/User";

import { PRODUCTS_IMAGE_SIZES } from "../../../utils/imagesSizes";
import { deleteImages } from "../../../utils/services/ImageController";

jest.mock("../../../utils/services/ImageController");

const request = supertest(app);

mockAuthentication();
setupTestDB("test_products_deleteOne_api");

const LABELS = PRODUCTS_IMAGE_SIZES.map(size => size.label);

const PRODUCT_MOCK = {
    title: "test title",
    price: 500,
    inStock: 25,
    images: ["test-1.jpg", "test-2.jpg"],
    warranty: "test warranty",
    description: "test description",
    categories: []
}

const deleteImagesMocked = mocked(deleteImages);

describe("/api/products/deleteOne", () => {
    let productId = "";

    beforeEach(async () => {
        await User.updateOne({}, { permits: "ADMIN" });

	const product = await Product.create(PRODUCT_MOCK);
	productId = product._id;

	deleteImagesMocked.mockReset();
    });

    it("should delete a products and its images correclty", async () => {
	const res = await request.delete(`/api/products/${productId}`).set("Authorization", "Bearer token");

	const deletedProduct = res.body.data.deletedProduct as IProduct;
	expect(deletedProduct.title).toBe("test title");

	expect(await Product.exists({ _id: productId })).toBeFalsy();

	expect(deleteImagesMocked).toHaveBeenCalledWith(
	    expect.arrayContaining(["test-1.jpg", "test-2.jpg"]), LABELS, "products/"
	);
    });

    it("should return an error when the product doesn't exist", async () => {
	const res = await request.delete(`/api/products/abcdefabcdefabcdefabcdef`).set("Authorization", "Bearer token");

	expect(res.body).toEqual({
	    status: 404,
	    error: "Product not found",
	    message: `The product 'abcdefabcdefabcdefabcdef' doesn't exist`,
	    path: "/api/products/abcdefabcdefabcdefabcdef"
	});
    });
});
