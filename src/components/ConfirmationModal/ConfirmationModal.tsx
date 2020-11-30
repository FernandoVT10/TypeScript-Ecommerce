import React, { useEffect } from "react";

import styles from "./ConfimationModal.module.scss";

interface ConfimationModalProps {
    message: string,
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>,
    onConfirm: () => void
}

function ConfimationModal({ message, isActive, setIsActive, onConfirm }: ConfimationModalProps) {
    const handleOnClick = () => {
	setIsActive(false);
	onConfirm();
    }

    useEffect(() => {
	if(isActive) {
	    document.body.style.overflow = "hidden";
	} else {
	    document.body.style.overflow = "auto";
	}
    }, [isActive]);

    if(!isActive) return null;

    return (
	<div className={styles.confirmationModal}>
	    <div className={styles.modal}>
		<p className={styles.message}>{ message }</p>

		<div className={styles.buttons}>
		    <button
		    className={styles.noButton}
		    onClick={() => setIsActive(false)}>
			No
		    </button>

		    <button
		    className={styles.yesButton}
		    onClick={handleOnClick}>
			Yes
		    </button>
		</div>
	    </div>
	</div>
    );
}

export default ConfimationModal;
