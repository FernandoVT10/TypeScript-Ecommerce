import React, {useState} from "react";

import useInputHandling from "@/hooks/useInputHandling";

import ApiController from "@/services/ApiController";

import { Address } from "../ShippingOptions";
import AddressForm from "../AddressForm";

import styles from "./EditAddress.module.scss";

interface EditAddressProps {
    setIsEditing: React.Dispatch<boolean>,
    setAddresses: React.Dispatch<React.SetStateAction<Address[]>>,
    address: Address
}

interface APIResponse {
    error: string,
    msessage: string,
    data: {
	updatedAddress: Address
    }
}

function EditAddress({ address, setIsEditing, setAddresses }: EditAddressProps) {
    const fullNameHandler = useInputHandling(address.fullName);
    const postalCodeHandler = useInputHandling(address.postalCode);
    const stateHandler = useInputHandling(address.state);
    const municipalityHandler = useInputHandling(address.municipality);
    const suburbHandler = useInputHandling(address.suburb);
    const streetHandler = useInputHandling(address.street);
    const outdoorNumberHandler = useInputHandling(address.outdoorNumber);
    const interiorNumberHandler = useInputHandling(address.interiorNumber);
    const phoneNumberHandler = useInputHandling(address.phoneNumber);
    const additionalInformationHandler = useInputHandling(address.additionalInformation);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleOnSubmit = async () => {
	setErrorMessage("");
	setLoading(true);

	const res = await ApiController.put<APIResponse>(`account/addresses/${address._id}`, {
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
	    return setErrorMessage(res.msessage);
	}

	setAddresses(addresses => addresses.map(localAddress => {
	    if(address._id === localAddress._id) {
		return res.data.updatedAddress;
	    }

	    return localAddress;
	}));

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
export default EditAddress;
