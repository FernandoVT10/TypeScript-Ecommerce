import React from "react";

import { render, act, screen, fireEvent } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import ApiController from "@/services/ApiController";

import Filter from "./Filter";

jest.mock("@/services/ApiController");

const mockedAPIGet = mocked(ApiController.get);

const CATEGORIES_MOCK = [
    { name: "category 1" },
    { name: "category 2" },
    { name: "category 3" }
];

describe("@/domian/Management/Products/Filter", () => {
    beforeEach(() => {
        changeRouterProperties({
            query: ""
        });
	mockedAPIGet.mockReset();
	mockedAPIGet.mockResolvedValue({
	    data: {
		categories: CATEGORIES_MOCK
	    }
	});
    });

    it("should call the api and render correclty", async () => {
	await act(async () => render(<Filter totalProducts={100}/>));

	fireEvent.click(screen.getByText("Filter"));

	expect(screen.queryByText("100 products")).toBeInTheDocument();
	
	expect(screen.queryByText("category 1")).toBeInTheDocument();
	expect(screen.queryByText("category 2")).toBeInTheDocument();
	expect(screen.queryByText("category 3")).toBeInTheDocument();

	expect(screen.queryByText("Stock")).toBeInTheDocument();
	expect(screen.queryByText("Creation Date")).toBeInTheDocument();
	expect(screen.queryByText("Discount")).toBeInTheDocument();
	expect(screen.queryByText("Price")).toBeInTheDocument();
	expect(screen.queryByText("Title")).toBeInTheDocument();

	expect(mockedAPIGet).toHaveBeenCalledWith("categories");
    });

    it("should set the values from the query parameters correclty", async () => {
	changeRouterProperties({
	    query: {
		category: "category 3",
		sortBy: "price",
		search: "test",
		limit: 20
	    }
	});

	await act(async () => render(<Filter totalProducts={100}/>));

	fireEvent.click(screen.getByText("Filter"));

	expect(screen.queryByDisplayValue("test")).toBeInTheDocument();
	
	const category = screen.getByText("category 3");
	expect(category.classList.contains("active")).toBeTruthy();

	const priceButton = screen.getByText("Price");
	expect(priceButton.classList.contains("active")).toBeTruthy();

	const rangeInput = screen.getByTestId("range-input") as HTMLInputElement;
	expect(rangeInput.value).toBe("20");
    });

    it("should call router.push with the category, search, sortBy and limit query parameters", async () => {
	const routerPushMock = jest.fn();

	changeRouterProperties({
	    push: routerPushMock,
	    pathname: "/"
	});

	await act(async () => render(<Filter totalProducts={100}/>));

	fireEvent.click(screen.getByText("Filter"));

	fireEvent.click(screen.getByText("category 2"));
	fireEvent.click(screen.getByText("Price"));

	fireEvent.change(screen.getByPlaceholderText("Search a product"), { target: { value: "test search" } });
	fireEvent.change(screen.getByTestId("range-input"), { target: { value: "19" } });

	fireEvent.click(screen.getByText("Apply Filters"));

	expect(routerPushMock).toHaveBeenCalledWith({
	    pathname: "/",
	    query: {
		category: "category 2",
		sortBy: "price",
		search: "test search",
		limit: 19
	    }
	});
    });

    it("should deactivate the filter when we apply the filters", async () => {
	await act(async () => render(<Filter totalProducts={100}/>));

	fireEvent.click(screen.getByText("Filter"));

	fireEvent.click(screen.getByText("Apply Filters"));

	expect(screen.queryByText("Categories")).not.toBeInTheDocument();
    });
});
