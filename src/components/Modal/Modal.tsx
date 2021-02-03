import React, { useEffect, useRef } from "react";

import styles from "./Modal.module.scss";

interface ModalProps {
    children: JSX.Element,
    isActive: boolean,
    setIsActive: React.Dispatch<boolean>
}

const Modal = ({ children, isActive, setIsActive }: ModalProps) => {
    const modalContainer = useRef<HTMLDivElement>();
    const modal = useRef<HTMLDivElement>();

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Escape") {
            setIsActive(false);
        }
    }

    const onResize = () => {
        if(!modal.current) return;

        if(window.innerHeight < modal.current.clientHeight) {
            modalContainer.current.style.alignItems = "start";
        } else {
            modalContainer.current.style.alignItems = "center";
        }
    }

    useEffect(() => {
    	if(isActive) {
	    document.body.style.overflow = "hidden";
	} else {
	    document.body.style.overflow = "auto";
	}

        onResize();
        window.addEventListener("resize", onResize);

        document.addEventListener("keydown", handleKeyDown);
    }, [isActive]);
    
    if(!isActive) return null;

    return (
	<div className={styles.modalContainer} ref={modalContainer}  data-testid="modal-container">
	    <div className={styles.modal} ref={modal}>
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
