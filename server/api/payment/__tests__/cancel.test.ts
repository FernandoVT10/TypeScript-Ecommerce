import app from "../../../app";
import supertest from "supertest";

import Order from "../../../models/Order";
import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_payment_cancel_api");
mockAuthentication();

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

const callCancelPayment = (orderId: string) => {
    return request.post(`/api/payment/cancel`)
	.send({ orderId })
	.set("Authorization", "Bearer token");
}

describe("Payment Cancel API", () => {
    beforeEach(async () => {
	const user = await User.findOne();
	ORDER_MOCK.userId = user._id;

	await Order.create(ORDER_MOCK);
    });

    it("should cancel and delete the order correctly", async () => {
	const res = await callCancelPayment("testid");
	expect(res.body.data.message).toBe("The purchase has been canceled successfully");

	const exists = await Order.exists({ paypalOrderId: "testid" });
	expect(exists).toBeFalsy();
    });

    it("should get an error when the orderId doesn't exists", async () => {
	const res = await callCancelPayment("testidrandom");

	const { status, error, message } = res.body;
	expect(status).toBe(400);
	expect(error).toBe("Bad Request");
	expect(message).toBe("The orderId doesn't exists");
    });
});
