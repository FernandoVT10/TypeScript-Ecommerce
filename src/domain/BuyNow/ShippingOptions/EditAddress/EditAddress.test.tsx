import React from "react";
import { mocked } from "ts-jest/utils";

import { fireEvent, render, screen, act } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import EditAddress from "./EditAddress";

jest.mock("@/services/ApiController");

const mockedAPIPut = mocked(ApiController.put);

const changeInputValue = (labelName: string, value: string) => {
    const input = screen.getByLabelText(labelName);
    fireEvent.change(input, { target: { value } });
}

const ADDRESS_MOCK = {
    _id: "testid",
    fullName: "test full name",
    postalCode: "01010",
    state: "test state",
    municipality: "test municipality",
    suburb: "test suburb",
    street: "test street",
    outdoorNumber: "49",
    interiorNumber: "12",
    additionalInformation: "test additional information",
    phoneNumber: "294-239-2123"
}

describe("Domain BuyNow ShippingOptions EditAddress Component", () => {
    beforeEach(() => {
        mockedAPIPut.mockReset();
	mockedAPIPut.mockImplementation(() => Promise.resolve({
	    data: {
		updatedAddress: {
		    _id: "testid",
		    value: "updated"
		}
	    }
	}));
    });

    it("should set the inputs default value", () => {
	const { queryByDisplayValue } = render(
	    <EditAddress address={ADDRESS_MOCK} setIsEditing={jest.fn()} setAddresses={jest.fn()}/>
	);

	Object.values(ADDRESS_MOCK).forEach(value => {
	    if(value === "testid") return;

	    expect(queryByDisplayValue(value)).toBeInTheDocument();
	});
    });

    it("should call the api correctly", async () => {
	const { getByText } = render(
	    <EditAddress address={ADDRESS_MOCK} setIsEditing={jest.fn()} setAddresses={jest.fn()}/>
	);

	changeInputValue("Full Name", "updated full name");
	changeInputValue("Street", "updated street");

	const submitButton = getByText("Continue");
	await act(async () => fireEvent.click(submitButton));

	const bodyMock = {
	    ...ADDRESS_MOCK,
	    fullName: "updated full name",
	    street: "updated street"
	}

	delete bodyMock._id;

	expect(mockedAPIPut).toHaveBeenCalledWith("account/addresses/testid", {
	    body: bodyMock
	});
    });

    it("should call setAddresses and setIsEditing", async () => {
	const setIsEditingMock = jest.fn();
	const setAddressesMock = jest.fn();

	const { getByText } = render(
	    <EditAddress address={ADDRESS_MOCK} setIsEditing={setIsEditingMock} setAddresses={setAddressesMock}/>
	);

	const submitButton = getByText("Continue");
	await act(async () => fireEvent.click(submitButton));

	expect(setIsEditingMock).toHaveBeenCalledWith(false);

	const setAddressesFunction = setAddressesMock.mock.calls[0][0];
	const setAddressRes = setAddressesFunction([{
	    _id: "testid",
	    value: "test"
	}]);

	expect(setAddressRes).toEqual([{
	    _id: "testid",
	    value: "updated"
	}]);
    });

    it("should display an error when the api return an error", async () => {
	mockedAPIPut.mockImplementation(() => Promise.resolve({
	    error: "error",
	    message: "this is an error message"
	}));

	const { getByText, queryByText } = render(
	    <EditAddress address={ADDRESS_MOCK} setIsEditing={jest.fn()} setAddresses={jest.fn()}/>
	);

	const submitButton = getByText("Continue");
	await act(async () => fireEvent.click(submitButton));

	expect(queryByText("this is an error message")).toBeInTheDocument();
    });
});
