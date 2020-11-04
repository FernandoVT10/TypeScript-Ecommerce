import React from "react";

import { fireEvent, render } from "@testing-library/react";

import SelectQuantity from "./SelectQuantity";

describe("Domain Product ProductDetails SelectQuantity", () => {
    it("should renders correcly", () => {
	const { queryByText } = render(<SelectQuantity inStock={31}/>);

	expect(queryByText("1 product")).toBeInTheDocument();
	expect(queryByText("10 products")).toBeInTheDocument();
	expect(queryByText("30 products")).toBeInTheDocument();
	expect(queryByText("31 products")).not.toBeInTheDocument();

	expect(queryByText("(31 available)")).toBeInTheDocument();
    });

    it("should change the quntity selected when we select other quantity option", async () => {
	const { findByText, queryByText } = render(<SelectQuantity inStock={31}/>);

	expect(queryByText("1")).toBeInTheDocument();

	const tenProductsOptions = await findByText("10 products");

	fireEvent.click(tenProductsOptions);

	expect(queryByText("10")).toBeInTheDocument();
    });
});
