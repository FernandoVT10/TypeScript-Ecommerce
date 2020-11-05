import React from "react";

import { render } from "@testing-library/react";

import ProductDetails from "./ProductDetails";

const PRODUCT_MOCK = {
    title: "Test title",
    calification: 4.8,
    price: 10000,
    inStock: 31,
    discount: 50,
    arrivesIn: "1 century",
    warranty: "Test warranty"
}

describe("Domian Product ProductDetails", () => {
    it("should render correctly", () => {
	const { queryByText, queryAllByText } = render(<ProductDetails product={PRODUCT_MOCK} totalReviews={50}/>);

	expect(queryByText("Test title")).toBeInTheDocument();
	expect(queryByText("50 reviews")).toBeInTheDocument();

	expect(queryByText("$ 5 000")).toBeInTheDocument();
	expect(queryByText("$ 10 000")).toBeInTheDocument();
	expect(queryByText("%50 OFF")).toBeInTheDocument();

	expect(queryByText("(31 available)")).toBeInTheDocument();
	
	expect(queryAllByText(/1 century/)).toHaveLength(2);
	expect(queryByText("Test warranty")).toBeInTheDocument();
    });

    it("should render without discount", () => {
	const localMock = { ...PRODUCT_MOCK };

	localMock.discount = 0;

	const { queryByText } = render(<ProductDetails product={localMock} totalReviews={50}/>);

	expect(queryByText("$ 10 000")).toBeInTheDocument();
	expect(queryByText("%50 OFF")).not.toBeInTheDocument();
    });
});
