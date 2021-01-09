import app from "../../../app";
import supertest from "supertest";

import { mocked } from "ts-jest/utils";

import Product, { IProduct } from "../../../models/Product";
import Category from "../../../models/Category";
import User from "../../../models/User";

import { PRODUCTS_IMAGE_SIZES } from "../../../utils/imagesSizes";
import { deleteImages, fileFilter, uploadImages } from "../../../utils/services/ImageController";

jest.mock("../../../utils/services/ImageController");

const request = supertest(app);

mockAuthentication();
setupTestDB("test_products_updateOne_api");

const LABELS_MOCK = PRODUCTS_IMAGE_SIZES.map(size => size.label);

const CATEGORIES_MOCK = [
    { name: "test 1" },
    { name: "test 2" },
    { name: "test 3" }
];

const PRODUCT_MOCK = {
    title: "test title",
    price: 500,
    inStock: 25,
    images: ["test-1.jpg", "test-2.jpg"],
    warranty: "test warranty",
    description: "test description",
    categories: []
}

const BUFFER = Buffer.from("some text");

const fileFilterMock = mocked(fileFilter);
const uploadImagesMock = mocked(uploadImages);
const deleteImagesMock = mocked(deleteImages);

describe("/api/products/updateObe", () => {
    let productId = "";

    beforeEach(async () => {
	uploadImagesMock.mockReset();
	deleteImagesMock.mockReset();

        fileFilterMock.mockImplementation((_req, _file, cb) => cb(null, true))
	uploadImagesMock.mockImplementation(files => Promise.resolve(
	    files.map(file => file.originalname)
	));
	
	await User.findOneAndUpdate({}, { permits: "ADMIN" });

	const categories = await Category.insertMany(CATEGORIES_MOCK);
	PRODUCT_MOCK.categories.push(...categories);

	const product = await Product.create(PRODUCT_MOCK);
	productId = product._id;
    });

    it("should update a product and upload the new images correclty", async () => {
	const res = await request.put(`/api/products/${productId}`)
	    .field("title", "updated title")
	    .field("categories", ["test 1"])
	    .attach("newImages", BUFFER, "new-image-1.png")
	    .attach("newImages", BUFFER, "new-image-2.png")
	    .set("Authorization", "Bearer token");

	const product = res.body.data.updatedProduct as IProduct;

	expect(product.title).toEqual("updated title");

	const category = await Category.findOne({ name: "test 1" });
	expect(product.categories[0]).toBe(String(category._id));
	expect(product.categories).toHaveLength(1);

	expect(product.images[2]).toBe("new-image-1.png");
	expect(product.images[3]).toBe("new-image-2.png");

	expect(product.images).toHaveLength(4);
	
	expect(uploadImagesMock).toHaveBeenCalledWith(expect.anything(), PRODUCTS_IMAGE_SIZES, "products/");
	expect(uploadImagesMock).toHaveBeenCalledTimes(1);
    });

    it("should update a product and delete the images correclty", async () => {
	const res = await request.put(`/api/products/${productId}`)
	    .field("title", "updated title")
	    .field("deletedImages", ["test-1.jpg", "test-2.jpg"])
	    .set("Authorization", "Bearer token");

	const product = res.body.data.updatedProduct as IProduct;

	expect(product.title).toEqual("updated title");

	expect(product.images).toHaveLength(0);
	
	expect(deleteImagesMock).toHaveBeenCalledWith(expect.anything(), LABELS_MOCK, "products/");
	expect(deleteImagesMock).toHaveBeenCalledTimes(1);
    });

    it("should update a product, delete the images and upload the new images correclty", async () => {
	const res = await request.put(`/api/products/${productId}`)
	    .field("title", "updated title")
	    .field("deletedImages", ["test-1.jpg", "test-2.jpg"])
	    .attach("newImages", BUFFER, "new-image-1.png")
	    .attach("newImages", BUFFER, "new-image-2.png")
	    .set("Authorization", "Bearer token");

	const product = res.body.data.updatedProduct as IProduct;

	expect(product.title).toEqual("updated title");

	expect(product.images[0]).toBe("new-image-1.png");
	expect(product.images[1]).toBe("new-image-2.png");

	expect(product.images).toHaveLength(2);

	expect(uploadImagesMock).toHaveBeenCalledWith(expect.anything(), PRODUCTS_IMAGE_SIZES, "products/");
	expect(uploadImagesMock).toHaveBeenCalledTimes(1);
	
	expect(deleteImagesMock).toHaveBeenCalledWith(expect.anything(), LABELS_MOCK, "products/");
	expect(deleteImagesMock).toHaveBeenCalledTimes(1);
    });

    it("should return an error when thee product doesn't exist", async () => {
	const res = await request.put(`/api/products/abcdefabcdefabcdefabcdef`).set("Authorization", "Bearer token");

	expect(res.body).toEqual({
	    status: 404,
	    error: "Product not found",
	    message: "The product 'abcdefabcdefabcdefabcdef' doesn't exist",
	    path: "/api/products/abcdefabcdefabcdefabcdef"
	});
    });
});
