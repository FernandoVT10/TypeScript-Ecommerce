import React, { useState } from "react";

import RegisterForm from "./RegisterForm";

import ApiController from "@/services/ApiController";
import validate from "@/services/validate";

import useInputHandling from "@/hooks/useInputHandling";

import styles from "./Register.module.scss";

interface APIResponse {
    error: string,
    message: string,
    data: {
	message: string
    }
}

function Register() {
    const nameHandler = useInputHandling("");
    const usernameHandler = useInputHandling("");
    const emailHandler = useInputHandling("");
    const passwordHandler = useInputHandling("");
    const repeatPasswordHandler = useInputHandling("");
    const termsAndConditionsHandler = useInputHandling(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleForm = (e: React.FormEvent) => {
	e.preventDefault();

	if(!validate.email(emailHandler.value)) {
	    emailHandler.setError("The email is invalid");
	    return;
	}

	if(passwordHandler.value.length < 4) {
	    passwordHandler.setError("The password must contain 4 or more characters");
	    return;
	}

	if(repeatPasswordHandler.value !== passwordHandler.value) {
	    repeatPasswordHandler.setError("The passwords doesn't match");
	    return;
	}

	if(!termsAndConditionsHandler.value) {
	    termsAndConditionsHandler.setError("You must accept the terms and conditions");
	    return;
	}

	setLoading(true);

	ApiController.post<APIResponse>("account/register/", {
	    body: {
		name: nameHandler.value,
		username: usernameHandler.value,
		email: emailHandler.value,
		password: passwordHandler.value
	    }
	}).then(res => {
	    setLoading(false);

	    if(res.error === "Validation Error") {
		if(res.message === "The username already exists") {
		    usernameHandler.setError(res.message);
		    return;
		}

		emailHandler.setError(res.message);
		return;
	    }

	    if(res.data.message) {
		setSuccess(true);
	    }
	});
    }

    if(success) {
	return (
	    <div className={styles.register}>
		<div className={styles.successMessage}>
		    <h3 className={styles.title}>You have successfully registered!</h3>

		    <p className={styles.message}>
			We have sent a verification email.
		    </p>
		</div>
	    </div>
	);
    }

    return (
        <div className={styles.register}>
	    <RegisterForm
	    handleForm={handleForm}
	    nameHandler={nameHandler}
	    usernameHandler={usernameHandler}
	    emailHandler={emailHandler}
	    passwordHandler={passwordHandler}
	    repeatPasswordHandler={repeatPasswordHandler}
	    termsAndConditionsHandler={termsAndConditionsHandler}
	    loading={loading}/>
	</div>
    );
}

export default Register;
