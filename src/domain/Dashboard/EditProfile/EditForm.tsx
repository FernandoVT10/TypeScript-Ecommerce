import React, { useState, useContext } from "react";

import Input from "@/components/Formulary/Input";

import UserContext from "@/contexts/UserContext";

import useInputHandling from "@/hooks/useInputHandling";

import ApiController from "@/services/ApiController";
import validate from "@/services/validate";

import styles from "./EditProfile.module.scss";

interface APIResponse {
    error: string,
    message: string,
    data: {
	message: string
    }
}

const EditForm = () => {
    const user = useContext(UserContext);

    const nameHandler = useInputHandling(user.name);
    const usernameHandler = useInputHandling(user.username);
    const emailHandler = useInputHandling(user.email);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const handleForm = async (e: React.FormEvent) => {
	e.preventDefault();

	setErrorMessage("");
	setSuccessMessage("");

	if(!validate.email(emailHandler.value)) {
	    return setErrorMessage("The email is invalid.");
	}

	setLoading(true);

	const res = await ApiController.put<APIResponse>("account/edit", {
	    body: {
		name: nameHandler.value,
		username: usernameHandler.value,
		email: emailHandler.value
	    }
	});

	setLoading(false);

	if(res.error) {
	    return setErrorMessage(res.message);
	}

	setSuccessMessage(res.data.message);
    }

    return (
	<div className={styles.form}>
	    <form onSubmit={handleForm}>
		<div className={styles.input}>
		    <Input
		    type="text"
		    id="name-input"
		    name="name"
		    label="Name"
		    value={nameHandler.value}
		    setValue={nameHandler.setValue}/>
		</div>

		<div className={styles.input}>
		    <Input
		    type="text"
		    id="username-input"
		    name="username"
		    label="Username"
		    value={usernameHandler.value}
		    setValue={usernameHandler.setValue}/>
		</div>

		<div className={styles.input}>
		    <Input
		    type="text"
		    id="email-input"
		    name="email"
		    label="Email"
		    value={emailHandler.value}
		    setValue={emailHandler.setValue}/>
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
			Save Changes
		    </button>
		:
		    <span className={`loader ${styles.loader}`}></span>
		}
	    </form>
	</div>
    );
}

export default EditForm;
