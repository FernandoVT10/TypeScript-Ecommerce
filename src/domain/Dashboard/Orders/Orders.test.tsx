import React from "react";

import { mocked } from "ts-jest/utils";
import { render, act, screen } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import Orders from "./Orders";

jest.mock("@/services/ApiController");
jest.mock("@/components/Dashboard/Layout", () => ({ children }) => {
    return <div>{ children }</div>;
});

type Status = "SHIPPING" | "COMPLETED";

const ORDER_MOCK = {
    _id: "testid",
    total: 5000.50,
    status: "SHIPPING" as Status,
    address: {
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
    },
    shipping: {
	arrivesIn: "5 days",
	history: [
	    {
		content: "history #1",
		createdAt: new Date("16 dec 2020").toString()
	    },
	    {
		content: "history #2",
		createdAt: new Date("25 oct 2020").toString()
	    }
	]
    },
    products: [
	{
	    discount: 50,
	    price: 5000.40,
	    quantity: 2,
	    originalProduct: {
		_id: "id-1",
		title: "test title 1",
		images: ["test-1.jpg"]
	    }
	},
	{
	    discount: 0,
	    price: 0.5,
	    quantity: 2,
	    originalProduct: {
		_id: "id-2",
		title: "test title 2",
		images: ["test-2.jpg"]
	    }
	}
    ]
}

const mockedAPIGet = mocked(ApiController.get);

describe("@/domain/Dashboard/Orders", () => {
    beforeEach(() => {
        mockedAPIGet.mockReset();
	mockedAPIGet.mockImplementation(() => Promise.resolve({
	    data: { orders: [ ORDER_MOCK ] }
	}));
    });

    it("should call the api and render the orders correctly", async () => {
	await act(async () => render(<Orders/>));

	expect(mockedAPIGet).toHaveBeenCalledWith("account/orders/");

	expect(screen.queryByText("Order Id: testid")).toBeInTheDocument();
	expect(screen.queryByText("$ 5 000.50")).toBeInTheDocument();
    });

    it("should render the message 'You don't have orders' when there are not orders", async () => {
	mockedAPIGet.mockImplementation(() => Promise.resolve({
	    data: { orders: [] }
	}));

	await act(async () => render(<Orders/>));

	expect(screen.queryByText("You don't have orders")).toBeInTheDocument();
    });
});
