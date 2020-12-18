import React from "react";

import { fireEvent, render } from "@testing-library/react";

import Textarea from "./Textarea";

describe("@/components/Formulary/Textarea", () => {
    it("should renders correctly", () => {
	const { getByDisplayValue, queryByText } = render(
	    <Textarea
	    id="test-id"
	    name="test-name"
	    label="Test Label"
	    value="test-value"
	    maxLength={100}
	    setValue={jest.fn()}/>
	);

	expect(queryByText("Test Label")).toBeInTheDocument();
	expect(queryByText("10/100")).toBeInTheDocument();

	const textarea = getByDisplayValue("test-value") as HTMLTextAreaElement;

	expect(textarea.id).toBe("test-id");
	expect(textarea.name).toBe("test-name");
	expect(textarea.value).toBe("test-value");
	expect(textarea.maxLength).toBe(100);
    });

    it("should change the character count", () => {
	const { queryByText, rerender } = render(
	    <Textarea
	    id="test-id"
	    name="test-name"
	    label="Test Label"
	    value="test-value"
	    maxLength={100}
	    setValue={jest.fn()}/>
	);

	expect(queryByText("10/100")).toBeInTheDocument();

	rerender(
	    <Textarea
	    id="test-id"
	    name="test-name"
	    label="Test Label"
	    value="13 characters"
	    maxLength={100}
	    setValue={jest.fn()}/>
	);

	expect(queryByText("13/100")).toBeInTheDocument();
    });

    it("should render an error message", () => {
	const { queryByText } = render(
	    <Textarea
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

    it("should call setValue", () => {
	const setValueMock = jest.fn();

	const { getByDisplayValue } = render(
	    <Textarea
	    id="test-id"
	    name="test-name"
	    label="Test Label"
	    value="test-value"
	    maxLength={5}
	    setValue={setValueMock}
	    errorMessage="test error"/>
	);

	const textarea = getByDisplayValue("test-value") as HTMLInputElement;
	fireEvent.change(textarea, { target: { value: "changed value" } });
	
	expect(setValueMock).toHaveBeenCalledWith("changed value");
    });
});
