import React from "react";

import { fireEvent, render } from "@testing-library/react";

import ProductItem from "./ProductItem";

const PRODUCT_MOCK = {
    _id: "test-id",
    title: "test title",
    images: ["test-1.jpg"],
    price: 1400,
    quantity: 2,
    discount: 50,
    inStock: 5
}

describe("Product Domain Shopping Cart ProductItem Component", () => {
    it("should render correctly", async () => {
	const { queryByText, findByAltText } = render(
	    <ProductItem product={PRODUCT_MOCK} removeProductFromCart={jest.fn()} updateQuantityOnCart={jest.fn()}/>
	);

	const image = await findByAltText("Product Item Image") as HTMLImageElement;
	expect(image.src).toMatch("test-1.jpg");

	expect(queryByText("test title")).toBeInTheDocument();
	expect(queryByText("50%")).toBeInTheDocument();
	expect(queryByText("$ 1 400")).toBeInTheDocument();
	expect(queryByText("$ 2 800")).toBeInTheDocument();
	expect(queryByText("Available: 5")).toBeInTheDocument();
    });

    it("should render without the discount ", async () => {
	const PRODUCT_WITHOUT_DISCOUNT = {
	    ...PRODUCT_MOCK
	};
	PRODUCT_WITHOUT_DISCOUNT.discount = 0;

	const { queryByText } = render(
	    <ProductItem product={PRODUCT_WITHOUT_DISCOUNT} removeProductFromCart={jest.fn()} updateQuantityOnCart={jest.fn()}/>
	);

	expect(queryByText("50%")).not.toBeInTheDocument();
	expect(queryByText("$ 1 400")).not.toBeInTheDocument();
	expect(queryByText("$ 2 800")).toBeInTheDocument();
    });

    it("should call removeProductFromCart", async () => {
	const removeProductFromCartMock = jest.fn();

	const { findByText } = render(
	    <ProductItem product={PRODUCT_MOCK} removeProductFromCart={removeProductFromCartMock} updateQuantityOnCart={jest.fn()}/>
	);

	const removeLink = await findByText("Remove");
	fireEvent.click(removeLink);

	expect(removeProductFromCartMock).toHaveBeenCalledWith("test-id");
    });

    it("should call updateQuantityOnCart", async () => {
	const updateQuantityOnCartMock = jest.fn();

	const { findByText } = render(
	    <ProductItem product={PRODUCT_MOCK} removeProductFromCart={jest.fn()} updateQuantityOnCart={updateQuantityOnCartMock}/>
	);

	const addButton = await findByText("+");
	fireEvent.click(addButton);

	expect(updateQuantityOnCartMock).toHaveBeenCalledWith("test-id", 3);
    });
});
