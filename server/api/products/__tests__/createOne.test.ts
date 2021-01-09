import app from "../../../app";
import supertest from "supertest";

import { mocked } from "ts-jest/utils";

import Product, { IProduct } from "../../../models/Product";
import Category from "../../../models/Category";
import User from "../../../models/User";

import { PRODUCTS_IMAGE_SIZES } from "../../../utils/imagesSizes";
import { fileFilter, uploadImages } from "../../../utils/services/ImageController";

jest.mock("../../../utils/services/ImageController");

const request = supertest(app);

mockAuthentication();
setupTestDB("test_products_createOne_api");

const CATEGORIES_MOCK = [
    { name: "test 1" },
    { name: "test 2" },
    { name: "test 3" }
];

const BUFFER = Buffer.from("some text");

const fileFilterMock = mocked(fileFilter);
const uploadImagesMock = mocked(uploadImages);

describe("/api/products/createOne", () => {
    beforeEach(async () => {
        fileFilterMock.mockImplementation((_req, _file, cb) => cb(null, true))
	uploadImagesMock.mockImplementation(files => Promise.resolve(
	    files.map(file => file.originalname)
	));
	
	await User.findOneAndUpdate({}, { permits: "ADMIN" });

	await Category.insertMany(CATEGORIES_MOCK);
    });

    it("should create a product and upload the images correclty", async () => {
	const res = await request.post("/api/products/")
	    .field("title", "test title")
	    .field("price", 500)
	    .field("inStock", 25)
	    .field("warranty", "test warranty")
	    .field("description", "test description")
	    .field("categories", ["test 1", "test 2"])
	    .attach("images", BUFFER, "test.png")
	    .set("Authorization", "Bearer token");

	const product = res.body.data.createdProduct as IProduct;

	expect(await Product.exists({ _id: product._id })).toBeTruthy();

	expect(product.title).toEqual("test title");
	expect(product.categories[0].name).toEqual("test 1");
	expect(product.categories[1].name).toEqual("test 2");
	expect(product.images[0]).toBe("test.png");
	
	expect(uploadImagesMock).toHaveBeenCalledWith(expect.anything(), PRODUCTS_IMAGE_SIZES, "products/");
    });
});
