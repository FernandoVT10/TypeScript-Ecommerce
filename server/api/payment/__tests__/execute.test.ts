import app from "../../../app";
import supertest from "supertest";
import { mocked } from "ts-jest/utils";

import paypal from "../../../utils/services/paypal";

import Order from "../../../models/Order";
import User from "../../../models/User";
import Product from "../../../models/Product";
import Shipping from "../../../models/Shipping";

const request = supertest(app);

setupTestDB("test_payment_execute_api");
mockAuthentication();

jest.mock("../../../utils/services/paypal");

const mockedPayPalExecuteOrder = mocked(paypal.executeOrder);

const ORDER_MOCK = {
    userId: "",
    paypalOrderId: "testid",
    address: {
	fullName: "test 1",
	postalCode: "11111",
	state: "test state 1",
	municipality: "test municipality 1",
	suburb: "test suburb 1",
	street: "test street 1",
	outdoorNumber: "11",
	interiorNumber: "11",
	phoneNumber: "111-111-1111",
	additionalInformation: "test aditional information 1"
    },
    products: [],
    total: 350
}

const PRODUCTS_MOCK = [
    {
        title: "smartphone",
        images: ["test-1.jpg"],
        price: 100,
        inStock: 10,
        arrivesIn: "1 day",
        warranty: "6 months",
        description: "test description"
    },
    {
        title: "pc",
        images: ["test-2.jpg"],
        price: 500,
	discount: 50,
	inStock: 5,
	arrivesIn: "3 day",
        warranty: "3 years",
        description: "test description 2",
    }
];

const callExecutePayment = (orderId: string) => {
    return request.post(`/api/payment/execute`)
	.send({ orderId })
	.set("Authorization", "Bearer token");
}

describe("Payment Execute API", () => {
    beforeEach(async () => {
	const user = await User.findOne();
	ORDER_MOCK.userId = user._id;

	const products = await Product.insertMany(PRODUCTS_MOCK);

	ORDER_MOCK.products = [];

	ORDER_MOCK.products.push({
	    originalProduct: products[0]._id,
	    price: products[0].price,
	    discount: products[0].discount,
	    quantity: 7
	});

	ORDER_MOCK.products.push({
	    originalProduct: products[1]._id,
	    price: products[1].price,
	    discount: products[1].discount,
	    quantity: 2
	});

	await Order.create(ORDER_MOCK);

	mockedPayPalExecuteOrder.mockReset();
	mockedPayPalExecuteOrder.mockImplementation(() => Promise.resolve(true));
    });

    it("should complete an order and create a shipping document correctly", async () => {
	const res = await callExecutePayment("testid");
	expect(res.body.data.message).toBe("The purchase has been completed successfully");

	const order = await Order.findOne({ paypalOrderId: "testid" });
	expect(order.status).toBe("SHIPPING");

	const shipping = await Shipping.findOne();
	expect(shipping.arrivesIn).toBeNull();
	expect(shipping.history[0].content).toBe("Preparing the product");
    });

    it("should update the stock of the products correctly", async () => {
	await callExecutePayment("testid");

	const products = await Product.find();

	expect(products[0].inStock).toBe(3);
	expect(products[1].inStock).toBe(3);
    });

    it("should get an error when the orderId doesn't exists", async () => {
	const res = await callExecutePayment("testid23");

	const { status, error, message } = res.body;
	expect(status).toBe(400);
	expect(error).toBe("Bad Request");
	expect(message).toBe("The orderId doesn't exists");
    });

    it("should get an error when the payment is incomplete", async () => {
	mockedPayPalExecuteOrder.mockImplementation(() => Promise.resolve(false));

	const res = await callExecutePayment("testid");

	const { status, error, message } = res.body;
	expect(status).toBe(400);
	expect(error).toBe("Bad Request");
	expect(message).toBe("Payment has not been made");
    });
});
