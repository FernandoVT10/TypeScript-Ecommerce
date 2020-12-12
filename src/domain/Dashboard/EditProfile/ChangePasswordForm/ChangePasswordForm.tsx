import React, { useState } from "react";

import Input from "@/components/Formulary/Input";

import useInputHandling from "@/hooks/useInputHandling";

import ApiController from "@/services/ApiController";

import styles from "../EditProfile.module.scss";

interface APIResponse {
    error: string,
    message: string,
    data: {
	message: string
    }
}

const ChangePasswordForm = () => {
    const currentPasswordHandler = useInputHandling("");
    const newPasswordHandler = useInputHandling("");
    const repeatPasswordHandler = useInputHandling("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const handleForm = async (e: React.FormEvent) => {
	e.preventDefault();

	setErrorMessage("");
	setSuccessMessage("");

	if(currentPasswordHandler.value.length < 4) {
	    return currentPasswordHandler.setError("The password is incorrect");
	}

	if(newPasswordHandler.value.length < 4) {
	    return newPasswordHandler.setError("The password must contain 4 or more characters");
	}

	if(repeatPasswordHandler.value !== newPasswordHandler.value) {
	    return repeatPasswordHandler.setError("The passwords doesn't match");
	}

	setLoading(true);

	const res = await ApiController.put<APIResponse>("account/changePassword", {
	    body: {
		currentPassword: currentPasswordHandler.value,
		newPassword: newPasswordHandler.value
	    }
	});

	setLoading(false);

	if(res.error) {
	    return setErrorMessage(res.message);
	}

	currentPasswordHandler.setValue("");
	newPasswordHandler.setValue("");
	repeatPasswordHandler.setValue("");

	setSuccessMessage(res.data.message);
    }

    return (
	<div className={styles.form}>
	    <form onSubmit={handleForm}>
		<div className={styles.input}>
		    <Input
		    type="password"
		    id="current-password-input"
		    name="currentPassword"
		    label="Current Password"
		    value={currentPasswordHandler.value}
		    setValue={currentPasswordHandler.setValue}
		    errorMessage={currentPasswordHandler.error}/>
		</div>

		<div className={styles.input}>
		    <Input
		    type="password"
		    id="new-password-input"
		    name="newPassword"
		    label="New Password"
		    value={newPasswordHandler.value}
		    setValue={newPasswordHandler.setValue}
		    errorMessage={newPasswordHandler.error}/>
		</div>

		<div className={styles.input}>
		    <Input
		    type="password"
		    id="repeat-password-input"
		    name="repeatPassword"
		    label="Repeat Password"
		    value={repeatPasswordHandler.value}
		    setValue={repeatPasswordHandler.setValue}
		    errorMessage={repeatPasswordHandler.error}/>
		</div>

		{ errorMessage.length > 0 &&
		    <p className={`${styles.message} ${styles.error}`}>
			<i className="fas fa-times" aria-hidden="true"></i>
			{ errorMessage }
		    </p>
		}

		{ successMessage.length > 0 &&
		    <p className={`${styles.message} ${styles.success}`}>
			<i className="fas fa-check" aria-hidden="true"></i>
			{ successMessage }
		    </p>
		}

		{ !loading ?
		    <button className={`submit-button secondary ${styles.submitButton}`}>
			Change Password
		    </button>
		:
		    <span className={`loader ${styles.loader}`}></span>
		}
	    </form>
	</div>
    );
}

export default ChangePasswordForm;
