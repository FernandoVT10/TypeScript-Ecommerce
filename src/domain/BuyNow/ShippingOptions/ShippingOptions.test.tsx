import React from "react";

import { render, fireEvent, act, screen } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import ShippingOptions from "./ShippingOptions";
import {mocked} from "ts-jest/utils";

jest.mock("@/services/ApiController");

const ADDRESSES_MOCK = [
    {
	_id: "id-1",
	fullName: "test full name 1",
	postalCode: "11111",
	phoneNumber: "111-111-1111",
	state: "test state 1",
	municipality: "test municipality 1",
	street: "test street 1",
	additionalInformation: "test additional information 1"
    },
    {
	_id: "id-2",
	fullName: "test full name 2",
	postalCode: "22222",
	phoneNumber: "222-222-2222",
	state: "test state 2",
	municipality: "test municipality 2",
	street: "test street 2",
	additionalInformation: "test additional information 2"
    }
];

const mockedAPIGet = mocked(ApiController.get);
const mockedAPIDelete = mocked(ApiController.delete);

describe("Domain BuyNow ShippingOptions Component", () => {
    beforeEach(async () => {
        mockedAPIGet.mockReset();
	mockedAPIGet.mockImplementation(() => Promise.resolve({
	    data: {
		addresses: ADDRESSES_MOCK
	    }
	}));

	mockedAPIDelete.mockReset();
	mockedAPIDelete.mockImplementation(() => Promise.resolve({}));
    });

    it("should call the api and renders the address card correctly", async () => {
	await act(async () => render(<ShippingOptions setAddressId={jest.fn()} />));

	expect(screen.queryByText("test state 1(11111), test municipality 1")).toBeInTheDocument();
	expect(screen.queryByText("test state 2(22222), test municipality 2")).toBeInTheDocument();

	expect(mockedAPIGet).toHaveBeenCalledWith("account/addresses/");
    });

    it("should call the api and delete an address card", async () => {
	await act(async () => render(<ShippingOptions setAddressId={jest.fn()} />));

	const deleteButtons = screen.getAllByText("Delete");
	fireEvent.click(deleteButtons[1]);

	const yesButton = screen.getByText("Yes");
	await act(() => fireEvent.click(yesButton));

	expect(screen.queryByText("test state 1(11111), test municipality 1")).toBeInTheDocument();
	expect(screen.queryByText("test state 2(22222), test municipality 2")).not.toBeInTheDocument();

	expect(mockedAPIDelete).toHaveBeenCalledWith("account/addresses/id-2");
    });

    it("should renders the AddAddress form when we click the button 'Add New Address'", async () => {
	await act(async () => render(<ShippingOptions setAddressId={jest.fn()} />));

	const yesButton = screen.getByText("Add New Address");
	fireEvent.click(yesButton);

	expect(screen.queryByText("test state 1(11111), test municipality 1")).not.toBeInTheDocument();
	expect(screen.queryByText("test state 2(22222), test municipality 2")).not.toBeInTheDocument();
	expect(screen.queryByText("Select an address")).not.toBeInTheDocument();
    });

    it("should renders the EditAddress form when we click the button 'Edit'", async () => {
	await act(async () => render(<ShippingOptions setAddressId={jest.fn()} />));

	const editButtons = screen.getAllByText("Edit");
	fireEvent.click(editButtons[1]);

	expect(screen.queryByText("test state 1(11111), test municipality 1")).not.toBeInTheDocument();
	expect(screen.queryByText("test state 2(22222), test municipality 2")).not.toBeInTheDocument();
	expect(screen.queryByText("Select an address")).not.toBeInTheDocument();
    });

    it("should call setAddressId", async () => {
	const setAddressIdMock = jest.fn();

	await act(async () => render(<ShippingOptions setAddressId={setAddressIdMock} />));

	const continueButton = screen.getByText("Continue");
	fireEvent.click(continueButton);

	expect(setAddressIdMock).toHaveBeenCalledWith("id-1");
    });
});
