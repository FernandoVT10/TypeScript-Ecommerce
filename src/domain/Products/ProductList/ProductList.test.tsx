import React from "react";

import { render } from "@testing-library/react";

import ProductList from "./ProductList";

const PRODUCTS_RESPONSE_MOCK = {
    products: [
	{
	    _id: "test-id",
	    images: ["test-2.jpg"],
	    title: "test title 1",
	    price: 10,
	    discount: 0,
	    description: "test description"
	},
	{
	    _id: "test-id-2",
	    images: ["test-2.jpg"],
	    title: "test title 2",
	    price: 18,
	    discount: 50,
	    description: "test description 2"
	}
    ],
    totalPages: 10,
    hasPrevPage: true,
    prevPage: 3,
    hasNextPage: false,
    nextPage: null,
    page: 5
};

describe("Domain Products Product List", () => {
    it("should render the productList and pagination correclty", async () => {
        const { queryByText } = render(<ProductList productsResponse={PRODUCTS_RESPONSE_MOCK}/>);

        expect(queryByText("Results not found")).not.toBeInTheDocument();
        expect(queryByText("test description")).toBeInTheDocument();
        expect(queryByText("test description 2")).toBeInTheDocument();

        expect(queryByText("3")).toBeInTheDocument();
        expect(queryByText("4")).toBeInTheDocument();
        expect(queryByText("5")).toBeInTheDocument();
    });

    it("should render Results not found message", async () => {
	const { queryByText } = render(<ProductList productsResponse={
	    {
		products: [],
		totalPages: 10,
		hasPrevPage: true,
		prevPage: 3,
		hasNextPage: false,
		nextPage: null,
		page: 5
	    }
	}/>);

        expect(queryByText("Results not found")).toBeInTheDocument();
    });
});
