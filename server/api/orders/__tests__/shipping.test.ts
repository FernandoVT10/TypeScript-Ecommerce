import app from "../../../app";
import supertest from "supertest";
import Order from "../../../models/Order";
import User from "../../../models/User";
import Shipping from "../../../models/Shipping";

const request = supertest(app);

setupTestDB("test_orders_shipping_api");
mockAuthentication();

const SHIPPING_MOCK = {
    history: [
	{ content: "test content" }
    ]
}

const ORDER_MOCK = {
    userId: null,
    shipping: "",
    paypalOrderId: "testpaypalid",
    address: null,
    products: [],
    total: 50,
    status: "SHIPPING" as any,
    createdAt: Date.now()
}

describe("api/orders/shipping", () => {
    let orderId = "", shippingId = "";

    beforeEach(async () => {
	await User.updateOne({}, { permits: "ADMIN" });

	const shipping = await Shipping.create(SHIPPING_MOCK);
	shippingId = shipping._id;

	ORDER_MOCK.shipping = shipping._id;

        const order = await Order.create(ORDER_MOCK);
	orderId = order._id;
    });

    describe("Add Status", () => {
	it("should add a new status to shipping history correclty", async () => {
	    const res = await request.post(`/api/orders/${orderId}/shipping/addStatus`)
		.send({ status: "test status" })
		.set("Authorization", "Bearer token");

	    expect(res.body.data.message).toBe("The shipping status has been added successfully");

	    const shipping = await Shipping.findById(shippingId);
	    expect(shipping.history[1].content).toBe("test status");
	});

	it("should return an error when the orderId doesn't exist", async () => {
	    const res = await request.post(`/api/orders/abcdefabcdefabcdefabcdef/shipping/addStatus`)
		.send({ status: "test status" })
		.set("Authorization", "Bearer token");

	    expect(res.body).toEqual({
	    	status: 404,
		error: "Order not found",
		message: `The order 'abcdefabcdefabcdefabcdef' doesn't exists`,
		path: "/api/orders/abcdefabcdefabcdefabcdef/shipping/addStatus"
	    });
	});
    });
});
