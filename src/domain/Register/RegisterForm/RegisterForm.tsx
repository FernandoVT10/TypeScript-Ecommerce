import React from "react";

import Input from "@/components/Formulary/Input";
import Checkbox from "@/components/Formulary/Checkbox";

import { InputHadnlingResponse } from "@/hooks/useInputHandling";

import styles from "./RegisterForm.module.scss";

interface RegisterFormProps {
    handleForm: (e: React.FormEvent) => void,
    nameHandler: InputHadnlingResponse<string>,
    usernameHandler: InputHadnlingResponse<string>,
    emailHandler: InputHadnlingResponse<string>,
    passwordHandler: InputHadnlingResponse<string>,
    repeatPasswordHandler: InputHadnlingResponse<string>,
    termsAndConditionsHandler: InputHadnlingResponse<boolean>,
    loading: boolean
}

function RegisterForm({
    handleForm,
    nameHandler,
    usernameHandler,
    emailHandler,
    passwordHandler,
    repeatPasswordHandler,
    termsAndConditionsHandler,
    loading
}: RegisterFormProps) {
    return (
	<div className={styles.registerForm}>
	    <form onSubmit={handleForm}>
		<h3 className={styles.title}>Register</h3>

		<div className={styles.input}>
		    <Input
		    type="text"
		    id="name-input"
		    name="name"
		    label="Name"
		    value={nameHandler.value}
		    maxLength={200}
		    setValue={nameHandler.setValue}/>
		</div>

		<div className={styles.input}>
		    <Input
		    type="text"
		    id="username-input"
		    name="username"
		    label="Username"
		    value={usernameHandler.value}
		    maxLength={30}
		    setValue={usernameHandler.setValue}
		    errorMessage={usernameHandler.error}/>
		</div>

		<div className={styles.input}>
		    <Input
		    type="text"
		    id="email-input"
		    name="email"
		    label="Email"
		    value={emailHandler.value}
		    setValue={emailHandler.setValue}
		    errorMessage={emailHandler.error}/>
		</div>

		<div className={styles.input}>
		    <Input
		    type="password"
		    id="password-input"
		    name="password"
		    label="Password"
		    value={passwordHandler.value}
		    setValue={passwordHandler.setValue}
		    errorMessage={passwordHandler.error}/>
		</div>

		<div className={styles.input}>
		    <Input
		    type="password"
		    id="repeat-password-input"
		    name="repeat-password"
		    label="Repeat Password"
		    value={repeatPasswordHandler.value}
		    setValue={repeatPasswordHandler.setValue}
		    errorMessage={repeatPasswordHandler.error}/>
		</div>

		<Checkbox
		id="terms-and-conditions"
		name="ternms-and-conditions"
		checked={termsAndConditionsHandler.value}
		setChecked={termsAndConditionsHandler.setValue}
		errorMessage={termsAndConditionsHandler.error}>
		    <span>
			I accept the <a href="#" className={styles.termsAndConditionsLink}>Terms and Conditions</a>
		    </span>
		</Checkbox>

		{ loading ?
		    <div className={styles.loaderContainer} data-testid="register-form-loader">
			<span className={`loader ${styles.loader}`}></span>
		    </div>
		:
		    <button type="submit" className={`submit-button ${styles.submitButton}`}>
			Register
		    </button>
		}
	    </form>
	</div>
    );
}
export default RegisterForm;
