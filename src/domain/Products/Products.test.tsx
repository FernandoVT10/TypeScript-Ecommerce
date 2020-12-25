import React from "react";

import { render } from "@testing-library/react";

import Products from "./Products";

jest.mock("@/components/Navbar", () => () => null);

const PRODUCTS_PROPS_MOCK = {
    products: [
        {
            _id: "test-id",
            images: ["test-2.jpg"],
            title: "test title 1",
            price: 10,
            discount: 0,
            description: "test description"
        }
    ],
    totalProducts: 100,
    totalPages: 10,
    hasPrevPage: true,
    prevPage: 3,
    hasNextPage: false,
    nextPage: null,
    page: 5
}

const CATEGORIES_MOCK = [
    {
	_id: "test-category-1",
	name: "Gamer"
    }
]; 

describe("Domain Products", () => {
    it("should render correctly", () => {
	changeRouterProperties({
	    query: {},
	    asPath: ""
	});

	const { queryByText } = render(
	    <Products productsResponse={PRODUCTS_PROPS_MOCK} categories={CATEGORIES_MOCK}/>
	);

        expect(queryByText("test description")).toBeInTheDocument();

        expect(queryByText("100 products")).toBeInTheDocument();

        expect(queryByText("5")).toBeInTheDocument();

        expect(queryByText("Gamer")).toBeInTheDocument();
    });

    it("should render a alert when the url hash is equal to 'product_not_found'", () => {
	changeRouterProperties({
	    query: {},
	    asPath: "example#product_not_found"
	});

	const { queryByText } = render(
	    <Products productsResponse={PRODUCTS_PROPS_MOCK} categories={CATEGORIES_MOCK}/>
	);

	expect(queryByText("The product you are looking for doesn't exists")).toBeInTheDocument();
    });
});
