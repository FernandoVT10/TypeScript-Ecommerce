import React from "react";

import { fireEvent, render, screen, act } from "@testing-library/react";

import Login from "./Login";

const setInputValue = (inputLabel: string, value: string) => {
    const input = screen.getByLabelText(inputLabel);
    fireEvent.change(input, { target: { value } });
}

describe("Domain Login Component", () => {
    beforeEach(() => {
	fetchMock.resetMocks();
    });

    it("should renders correctly", () => {
	const { queryByText } = render(<Login activationStatus="error"/>);

	expect(queryByText("The activation token don't exists.")).toBeInTheDocument();
    });

    it("should send the data to the api correctly", async () => {
	const { getByRole } = render(<Login activationStatus=""/>);

	setInputValue("Username or Email", "test777");
	setInputValue("Password", "secret");

	fetchMock.mockOnce(JSON.stringify({ error: "test error", message: "error message" }));

	const submitButton = getByRole("button");
	await act(async () => fireEvent.click(submitButton));

	const fetchCall = fetchMock.mock.calls[0];

	expect(fetchCall[0]).toMatch("account/login");

	expect(fetchCall[1].body).toBe(JSON.stringify({
	    usernameOrEmail: "test777",
	    password: "secret"
	}));
    });

    it("should display an error correctly", async () => {
	const { getByRole, queryByText } = render(<Login activationStatus=""/>);

	setInputValue("Username or Email", "test777");
	setInputValue("Password", "secret");

	fetchMock.mockOnce(JSON.stringify({ error: "test error", message: "error message" }));

	const submitButton = getByRole("button");
	await act(async () => fireEvent.click(submitButton));

	expect(queryByText("error message")).toBeInTheDocument();
    });

    it("should redirect to /dashboard/ when login is successful", async () => {
	const routerPushMock = jest.fn();

	changeRouterProperties({
	    push: routerPushMock
	});

	const { getByRole } = render(<Login activationStatus=""/>);

	setInputValue("Username or Email", "test777");
	setInputValue("Password", "secret");

	fetchMock.mockOnce(JSON.stringify({}));

	const submitButton = getByRole("button");
	await act(async () => fireEvent.click(submitButton));

	expect(routerPushMock).toHaveBeenCalledWith("/dashboard/");
    });
});
