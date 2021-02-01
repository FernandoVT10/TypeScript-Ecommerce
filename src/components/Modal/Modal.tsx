import React, { useEffect } from "react";

import styles from "./Modal.module.scss";

interface ModalProps {
    children: JSX.Element,
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>
}

const Modal = ({ children, isActive, setIsActive }: ModalProps) => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Escape") {
            setIsActive(false);
        }
    }

    useEffect(() => {
    	if(isActive) {
	    document.body.style.overflow = "hidden";
	} else {
	    document.body.style.overflow = "auto";
	}


        document.addEventListener("keydown", handleKeyDown);
    }, [isActive]);
    
    if(!isActive) return null;

    return (
	<div className={styles.modalContainer}>
	    <div className={styles.modal}>
		{ children }

		<button
		className={styles.closeButton}
		data-testid="close-modal-button"
		onClick={() => setIsActive(false)}>
		    <i className="fas fa-times" aria-hidden="true"></i>
		</button>
	    </div>

	    <div
	    className={styles.modalBackground}
	    data-testid="modal-background"
	    onClick={() => setIsActive(false)}></div>
	</div>
    );
}

export default Modal;
