import React from "react";

import { fireEvent, render } from "@testing-library/react";

import Checkbox from "./Checkbox";

describe("Formulary Checkbox Component", () => {
    it("should renders correctly", async () => {
	const { findByRole, queryByText } = render(
	    <Checkbox
	    id="test-id"
	    name="test-name"
	    checked={true}
	    setChecked={jest.fn()}>
		<span>Test Children</span>
	    </Checkbox>
	);

	const checkbox = await findByRole("checkbox") as HTMLInputElement;

	expect(checkbox.id).toBe("test-id");
	expect(checkbox.name).toBe("test-name");
	expect(checkbox.checked).toBeTruthy();
        
	expect(queryByText("Test Children")).toBeInTheDocument();
    });

    it("should renders an error message", () => {
	const { queryByText } = render(
	    <Checkbox
	    id="test-id"
	    name="test-name"
	    checked={true}
	    setChecked={jest.fn()}
	    errorMessage="test error message">
		<span>Test Children</span>
	    </Checkbox>
	);
        
	expect(queryByText("test error message")).toBeInTheDocument();
    });

    it("should call setChecked", async () => {
	const setCheckedMock = jest.fn();

	const { findByRole } = render(
	    <Checkbox
	    id="test-id"
	    name="test-name"
	    checked={true}
	    setChecked={setCheckedMock}>
		<span>Test Children</span>
	    </Checkbox>
	);

	const checkbox = await findByRole("checkbox") as HTMLInputElement;
	fireEvent.click(checkbox);

	expect(setCheckedMock).toBeCalledWith(false);
    });
});


