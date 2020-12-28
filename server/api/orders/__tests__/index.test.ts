import app from "../../../app";
import supertest from "supertest";
import Order, { IOrder } from "../../../models/Order";
import User from "../../../models/User";
import Shipping from "../../../models/Shipping";
import Product from "../../../models/Product";

const request = supertest(app);

setupTestDB("test_orders_api");
mockAuthentication();

const SHIPPING_MOCK = {
    history: [
	{ content: "test content" }
    ]
}

const PRODUCT_MOCK = {
    title: "product title",
    images: ["test.jpg"],
    price: 50,
    inStock: 2,
    warranty: "test warranty",
    description: "test description",
    categories: [],
}

const ADDRESS_MOCK = {
    fullName: "full name test",
    postalCode: "12345",
    state: "test state",
    municipality: "test municipality",
    suburb: "test suburb",
    street: "test street",
    outdoorNumber: "12",
    phoneNumber: "123-456-7890",
}

const ORDERS_MOCK = [
    {
	userId: "",
	shipping: "",
	paypalOrderId: "testpaypalid",
	address: ADDRESS_MOCK,
	products: [],
	total: 50,
	status: "COMPLETED" as any,
	createdAt: Date.now() + 50
    },
    {
	userId: "",
	shipping: "",
	paypalOrderId: "testpaypalid 2",
	address: ADDRESS_MOCK,
	products: [],
	total: 50,
	status: "SHIPPING" as any,
	createdAt: Date.now()
    }
];

describe("api/orders/index", () => {
    beforeEach(async () => {
	const user = await User.findOne();
	user.permits = "ADMIN";
	await user.save();

	const shipping = await Shipping.create(SHIPPING_MOCK);
	const product = await Product.create(PRODUCT_MOCK);

	for(const order of ORDERS_MOCK) {
	    order.userId = user._id;
	    order.shipping = shipping._id;
	    order.products.push({
	    	originalProduct: product._id,
		discount: 0,
		quantity: 1,
		price: 50
	    })

	    await Order.create(order);
	}
    });

    describe("Get Orders", () => {
	it("should get all the orders correclty", async () => {
	    const res = await request.get("/api/orders/").set("Authorization", "Bearer token");

	    const { data } = res.body;

	    expect(data.totalOrders).toBe(2);
	    expect(data.hasNextPage).toBeFalsy();
	    expect(data.hasPrevPage).toBeFalsy();

	    const orders = data.orders as Array<IOrder>;

	    expect(orders).toHaveLength(2);

	    expect(orders[0].paypalOrderId).toBe("testpaypalid");
	    expect(orders[0].status).toBe("COMPLETED");
	    expect(orders[0].shipping.history[0].content).toBe("test content");
	    expect(orders[0].products[0].price).toBe(50);
	    expect(orders[0].products[0].originalProduct).toEqual({
		_id: expect.any(String),
	    	title: "product title",
		images: ["test.jpg"]
	    });
	    expect(orders[0].user).toEqual({
		_id: expect.any(String),
	    	username: "test777"
	    });

	    expect(orders[1].paypalOrderId).toBe("testpaypalid 2");
	    expect(orders[1].status).toBe("SHIPPING");
	    expect(orders[1].shipping.history[0].content).toBe("test content");
	    expect(orders[1].products[0].price).toBe(50);
	    expect(orders[1].products[0].originalProduct).toEqual({
		_id: expect.any(String),
	    	title: "product title",
		images: ["test.jpg"]
	    });
	    expect(orders[1].user).toEqual({
		_id: expect.any(String),
	    	username: "test777"
	    });
	});

	it("should get one order ehen the parameter limit is equal to 1", async () => {
	    const res = await request.get("/api/orders?limit=1").set("Authorization", "Bearer token");

	    const { data } = res.body;

	    expect(data.totalOrders).toBe(2);
	    expect(data.hasNextPage).toBeTruthy();
	    expect(data.hasPrevPage).toBeFalsy();

	    const orders = data.orders as Array<IOrder>;

	    expect(orders).toHaveLength(1);

	    expect(orders[0].paypalOrderId).toBe("testpaypalid");
	    expect(orders[0].status).toBe("COMPLETED");
	    expect(orders[0].shipping.history[0].content).toBe("test content");
	    expect(orders[0].products[0].price).toBe(50);
	});

	it("should get one order ehen the parameter limit is equal to 1 and page is equal to 2", async () => {
	    const res = await request.get("/api/orders?limit=1&page=2").set("Authorization", "Bearer token");

	    const { data } = res.body;

	    expect(data.totalOrders).toBe(2);
	    expect(data.hasNextPage).toBeFalsy();
	    expect(data.hasPrevPage).toBeTruthy();

	    const orders = data.orders as Array<IOrder>;

	    expect(orders).toHaveLength(1);

	    expect(orders[0].paypalOrderId).toBe("testpaypalid 2");
	    expect(orders[0].status).toBe("SHIPPING");
	    expect(orders[0].shipping.history[0].content).toBe("test content");
	    expect(orders[0].products[0].price).toBe(50);
	});

	it("should get one order by orderId", async () => {
	    const { _id } = await Order.findOne({ status: "COMPLETED" });
	    const res = await request.get(`/api/orders?orderId=${_id}`).set("Authorization", "Bearer token");

	    const { data } = res.body;

	    expect(data.totalOrders).toBe(1);

	    const order = data.orders[0] as IOrder;

	    expect(order.paypalOrderId).toBe("testpaypalid");
	    expect(order.status).toBe("COMPLETED");
	    expect(order.shipping.history[0].content).toBe("test content");
	    expect(order.products[0].price).toBe(50);
	});

	it("should get the orders with 'SHIPPING' status only", async () => {
	    const res = await request.get("/api/orders?only=SHIPPING").set("Authorization", "Bearer token");

	    const { data } = res.body;
	    expect(data.totalOrders).toBe(1);

	    const order = data.orders[0] as IOrder;
	    expect(order.paypalOrderId).toBe("testpaypalid 2");
	    expect(order.status).toBe("SHIPPING");
	});
    });
});
