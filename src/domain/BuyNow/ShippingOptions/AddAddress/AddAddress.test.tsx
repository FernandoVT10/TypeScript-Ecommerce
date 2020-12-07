import React from "react";
import { mocked } from "ts-jest/utils";

import { fireEvent, render, screen, act } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import AddAddress from "./AddAddress";

jest.mock("@/services/ApiController");

const mockedAPIPost = mocked(ApiController.post);

const changeInputValue = (labelName: string, value: string) => {
    const input = screen.getByLabelText(labelName);
    fireEvent.change(input, { target: { value } });
}

const setInputsValue = () => {
    changeInputValue("Full Name", "test full name");
    changeInputValue("Postal Code", "01010");
    changeInputValue("State", "test state");
    changeInputValue("Municipality", "test municipality");
    changeInputValue("Suburb", "test suburb");
    changeInputValue("Street", "test street");
    changeInputValue("Outdoor Number", "49");
    changeInputValue("Interior Number (Optional)", "12");
    changeInputValue("Additional Information (Optional)", "test additional information");
    changeInputValue("Phone Number", "294-239-2123");
}

describe("Domain BuyNow ShippingOptions AddAddress Component", () => {
    beforeEach(() => {
	mockedAPIPost.mockReset();

	mockedAPIPost.mockImplementation(() => Promise.resolve({
	    data: { createdAddress: "test" }
	}));
    });

    it("should call the api correctly", async () => {
	const { getByText } = render(
	    <AddAddress setIsEditing={jest.fn()} setAddresses={jest.fn()}/>
	);

	setInputsValue();

	const submitButton = getByText("Continue");
	await act(async () => fireEvent.click(submitButton));

	expect(mockedAPIPost).toHaveBeenCalledWith("account/addresses/", {
	    body: {
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
	});
    });

    it("should call setAddresses and setIsEditing when the api doesn't return errors", async () => {
	const setIsEditingMock = jest.fn();
	const setAddressesMock = jest.fn();

	const { getByText } = render(
	    <AddAddress setIsEditing={setIsEditingMock} setAddresses={setAddressesMock}/>
	);

	setInputsValue();

	const submitButton = getByText("Continue");
	await act(async () => fireEvent.click(submitButton));

	expect(setIsEditingMock).toHaveBeenCalledWith(false);

	const setAddressesFunction = setAddressesMock.mock.calls[0][0];
	const setAddressRes = setAddressesFunction(["address 1"]);

	expect(setAddressRes).toEqual(["address 1", "test"]);
    });

    it("should display an error when the api return an error", async () => {
	mockedAPIPost.mockImplementation(() => Promise.resolve({
	    error: "error",
	    message: "this is an error message"
	}));

	const { getByText, queryByText } = render(
	    <AddAddress setIsEditing={jest.fn()} setAddresses={jest.fn()}/>
	);

	setInputsValue();

	const submitButton = getByText("Continue");
	await act(async () => fireEvent.click(submitButton));

	expect(queryByText("this is an error message")).toBeInTheDocument();
    });
});
