import checkIfProductExist from "../checkIfProductExist";
import express from "express";
import Product from "../../../models/Product";

const PRODUCT_MOCK = {
    title: "test title",
    images: ["test-1.jpg"],
    price: 25,
    inStock: 2,
    arrivesIn: "1 day",
    warranty: "6 months",
    description: "test description",
    categories: []
}

setupTestDB("test_middleware_checkifproductexist");

describe("Middlewares Check If Product Exist", () => {
    let productId = "";

    beforeEach(async () => {
	const product = await Product.create(PRODUCT_MOCK);

	productId = product._id;
    });

    it("should call the next function", async () => {
	const requestMock = { params: { productId } } as any as express.Request;
	const responseMock = {} as express.Response;
	const nextMock = jest.fn();

	await checkIfProductExist(requestMock, responseMock, nextMock);

	expect(nextMock).toBeCalled();
    });

    it("should get a 404 error product not found", async () => {
	const jsonMock = jest.fn();
	const requestMock = { params: { productId: "abcdefabcdef" } } as any as express.Request;
	const responseMock = { json: jsonMock } as any as express.Response;

	await checkIfProductExist(requestMock, responseMock, jest.fn());

	expect(jsonMock).toBeCalledWith({
	    errors: [
		{
		    status: 404,
		    message: "The product abcdefabcdef doesn't exist"
		}
	    ]
	});
    });
});
