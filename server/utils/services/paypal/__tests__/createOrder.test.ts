import { mocked } from "ts-jest/utils";

import createOrder from "../createOrder";

import apiCall from "../apiCall";

jest.mock("../apiCall");

const mockedAPICall = mocked(apiCall);

const ORDER_ITEMS_MOCK = [
    {
	title: "test 1",
	price: 50,
	quantity: 2
    },
    {
	title: "test 2",
	price: 2.5,
	quantity: 4
    }
];

describe("Paypal Create Order service", () => {
    beforeEach(() => {
	mockedAPICall.mockReset();
	mockedAPICall.mockImplementation(() => Promise.resolve({ id: "testorderid" }));
    });

    it("should call apiCall and return the order id", async () => {
	const res = await createOrder(ORDER_ITEMS_MOCK);
	expect(res).toBe("testorderid");

	const call = mockedAPICall.mock.calls[0];
	
	expect(call[0]).toBe("/v2/checkout/orders");
	expect(call[1]).toMatchSnapshot();
    });

    it("should throw an error when the api call doesn't returns the order id", async () => {
	mockedAPICall.mockImplementation(() => Promise.resolve({}));

	try {
	    await createOrder(ORDER_ITEMS_MOCK);
	} catch (err) {
	    expect(err.message).toBe("Payment couldn't be created")
	}
    });
});
