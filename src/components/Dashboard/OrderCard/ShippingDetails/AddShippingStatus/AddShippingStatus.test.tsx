import React from "react";

import { render, fireEvent, act } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import ApiController from "@/services/ApiController";

import AddShippingStatus from "./AddShippingStatus";

jest.mock("@/services/ApiController");

const mockedAPIPost = mocked(ApiController.post);

describe("@/components/dashboard/OrderCard/ShippingDetails/AddShippingStatus", () => {
    beforeEach(() => {
        mockedAPIPost.mockReset();
    });

    it("should renders correctly", () => {
	const { queryByText } = render(<AddShippingStatus orderId="testid" setHistory={jest.fn()}/>);

	expect(queryByText("Add New Status")).toBeInTheDocument();
    });

    it("should display the form when we click on 'Add New Status' button", () => {
	const { queryByText, getByText } = render(<AddShippingStatus orderId="testid" setHistory={jest.fn()}/>);

	fireEvent.click(getByText("Add New Status"));

	expect(queryByText("Add New Status")).not.toBeInTheDocument();
	expect(queryByText("Add Status")).toBeInTheDocument();
    });

    it("should call the api, call setHistory and deactivate the form correctly", async () => {
	const setHistoryMock = jest.fn();

	const { getByText, queryByText, getByLabelText } = render(
	    <AddShippingStatus orderId="testid" setHistory={setHistoryMock}/>
	);

	fireEvent.click(getByText("Add New Status"));

	const input = getByLabelText("New Status");
	fireEvent.change(input, { target: { value: "test status" } });

	mockedAPIPost.mockImplementation(() => Promise.resolve({}));

	await act(async () => fireEvent.click(getByText("Add Status")));

	expect(mockedAPIPost).toHaveBeenCalledWith("orders/testid/shipping/addStatus", {
	    body: { status: "test status" }
	});

	const setHistoryFunction = setHistoryMock.mock.calls[0][0];
	expect(setHistoryFunction([])).toEqual([
	    {
		content: "test status",
		createdAt: expect.any(String)
	    }
	]);

	expect(queryByText("Add New Status")).toBeInTheDocument();
    });

    it("should show an error when the api return an error", async () => {
	const { getByText, queryByText, getByLabelText } = render(
	    <AddShippingStatus orderId="testid" setHistory={jest.fn()}/>
	);

	fireEvent.click(getByText("Add New Status"));

	const input = getByLabelText("New Status");
	fireEvent.change(input, { target: { value: "test status" } });

	mockedAPIPost.mockImplementation(() => Promise.resolve({
	    error: "error",
	    message: "error message"
	}));

	await act(async () => fireEvent.click(getByText("Add Status")));

	expect(queryByText("error message")).toBeInTheDocument();
    });
});
