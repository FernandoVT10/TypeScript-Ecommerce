import React, { useState } from "react";

import useInputHandling from "@/hooks/useInputHandling";

import ApiController from "@/services/ApiController";

import AddressForm from "../AddressForm";
import { Address } from "../ShippingOptions";

interface AddAddressProps {
    setIsEditing: React.Dispatch<boolean>,
    setAddresses: React.Dispatch<React.SetStateAction<Address[]>>
}

interface APIResponse {
    error: string,
    message: string,
    data: {
	createdAddress: Address
    }
}

function AddAddress({ setIsEditing, setAddresses }: AddAddressProps) {
    const fullNameHandler = useInputHandling("");
    const postalCodeHandler = useInputHandling("");
    const stateHandler = useInputHandling("");
    const municipalityHandler = useInputHandling("");
    const suburbHandler = useInputHandling("");
    const streetHandler = useInputHandling("");
    const outdoorNumberHandler = useInputHandling("");
    const interiorNumberHandler = useInputHandling("W/O");
    const phoneNumberHandler = useInputHandling("");
    const additionalInformationHandler = useInputHandling("");

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOnSubmit = async () => {
	setErrorMessage("");

	setLoading(true);

	const res = await ApiController.post<APIResponse>("account/addresses/", {
	    body: {
		fullName: fullNameHandler.value,
		postalCode: postalCodeHandler.value,
		state: stateHandler.value,
		municipality: municipalityHandler.value,
		suburb: suburbHandler.value,
		street: streetHandler.value,
		outdoorNumber: outdoorNumberHandler.value,
		interiorNumber: interiorNumberHandler.value,
		additionalInformation: additionalInformationHandler.value,
		phoneNumber: phoneNumberHandler.value
	    }
	});

	setLoading(false);

	if(res.error) {
	    return setErrorMessage(res.message);
	}

	setAddresses(prevAddresses => [...prevAddresses, res.data.createdAddress]);
	setIsEditing(false);
    }
    return (
	<AddressForm
	fullNameHandler={fullNameHandler}
	postalCodeHandler={postalCodeHandler}
	stateHandler={stateHandler}
	municipalityHandler={municipalityHandler}
	suburbHandler={suburbHandler}
	streetHandler={streetHandler}
	outdoorNumberHandler={outdoorNumberHandler}
	interiorNumberHandler={interiorNumberHandler}
	phoneNumberHandler={phoneNumberHandler}
	additionalInformationHandler={additionalInformationHandler}
	setIsEditing={setIsEditing}
	loading={loading}
	errorMessage={errorMessage}
	handleOnSubmit={handleOnSubmit}/>
    );
}
export default AddAddress;
