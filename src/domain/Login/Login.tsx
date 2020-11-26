import React, { useState } from "react";
import { useRouter } from "next/router";

import ActivationMessage from "./ActivationMessage";

import Input from "@/components/Formulary/Input";

import ApiController from "@/services/ApiController";

import styles from "./Login.module.scss";

interface APIResponse {
    error: string,
    message: string,
    data: {
	token: string
    }
}

function Login({ activationStatus }: { activationStatus: string }) {
    const [usernameOrEmail, setUsernameOrEmail] = useState("")
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleForm = (e: React.FormEvent) => {
	e.preventDefault();

	setLoading(true);

	ApiController.post<APIResponse>("account/login", {
	    body: {
		usernameOrEmail: usernameOrEmail,
		password: password
	    }
	}).then(res => {
	    setLoading(false);

	    if(res.error) {
		setErrorMessage(res.message);
		return;
	    }

	    window.localStorage.setItem("token", res.data.token);

	    router.push("/dashboard/");
	});
    }

    return (
	<div className={styles.login}>
	    <ActivationMessage activationStatus={activationStatus}/>
	    
	    <div className={styles.loginForm}>
		<form onSubmit={handleForm}>
		    <h3 className={styles.title}>Login</h3>

		    <div className={styles.input}>
			<Input
			type="text"
			id="username-email-input"
			name="username-email"
			label="Username or Email"
			value={usernameOrEmail}
			setValue={setUsernameOrEmail}/>
		    </div>

		    <div className={styles.input}>
			<Input
			type="password"
			id="password-input"
			name="password"
			label="Password"
			value={password}
			setValue={setPassword}/>
		    </div>

		    { errorMessage.length > 0 &&
			<p className={styles.errorMessage}>
			    { errorMessage }
			</p>
		    }

		    { loading ?
			<div className={styles.loaderContainer}>
			    <span className={`loader ${styles.loader}`}></span>
			</div>
		    :
			<button type="submit" className={`submit-button ${styles.submitButton}`}>
			    Login
			</button>
		    }
		</form>
	    </div>
	</div>
    );
}
export default Login;
