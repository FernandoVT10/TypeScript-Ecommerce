import React, { useState } from "react";

import Input from "@/components/Formulary/Input";

import useInputHandling from "@/hooks/useInputHandling";

import ApiController from "@/services/ApiController";

import styles from "./AddressForm.module.scss";

const POSTAL_CODE_REGEX = /^([0-9]{5})([\-]{1}[0-9]{4})?$/;
const PHONE_NUMBER_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

interface APIResponse {
    error: string,
    message: string
}

function AddressForm() {
    const fullNameHandler = useInputHandling("");
    const postalCodeHandler = useInputHandling("");
    const stateHandler = useInputHandling("");
    const municipalityHandler = useInputHandling("");
    const suburbHandler = useInputHandling("");
    const streetHandler = useInputHandling("");
    const outdoorNumberHandler = useInputHandling("");
    const interiorNumberHandler = useInputHandling("W/0");
    const phoneNumberHandler = useInputHandling("");
    const additionalInformationHandler = useInputHandling("");

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const saveAddress = async (e: React.FormEvent) => {
	e.preventDefault();

	setErrorMessage("");

	if(!POSTAL_CODE_REGEX.test(postalCodeHandler.value)) {
	    return postalCodeHandler.setError("The postal code is invalid");
	}

	if(!PHONE_NUMBER_REGEX.test(phoneNumberHandler.value)) {
	    return phoneNumberHandler.setError("The phone number is invalid");
	}

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
    }

    if(loading) {
	return (
	    <div className={styles.loaderContainer}>
	    	<span className={`loader ${styles.loader}`}></span>
	    </div>
	);
    }

    return (
        <div className={styles.addressForm}>
	    <h3 className={styles.title}>Shipping Options</h3>

	    <form onSubmit={saveAddress}>
		<div className={styles.formContainer}>
		    <h3 className={styles.title}>Address</h3>

		    <div className={styles.input}>
			<Input
			type="text"
			id="input-full-name"
			name="full-name"
			label="Full Name"
			maxLength={200}
			value={fullNameHandler.value}
			setValue={fullNameHandler.setValue}/>
		    </div>

		    <div className={styles.input}>
			<Input
			type="text"
			id="input-postal-code"
			name="postal-code"
			label="Postal Code"
			value={postalCodeHandler.value}
			setValue={postalCodeHandler.setValue}
			errorMessage={postalCodeHandler.error}/>
		    </div>

		    <div className={styles.inputGroup}>
			<div className={styles.input}>
			    <Input
			    type="text"
			    id="input-state"
			    name="state"
			    label="State"
			    maxLength={200}
			    value={stateHandler.value}
			    setValue={stateHandler.setValue}/>
			</div>

			<div className={styles.input}>
			    <Input
			    type="text"
			    id="input-municipality"
			    name="municipality"
			    label="Municipality"
			    maxLength={200}
			    value={municipalityHandler.value}
			    setValue={municipalityHandler.setValue}/>
			</div>
		    </div>

		    <div className={styles.input}>
			<Input
			type="text"
			id="input-suburb"
			name="suburb"
			label="Suburb"
			maxLength={200}
			value={suburbHandler.value}
			setValue={suburbHandler.setValue}/>
		    </div>

		    <div className={styles.inputGroup}>
			<div className={styles.input}>
			    <Input
			    type="text"
			    id="input-street"
			    name="street"
			    label="Street"
			    maxLength={500}
			    value={streetHandler.value}
			    setValue={streetHandler.setValue}/>
			</div>

			<div className={styles.input}>
			    <Input
			    type="text"
			    id="input-outdoor-number"
			    name="outdoor-number"
			    label="Outdoor Number"
			    maxLength={6}
			    value={outdoorNumberHandler.value}
			    setValue={outdoorNumberHandler.setValue}/>
			</div>
		    </div>

		    <div className={styles.input}>
			<Input
			type="text"
			id="input-interior-number"
			name="interior-number"
			label="Interior Number (Optional)"
			maxLength={6}
			value={interiorNumberHandler.value}
			setValue={interiorNumberHandler.setValue}/>
		    </div>

		    <div className={styles.input}>
			<Input
			type="tel"
			id="input-phone-number"
			name="phone-number"
			label="Phone Number"
			value={phoneNumberHandler.value}
			setValue={phoneNumberHandler.setValue}
			errorMessage={phoneNumberHandler.error}/>
		    </div>

		    <div className={styles.textareaContainer}>
			<label className={styles.textareaLabel} htmlFor="textarea-additional-information">
			    Additional Information (Optional)
			</label>

			<textarea
			className={styles.textarea}
			id="textarea-additional-information"
			value={additionalInformationHandler.value}
			maxLength={1000}
			onChange={({ target: { value } }) => additionalInformationHandler.setValue(value)}></textarea>
		    </div>

		    { errorMessage.length > 0 &&
			<p className={styles.errorMessage}>{ errorMessage }</p>
		    }
		</div>

		<button className={styles.continueButton}>
		    Continue
		    <i className="fas fa-arrow-right" aria-hidden="true"></i>
		</button>
	    </form>
        </div>
    );
}

export default AddressForm;
