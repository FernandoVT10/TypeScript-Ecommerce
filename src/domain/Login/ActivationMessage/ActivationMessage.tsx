import React from "react";

import styles from "./ActivationMessage.module.scss";

function ActivationMessage({ activationStatus }: { activationStatus: string }) {
    if(activationStatus === "success") {
	return (
	    <div className={`${styles.message} ${styles.success}`}>
		Your account has been activated successfully. Now you can login.
	    </div>
	);
    }

    if(activationStatus === "error") {
	return (
	    <div className={`${styles.message} ${styles.error}`}>
		The activation token don't exists
	    </div>
	);
    }

    return null;
}
export default ActivationMessage;
