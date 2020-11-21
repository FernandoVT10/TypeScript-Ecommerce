import React from "react";

import { fireEvent, render, screen, act } from "@testing-library/react";

import Register from "./Register";

const setInputValue = (inputLabel: string, value: string) => {
    const input = screen.getByLabelText(inputLabel);
    fireEvent.change(input, { target: { value } });
}

describe("Domain Register Component", () => {
    beforeEach(() => {
	fetchMock.resetMocks();
    });

    it("should renders correctly", () => {
	render(<Register/>);
    });

    it("should call handleForm and set an email error", () => {
	const { getByRole, queryByText } = render(<Register/>);

	const submitButton = getByRole("button");
	fireEvent.click(submitButton);

	expect(queryByText("The email is invalid")).toBeInTheDocument();
    });

    it("should call handleForm and set a password error", () => {
	const { getByRole, queryByText } = render(<Register/>);

	setInputValue("Email", "e@e.com");

	const submitButton = getByRole("button");
	fireEvent.click(submitButton);

	expect(queryByText("The password must contain 4 or more characters")).toBeInTheDocument();
    });

    it("should call handleForm and set a repeat password error", () => {
	const { getByRole, queryByText } = render(<Register/>);

	setInputValue("Email", "e@e.com");
	setInputValue("Password", "secret");

	const submitButton = getByRole("button");
	fireEvent.click(submitButton);

	expect(queryByText("The passwords doesn't match")).toBeInTheDocument();
    });

    it("should call handleForm and set a terms and conditions error", () => {
	const { getByRole, queryByText } = render(<Register/>);

	setInputValue("Email", "e@e.com");
	setInputValue("Password", "secret");
	setInputValue("Repeat Password", "secret");

	const submitButton = getByRole("button");
	fireEvent.click(submitButton);

	expect(queryByText("You must accept the terms and conditions")).toBeInTheDocument();
    });

    it("should call send the data to the api correctly", async () => {
	const { getByRole } = render(<Register/>);

	setInputValue("Name", "Mr. Test");
	setInputValue("Username", "test");
	setInputValue("Email", "e@e.com");
	setInputValue("Password", "secret");
	setInputValue("Repeat Password", "secret");

	const checkbox = getByRole("checkbox");
	fireEvent.click(checkbox);

	fetchMock.mockOnce(JSON.stringify({ data: { message: "" } }))

	const submitButton = getByRole("button");
	await act(async () => fireEvent.click(submitButton));

	const fetchCall = fetchMock.mock.calls[0];

	expect(fetchCall[0]).toMatch("account/register/");

	expect(fetchCall[1].body).toBe(JSON.stringify({
	    name: "Mr. Test",
	    username: "test",
	    email: "e@e.com",
	    password: "secret"
	}));
    });

    it("should set an error from the api call", async () => {
	const { queryByText, getByRole } = render(<Register/>);

	setInputValue("Name", "Mr. Test");
	setInputValue("Username", "test");
	setInputValue("Email", "e@e.com");
	setInputValue("Password", "secret");
	setInputValue("Repeat Password", "secret");

	const checkbox = getByRole("checkbox");
	fireEvent.click(checkbox);

	fetchMock.mockOnce(JSON.stringify({ error: "Validation Error", message: "test error" }));

	const submitButton = getByRole("button");
	await act(async () => fireEvent.click(submitButton));

	expect(queryByText("test error")).toBeInTheDocument();
    });

    it("should display a success message", async () => {
	const { getByRole, queryByText } = render(<Register/>);

	setInputValue("Name", "Mr. Test");
	setInputValue("Username", "test");
	setInputValue("Email", "e@e.com");
	setInputValue("Password", "secret");
	setInputValue("Repeat Password", "secret");

	const checkbox = getByRole("checkbox");
	fireEvent.click(checkbox);

	fetchMock.mockOnce(JSON.stringify({ data: { message: "success!" } }))

	const submitButton = getByRole("button");
	await act(async () => fireEvent.click(submitButton));

	expect(queryByText("You have successfully registered!")).toBeInTheDocument();
    });
});
