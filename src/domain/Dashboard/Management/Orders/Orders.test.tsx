import React from "react";
import { mocked } from "ts-jest/utils";

import { render, act, screen } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import Orders from "./Orders";

jest.mock("@/components/Dashboard/Layout", () => ({ children }) => {
    return (
	    <div>{ children }</div>
    );
});
jest.mock("@/services/ApiController");

const ORDER_MOCK = {
    _id: "testid",
    total: 5000.50,
    status: "SHIPPING",
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
    user: {
	_id: "userid",
	username: "Test123"
    },
    shipping: {
	arrivesIn: "5 days",
	history: [
	    {
		content: "history #1",
		createdAt: "16 dec 2020"
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
	}
    ]
}

const API_RESPONSE_MOCK = {
    orders: [ ORDER_MOCK ],
    totalOrders: 100,
    totalPages: 10,
    hasPrevPage: true,
    prevPage: 3,
    hasNextPage: false,
    nextPage: null,
    page: 5
}

const mockedAPIGet = mocked(ApiController.get);

Object.defineProperty(window, "location", {
    value: {
	search: "?limit=test"
    }
});

describe("@/domain/Dashboard/Management/Orders", () => {
    beforeEach(() => {
        mockedAPIGet.mockReset();
	mockedAPIGet.mockImplementation(() => Promise.resolve({
	    data: API_RESPONSE_MOCK
	}));

	changeRouterProperties({
	    query: "object"
	});
    });

    it("should call the api and render correctly", async () => {
	await act(async () => render(<Orders/>));

	expect(mockedAPIGet).toHaveBeenCalledWith("orders?limit=test");

	expect(screen.queryByText("Test123")).toBeInTheDocument();
	expect(screen.queryByText("$ 5 000.50")).toBeInTheDocument();
	expect(screen.queryByText("test title 1")).toBeInTheDocument();
	expect(screen.getAllByTestId("pagination-button")).toHaveLength(2);
    });

    it("should display a message when there are no orders", async () => {
	mockedAPIGet.mockImplementation(() => Promise.resolve({}));

	await act(async () => render(<Orders/>));

	expect(screen.queryByText("There are no orders to show")).toBeInTheDocument();
    });
});
