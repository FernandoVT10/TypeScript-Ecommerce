import React from "react";

import { render } from "@testing-library/react";

import ProductCard from "./ProductCard";

const PRODUCT_MOCK = {
    _id: "productId",
    title: "test title",
    images: ["test.jpg"],
    price: 20,
    discount: 50,
    inStock: 1990
}

describe("@/domain/Dashboard/Management/Products/ProductCard", () => {
    it("should render correclty", () => {
	const { queryByText, getByAltText } = render(<ProductCard product={PRODUCT_MOCK}/>);

	const image = getByAltText("Product Card Image") as HTMLImageElement;
	expect(image.src).toMatch("/img/products/thumb-test.jpg");

	expect(queryByText("In Stock: 1990")).toBeInTheDocument();
	expect(queryByText("test title")).toBeInTheDocument();
	expect(queryByText("%50")).toBeInTheDocument();
	expect(queryByText("$ 10")).toBeInTheDocument();
	expect(queryByText("$ 20")).toBeInTheDocument();
    });

    it("should render without discount", () => {
	const product = {
	    ...PRODUCT_MOCK,
	    discount: 0
	}

	const { queryByText, getByAltText } = render(<ProductCard product={product}/>);

	expect(queryByText("%50")).not.toBeInTheDocument();
	expect(queryByText("$ 10")).not.toBeInTheDocument();
	expect(queryByText("$ 20")).toBeInTheDocument();
    });
});
