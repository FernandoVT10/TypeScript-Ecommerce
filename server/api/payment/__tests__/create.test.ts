import app from "../../../app";
import supertest from "supertest";
import { mocked } from "ts-jest/utils";

import paypal from "../../../utils/services/paypal";

import Address from "../../../models/Address";
import Product from "../../../models/Product";
import Order from "../../../models/Order";
import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_payment_create_api");
mockAuthentication();

jest.mock("../../../utils/services/paypal");

const mockedPayPalCreateOrder = mocked(paypal.createOrder);

const callCreatePayment = (data: object) => {
    return request.post(`/api/payment/create`)
	.send(data)
	.set("Authorization", "Bearer token");
}

const ADDRESS_MOCK = {
    userId: "",
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

interface CartItem {
    productId: string,
    quantity: number
}

describe("Payment Create API", () => {
    let cartItems: CartItem[] = [];
    let addressId = "";

    beforeEach(async () => {
	const products = await Product.insertMany(PRODUCTS_MOCK);

	cartItems = [
	    { productId: products[0]._id, quantity: 2 },
	    { productId: products[1]._id, quantity: 2 }
	];
	
	const user = await User.findOne();
	ADDRESS_MOCK.userId = user._id;

	const address = await Address.create(ADDRESS_MOCK);
	addressId = address._id;

	mockedPayPalCreateOrder.mockReset();
	mockedPayPalCreateOrder.mockImplementation(() => Promise.resolve("test order"));
    });

    it("should create a order correctly", async () => {
	const res = await callCreatePayment({ cartItems, addressId });

	const order = await Order.findOne();

	expect(order.paypalOrderId).toBe("test order");
	expect(order.total).toBe(700);

	expect(order.products).toHaveLength(2);

	expect(order.products[0].quantity).toBe(2);
	expect(order.products[1].quantity).toBe(2);

	expect(order.products[0].discount).toBe(0);
	expect(order.products[1].discount).toBe(50);

	expect(order.address.fullName).toBe(ADDRESS_MOCK.fullName);
	expect(order.address.phoneNumber).toBe(ADDRESS_MOCK.phoneNumber);

	expect(res.body.data.orderId).toBe("test order");
    });

    it("should call paypal.createOrder correctly", async () => {
	await callCreatePayment({ cartItems, addressId });

	expect(mockedPayPalCreateOrder).toHaveBeenCalledWith([
	    {
		title: "smartphone",
		price: 100,
		quantity: 2
	    },
	    {
		title: "pc",
		price: 250,
		quantity: 2
	    }
	]);
    });

    it("should get an error when the cartItems parameter doesn't exists", async () => {
	const res = await callCreatePayment({});

	const { error, message, status } = res.body;
	expect(error).toBe("Bad Request");
	expect(message).toBe("The parameter 'cartItems' is required");
	expect(status).toBe(400);
    });

    it("should get an error when the cartItems paramter isn't an array", async () => {
	const res = await callCreatePayment({ cartItems: "test" });

	const { error, message, status } = res.body;
	expect(error).toBe("Bad Request");
	expect(message).toBe("The parameter 'cartItems' must be an array");
	expect(status).toBe(400);
    });

    it("should get an error when the cartItems is empty", async () => {
	const res = await callCreatePayment({ cartItems: [] });

	const { error, message, status } = res.body;
	expect(error).toBe("Bad Request");
	expect(message).toBe("The parameter 'cartItems' must not be empty");
	expect(status).toBe(400);
    });

    it("should get an error when the addressId doesn't exists", async () => {
	const res = await callCreatePayment({
	    cartItems: [ "value" ],
	    addressId: "abcdefabcdefabcdefabcdef"
	});

	const { error, message, status } = res.body;
	expect(error).toBe("Address not found");
	expect(message).toBe("The address abcdefabcdefabcdefabcdef doesn't exists");
	expect(status).toBe(404);
    });

    it("should get an error when a product id doesn't exists", async () => {
	cartItems[0].productId = "abcdefabcdefabcdefabcdef";

	const res = await callCreatePayment({ cartItems, addressId });

	const { error, message, status } = res.body;

	expect(error).toBe("Bad Request");
	expect(message).toBe("The product abcdefabcdefabcdefabcdef doesn't exists");
	expect(status).toBe(400);
    });

    it("should get an error when a product quantity is 0", async () => {
	cartItems[0].quantity = 0;

	const res = await callCreatePayment({ cartItems, addressId });

	const { error, message, status } = res.body;
	expect(error).toBe("Bad Request");
	expect(message).toBe("The parameter 'quantity' must be more greater than 0 for the product 'smartphone'");
	expect(status).toBe(400);
    });

    it("should get an error when a product quantity is greather than the product stock", async () => {
	cartItems[1].quantity = 6;

	const res = await callCreatePayment({ cartItems, addressId });

	const { error, message, status } = res.body;
	expect(error).toBe("Bad Request");
	expect(message).toBe("Not enough stock for the product 'pc'");
	expect(status).toBe(400);
    });
});
