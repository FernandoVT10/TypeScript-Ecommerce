import React from "react";

import { render, act, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import ApiController from "@/services/ApiController";

import Products from "./Products";

jest.mock("@/services/ApiController");
jest.mock("@/components/Dashboard/Layout", () => ({ children }) => children);

const mockedAPIGet = mocked(ApiController.get);

const CATEGORIES_MOCK = [
    { name: "category 1" },
    { name: "category 2" },
    { name: "category 3" }
];

const PRODUCTS_RESPONSE_MOCK = {
    products: [
	{
	    _id: "productId1",
	    title: "test title 1",
	    images: ["test-1.jpg"],
	    price: 10,
	    discount: 50,
	    inStock: 1
	},
	{
	    _id: "productId2",
	    title: "test title 2",
	    images: ["test-2.jpg"],
	    price: 20,
	    discount: 0,
	    inStock: 2
	}
    ],
    totalProducts: 1000,
    totalPages: 10,
    hasPrevPage: true,
    prevPage: 3,
    hasNextPage: false,
    nextPage: null,
    page: 5
}

Object.defineProperty(window, "location", {
    value: {
	search: "?test=true"
    }
});

describe("@/domian/Dashboard/Management/Products", () => {
    beforeEach(() => {
        mockedAPIGet.mockReset();
	mockedAPIGet
	    .mockResolvedValueOnce({
		data: { categories: CATEGORIES_MOCK }
	    })
	    .mockResolvedValueOnce({
		data: PRODUCTS_RESPONSE_MOCK
	    });

	changeRouterProperties({
	    query: ""
	});
    });

    it("should call the api and render correctly", async () => {
	await act(async () => render(<Products/>));

	expect(screen.queryByText("test title 1")).toBeInTheDocument();
	expect(screen.queryByText("test title 2")).toBeInTheDocument();

	expect(screen.queryByText("1000 products")).toBeInTheDocument();

	expect(mockedAPIGet).toHaveBeenCalledWith("products?test=true");
    });

    it("should render 'Products not found' message when the api doesn't return products", async () => {
        mockedAPIGet.mockReset();
	mockedAPIGet
	    .mockResolvedValueOnce({
		data: { categories: CATEGORIES_MOCK }
	    })
	    .mockResolvedValueOnce({
		data: {
		    ...PRODUCTS_RESPONSE_MOCK,
		    products: []
		}
	    });

	await act(async () => render(<Products/>));

	expect(screen.queryByText("Products not found")).toBeInTheDocument();

	expect(mockedAPIGet).toHaveBeenCalledWith("products?test=true");
    });
});
