import React from "react";

import { fireEvent, render } from "@testing-library/react";

import SelectQuantity from "./SelectQuantity";

describe("Domain Product ProductDetails SelectQuantity", () => {
    it("should renders correcly", () => {
	const { queryByText } = render(
	    <SelectQuantity quantity={1} inStock={31} setQuantity={jest.fn()}/>
	);

	expect(queryByText("1 product")).toBeInTheDocument();
	expect(queryByText("10 products")).toBeInTheDocument();
	expect(queryByText("30 products")).toBeInTheDocument();
	expect(queryByText("31 products")).not.toBeInTheDocument();

	expect(queryByText("(31 available)")).toBeInTheDocument();
    });

    it("should call setQuantity when we select other quantity option", async () => {
	const setQuantityMock = jest.fn();

	const { findByText, queryByText } = render(
	    <SelectQuantity quantity={17} inStock={31} setQuantity={setQuantityMock}/>
	);

	// This is the current quantity
	expect(queryByText("17")).toBeInTheDocument();

	const tenProductsOptions = await findByText("10 products");
	fireEvent.click(tenProductsOptions);

	expect(setQuantityMock).toHaveBeenCalledWith(10);
    });
});
