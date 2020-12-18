import app from "../../../app";
import supertest from "supertest";

import Order, { IOrder } from "../../../models/Order";
import User from "../../../models/User";
import Shipping from "../../../models/Shipping";
import Product from "../../../models/Product";

const request = supertest(app);

setupTestDB("test_account_orders_api");
mockAuthentication();

const ADDRESS_MOCK = {
    fullName: "Test Man",
    postalCode: "12345",
    state: "test state",
    municipality: "test municipality",
    suburb: "test suburb",
    street: "test street",
    outdoorNumber: "123",
    interiorNumber: "456",
    phoneNumber: "123-456-7890",
    additionalInformation: "test additional information"
}

const PRODUCT_MOCK = {
    title: "this is a product",
    images: ["test-1.jpg"],
    price: 50,
    discount: 25,
    inStock: 3,
    arrivesIn: "3 day",
    warranty: "3 years",
    description: "test description 2",
    categories: [],
    createdAt: Date.now() + 30
}

const ORDERS_MOCK = [
    {
	userId: "",
	total: 5000.50,
	paypalOrderId: "test",
	status: "PENDING",
	address: ADDRESS_MOCK,
	shipping: "",
	products: []
    },
    {
	userId: "",
	total: 5000.50,
	paypalOrderId: "test",
	status: "SHIPPING",
	address: ADDRESS_MOCK,
	shipping: "",
	products: []
    },
    {
	userId: "",
	total: 5000.50,
	paypalOrderId: "test",
	status: "COMPLETED",
	address: ADDRESS_MOCK,
	shipping: "",
	products: []
    }
];

const SHIPPING_MOCK = {
    arrivesIn: "5 days",
    history: [
	{ content: "history #1" },
	{ content: "history #2" }
    ]
}

describe("api/account/orders", () => {
    beforeEach(async () => {
	const user = await User.findOne();
	const shipping = await Shipping.create(SHIPPING_MOCK);
	const product = await Product.create(PRODUCT_MOCK);

	for(const order of ORDERS_MOCK) {
	    order.userId = user._id;
	    order.shipping = shipping._id;
	    order.products.push({
		discount: 0,
		price: 0.5,
		quantity: 2,
		originalProduct: product._id
	    });

	    await Order.create(order as IOrder);
	}
    });

    describe("Get Orders", () => {
	it("should get all the orders with the status 'SHIPPING' or 'COMPLETED'", async () => {
	    const res = await request.get("/api/account/orders").set("Authorization", "Bearer token");

	    const { orders } = res.body.data;
	    expect(orders).toHaveLength(2);

	    const shipping = orders[0].shipping;
	    expect(shipping.arrivesIn).toBe("5 days");
	    expect(shipping.history[0].content).toBe("history #1");
	    expect(shipping.history[1].content).toBe("history #2");

	    const product = orders[0].products[0];
	    expect(product.price).toBe(0.5);
	    expect(product.quantity).toBe(2);
	    expect(product.originalProduct.title).toBe("this is a product");
	    expect(product.originalProduct.images).toEqual(["test-1.jpg"]);
	});
    });
});
