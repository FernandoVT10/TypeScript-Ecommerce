import React from "react";

import { fireEvent, render } from "@testing-library/react";

import Input from "./Input";

describe("Formulary Input Component", () => {
    it("should renders correctly", async () => {
	const { findByDisplayValue, queryByText } = render(
	    <Input
	    type="text"
	    id="test-id"
	    name="test-name"
	    label="Test Label"
	    value="test-value"
	    maxLength={5}
	    setValue={jest.fn()}/>
	);

	expect(queryByText("Test Label")).toBeInTheDocument();

	const input = await findByDisplayValue("test-value") as HTMLInputElement;

	expect(input.type).toBe("text");
	expect(input.id).toBe("test-id");
	expect(input.name).toBe("test-name");
	expect(input.autocomplete).toBe("test-name");
	expect(input.value).toBe("test-value");
	expect(input.maxLength).toBe(5);
    });

    it("should renders an error message", () => {
	const { queryByText } = render(
	    <Input
	    type="text"
	    id="test-id"
	    name="test-name"
	    label="Test Label"
	    value="test-value"
	    maxLength={5}
	    setValue={jest.fn()}
	    errorMessage="test error"/>
	);

	expect(queryByText("test error")).toBeInTheDocument();
    });

    it("should call setValue", async () => {
	const setValueMock = jest.fn();

	const { findByDisplayValue } = render(
	    <Input
	    type="text"
	    id="test-id"
	    name="test-name"
	    label="Test Label"
	    value="test-value"
	    maxLength={5}
	    setValue={setValueMock}
	    errorMessage="test error"/>
	);

	const input = await findByDisplayValue("test-value") as HTMLInputElement;
	fireEvent.change(input, { target: { value: "changed value" } });
        
	expect(setValueMock).toHaveBeenCalledWith("changed value");
    });
});
