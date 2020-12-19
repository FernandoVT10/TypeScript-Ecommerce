import React from "react";

import { render } from "@testing-library/react";

import ProductDetails from "./ProductDetails";

const PRODUCT_MOCK = {
    _id: "test-id",
    title: "Test title",
    calification: 4.8,
    price: 10000,
    inStock: 31,
    discount: 50,
    warranty: "Test warranty"
}

describe("Domian Product ProductDetails", () => {
    it("should render correctly", () => {
	const { queryByText } = render(
	    <ProductDetails product={PRODUCT_MOCK} totalReviews={50}/>
	);

	expect(queryByText("Test title")).toBeInTheDocument();
	expect(queryByText("50 reviews")).toBeInTheDocument();

	expect(queryByText("$ 5 000")).toBeInTheDocument();
	expect(queryByText("$ 10 000")).toBeInTheDocument();
	expect(queryByText("%50 OFF")).toBeInTheDocument();

	expect(queryByText("(31 available)")).toBeInTheDocument();
	
	expect(queryByText("Test warranty")).toBeInTheDocument();
    });

    it("shouldn't render the buyNow and addToShoppingCart buttons when there is no stock", () => {
	const product = {
	    ...PRODUCT_MOCK,
	    inStock: 0
	}

	const { queryByText } = render(
	    <ProductDetails product={product} totalReviews={50}/>
	);

	expect(queryByText("Buy Now")).not.toBeInTheDocument();
	expect(queryByText("Add to Shopping Cart")).not.toBeInTheDocument();
    });

    it("should render without discount", () => {
	const localMock = { ...PRODUCT_MOCK };

	localMock.discount = 0;

	const { queryByText } = render(
	    <ProductDetails product={localMock} totalReviews={50}/>
	);

	expect(queryByText("$ 10 000")).toBeInTheDocument();
	expect(queryByText("%50 OFF")).not.toBeInTheDocument();
    });
});
