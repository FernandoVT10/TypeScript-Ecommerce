import React from "react";

import { render } from "@testing-library/react";

import ProductCard from "./ProductCard";

const PRODUCT_MOCK = {
    discount: 50,
    price: 500,
    quantity: 10,
    originalProduct: {
	_id: "testid",
	title: "test title",
	images: ["test.jpg"]
    }
}

describe("@/domain/Dashboard/Orders/OrderCard/ProductCard", () => {
    it("should render correctly", () => {
	const { queryByText, getByAltText } = render(<ProductCard product={PRODUCT_MOCK}/>);

	const img = getByAltText("Product Image") as HTMLImageElement;
	expect(img.src).toMatch("thumb-test.jpg");

	expect(queryByText("test title")).toBeInTheDocument();
	expect(queryByText("$ 250")).toBeInTheDocument();
	expect(queryByText("$ 500")).toBeInTheDocument();
	expect(queryByText("%50")).toBeInTheDocument();
	expect(queryByText("Quantity: 10")).toBeInTheDocument();
    });

    it("should render without discount correctly", () => {
	const product = {
	    ...PRODUCT_MOCK,
	    discount: 0
	}
	const { queryByText } = render(<ProductCard product={product}/>);

	expect(queryByText("$ 500")).toBeInTheDocument();

	expect(queryByText("$ 250")).not.toBeInTheDocument();
	expect(queryByText("%50")).not.toBeInTheDocument();
    });
});
