import React from "react";

import { fireEvent, render } from "@testing-library/react";

import AddressForm from "./AddressForm";

const useInputHandlingMock = (initialValue = "", initialError = "") => ({
    value: initialValue,
    setValue: jest.fn(),
    error: initialError,
    setError: jest.fn()
});

const renderAddressForm = (customProps = {}) => {
    const props = {
	fullNameHandler: useInputHandlingMock(),
	postalCodeHandler: useInputHandlingMock(),
	stateHandler: useInputHandlingMock(),
	municipalityHandler: useInputHandlingMock(),
	suburbHandler: useInputHandlingMock(),
	streetHandler: useInputHandlingMock(),
	outdoorNumberHandler: useInputHandlingMock(),
	interiorNumberHandler: useInputHandlingMock(),
	phoneNumberHandler: useInputHandlingMock(),
	additionalInformationHandler: useInputHandlingMock(),
	setIsEditing: jest.fn(),
	loading: false,
	errorMessage: "",
	handleOnSubmit: jest.fn(),
	...customProps
    }

    return render(<AddressForm {...props}/>);
}

interface IUseInputHandlingMock {
    value: string,
    setValue: jest.Mock,
    error: string,
    setError: jest.Mock
}

describe("Domain BuyNow ShippingOptions AddressForm Component", () => {
    it("checks if the input handling works fine", () => {
	const inputNames = [
	    "fullNameHandler", "postalCodeHandler", "stateHandler",
	    "municipalityHandler", "suburbHandler", "streetHandler",
	    "outdoorNumberHandler", "interiorNumberHandler", "phoneNumberHandler",
	    "additionalInformationHandler"
	];

	const inputHandlers = {};

	inputNames.forEach(inputName => {
	    inputHandlers[inputName] = useInputHandlingMock(inputName);
	});
	
	const { getByDisplayValue } = renderAddressForm(inputHandlers);

	inputNames.forEach((inputName, index) => {
	    const input = getByDisplayValue(inputName);
	    fireEvent.change(input, { target: { value: `test ${index}` } });
	    expect(inputHandlers[inputName].setValue).toHaveBeenCalledWith(`test ${index}`);
	});
    });

    it("should call setIsEditing with false when we click the close button", () => {
	const setIsEditingMock = jest.fn();

	const { getByTestId } = renderAddressForm({ setIsEditing: setIsEditingMock });

	const closeButton = getByTestId("address-form-close-button");
	fireEvent.click(closeButton);

	expect(setIsEditingMock).toHaveBeenCalledWith(false);
    });

    it("should display an error message", () => {
	const { queryByText } = renderAddressForm({ errorMessage: "error message" });
	expect(queryByText("error message")).toBeInTheDocument();
    });

    it("should call postalCodeHandler.setError when the postal code is invalid", () => {
	const postalCodeHandler = useInputHandlingMock("test");
	const { queryByText } = renderAddressForm({ postalCodeHandler });

	fireEvent.click(queryByText("Continue"));
	expect(postalCodeHandler.setError).toHaveBeenCalledWith("The postal code is invalid");
    });

    it("should call phoneNumberHandler.setError when the phone number is invalid", () => {
	const postalCodeHandler = useInputHandlingMock("12345");
	const phoneNumberHandler = useInputHandlingMock("test");
	const { queryByText } = renderAddressForm({ postalCodeHandler, phoneNumberHandler });

	fireEvent.click(queryByText("Continue"));
	expect(phoneNumberHandler.setError).toHaveBeenCalledWith("The phone number is invalid");
    });

    it("should call handleOnSubmit", () => {
	const postalCodeHandler = useInputHandlingMock("12345");
	const phoneNumberHandler = useInputHandlingMock("234-234-3412");
	const handleOnSubmitMock = jest.fn();

	const { queryByText } = renderAddressForm({
	    postalCodeHandler,
	    phoneNumberHandler,
	    handleOnSubmit: handleOnSubmitMock
	});

	fireEvent.click(queryByText("Continue"));
	expect(handleOnSubmitMock).toHaveBeenCalled();
    });
});
