import React from "react";

import { render } from "@testing-library/react";

import ActivationMessage from "./ActivationMessage";

describe("Domain Login ActivationMessage Component", () => {
    it("should renders null", () => {
	const { container } = render(<ActivationMessage activationStatus=""/>);

	expect(container.textContent).toBe("");
    });
    
    it("should renders a success message", () => {
	const { queryByText } = render(<ActivationMessage activationStatus="success"/>);

	expect(queryByText(
	    "Your account has been activated successfully. Now you can login."
	)).toBeInTheDocument();
    });

    it("should renders an error message", () => {
	const { queryByText } = render(<ActivationMessage activationStatus="error"/>);

	expect(queryByText(
	    "The activation token don't exists."
	)).toBeInTheDocument();
    });
});
