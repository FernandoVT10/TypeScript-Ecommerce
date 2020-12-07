import React from "react";

import { render, fireEvent } from "@testing-library/react";

import AddressCard from "./AddressCard";

const ADDRESS_MOCK = {
    _id: "testid",
    fullName: "test full name",
    postalCode: "03492",
    phoneNumber: "234-842-4324",
    state: "test state",
    municipality: "test municipality",
    street: "test street",
    additionalInformation: "test additional information"
}

const ADDRESS_CARD_PROPS = {
    address: ADDRESS_MOCK,
    deleteAddress: jest.fn(),
    editAddress: jest.fn(),
    handleOnClick: jest.fn(),
    isSelected: false
}

describe("Domain BuyNow ShippingOptions AddressCard Form", () => {
    it("should renders correctly", () => {
	const { queryByText } = render(<AddressCard {...ADDRESS_CARD_PROPS}/>);

	expect(queryByText("test street")).toBeInTheDocument();
	expect(queryByText("test additional information")).toBeInTheDocument();
	expect(queryByText("test state(03492), test municipality")).toBeInTheDocument();
	expect(queryByText("test full name - test phone number"));
    });

    it("should call editAddress when we click the edit button", () => {
	const editAddressMock = jest.fn();

	const addressCardProps = {
	    ...ADDRESS_CARD_PROPS,
	    editAddress: editAddressMock
	}

	const { getByText } = render(<AddressCard {...addressCardProps }/>);

	const editButton = getByText("Edit");
	fireEvent.click(editButton);

	expect(editAddressMock).toHaveBeenCalled();
    });

    it("should call deleteAddress when we click the 'Yes' button", () => {
	const deleteAddressMock = jest.fn();

	const addressCardProps = {
	    ...ADDRESS_CARD_PROPS,
	    deleteAddress: deleteAddressMock
	}

	const { getByText } = render(<AddressCard {...addressCardProps }/>);

	const deleteButton = getByText("Delete");
	fireEvent.click(deleteButton);

	const yesButton = getByText("Yes");
	fireEvent.click(yesButton);

	expect(deleteAddressMock).toHaveBeenCalled();
    });

    it("should call handleOnClick when we click the card", () => {
	const handleOnClickMock = jest.fn();

	const addressCardProps = {
	    ...ADDRESS_CARD_PROPS,
	    handleOnClick: handleOnClickMock
	}

	const { container } = render(<AddressCard {...addressCardProps }/>);

	fireEvent.click(container.children[0]);

	expect(handleOnClickMock).toHaveBeenCalled();
    });
});
