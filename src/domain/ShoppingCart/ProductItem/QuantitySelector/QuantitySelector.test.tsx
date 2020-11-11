import React from "react";

import { fireEvent, render } from "@testing-library/react";

import QuantitySelector from "./QuantitySelector";

describe("Domain Shopping Cart Product Item QuantitySelector Component", () => {
    it("should render correctly", async () => {
	const { queryByText, findByTestId } = render(
	    <QuantitySelector quantity={5} setQuantity={jest.fn()} inStock={100}/>
	);

	const input = await findByTestId("quantity-selector-input") as HTMLInputElement;
	expect(input.value).toBe("5");

	expect(queryByText("Available: 100")).toBeInTheDocument();
    });

    it("should call setQuantity and add one to the quantity when we click on the add button", async () => {
	const setQuantityMock = jest.fn();

	const { findByText } = render(
	    <QuantitySelector quantity={99} setQuantity={setQuantityMock} inStock={100}/>
	);

	const addButton = await findByText("+") as HTMLButtonElement;
	fireEvent.click(addButton);

	expect(setQuantityMock).toHaveBeenCalledWith(100);

	fireEvent.click(addButton);

	expect(setQuantityMock).toHaveBeenCalledWith(100);
    });

    it("should call setQuantity and subtract one to the quantity when we click on the subtract button", async () => {
	const setQuantityMock = jest.fn();

	const { findByText } = render(
	    <QuantitySelector quantity={2} setQuantity={setQuantityMock} inStock={100}/>
	);

	const subtractButton = await findByText("-") as HTMLButtonElement;
	fireEvent.click(subtractButton);

	expect(setQuantityMock).toHaveBeenCalledWith(1);

	fireEvent.click(subtractButton);

	expect(setQuantityMock).toHaveBeenCalledWith(1);
    });

    it("should change the input value when we change the quantity", async () => {
	const { findByText, findByTestId } = render(
	    <QuantitySelector quantity={5} setQuantity={jest.fn()} inStock={100}/>
	);

	const input = await findByTestId("quantity-selector-input") as HTMLInputElement;

	const addButton = await findByText("+") as HTMLButtonElement;
	fireEvent.click(addButton);

	expect(input.value).toBe("6");

	const subtractButton = await findByText("-") as HTMLButtonElement;
	fireEvent.click(subtractButton);
	fireEvent.click(subtractButton);

	expect(input.value).toBe("4");
    });

    it("should call setQuantity when the input value is a number", async () => {
	const setQuantityMock = jest.fn();

	const { findByTestId } = render(
	    <QuantitySelector quantity={5} setQuantity={setQuantityMock} inStock={100}/>
	);

	const input = await findByTestId("quantity-selector-input") as HTMLInputElement;
	fireEvent.change(input, { target: { value: "101"} } );

	// when the quantity is greater than the stock,
	// the quantity becomes 100 and sets ohe quantity in the input
	expect(input.value).toBe("100");
	expect(setQuantityMock).toHaveBeenCalledWith(100);

	fireEvent.change(input, { target: { value: ""} } );

	expect(setQuantityMock).toHaveBeenCalledTimes(1);
    });
});
