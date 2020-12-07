import React from "react";

import { render } from "@testing-library/react";

import ProductCard from "./ProductCard";

const PRODUCT_MOCK = {
    title: "product",
    images: ["test.jpg"],
    price: 500,
    discount: 25,
    quantity: 99
}

describe("Domain BuyNow ProductCard", () => {
    it("should renders correctly", () => {
	const { getByAltText, queryByText } = render(<ProductCard product={PRODUCT_MOCK}/>);

	const image = getByAltText("Product Image") as HTMLImageElement;
	expect(image.src).toMatch("/img/products/thumb-test.jpg");
	
	expect(queryByText("product")).toBeInTheDocument();
	expect(queryByText("$ 375")).toBeInTheDocument();
	expect(queryByText("$ 500")).toBeInTheDocument();
	expect(queryByText("%25")).toBeInTheDocument();
	expect(queryByText("Quantity: 99")).toBeInTheDocument();
    });

    it("should renders without discount correctly", () => {
	const product = {
	    ...PRODUCT_MOCK,
	    discount: 0
	}
	const { queryByText } = render(<ProductCard product={product}/>);

	expect(queryByText("$ 375")).not.toBeInTheDocument();
	expect(queryByText("$ 500")).toBeInTheDocument();
	expect(queryByText("%25")).not.toBeInTheDocument();
    });
});
