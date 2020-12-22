import React, { useState } from "react";

import Input from "@/components/Formulary/Input";

import useInputHandling from "@/hooks/useInputHandling";

import ApiController from "@/services/ApiController";

import styles from "./AddShippingStatus.module.scss";

type History = Array<{
    content: string,
    createdAt: string
}>

interface APIResponse {
    error: string,
    message: string,
    data: {
	message: string
    }
}

interface AddShippingStatusProps {
    orderId: string,
    setHistory: React.Dispatch<React.SetStateAction<History>>

}

const AddShippingStatus = ({ orderId, setHistory }: AddShippingStatusProps) => {
    const statusHandler = useInputHandling("");

    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleForm = async (e: React.FormEvent) => {
	e.preventDefault();

	setLoading(true);

	const res = await ApiController.post<APIResponse>(`orders/${orderId}/shipping/addStatus`, {
	    body: {
		status: statusHandler.value
	    }
	});

	setLoading(false);

	if(res.error) {
	    return statusHandler.setError(res.message);
	}

	const newStatus = {
	    content: statusHandler.value,
	    createdAt: new Date().toString()
	}
	setHistory(prevHistory => [...prevHistory, newStatus ]);
	setIsActive(false);
	statusHandler.setValue("");
    }

    if(loading) {
    	return (
    	    <div className={styles.addShippingStatus}>
    	    	<div className={styles.loaderContainer}>
    	    	    <span className={`loader ${styles.loader}`}></span>
    	    	</div>
    	    </div>
    	);
    }

    return (
	<div className={styles.addShippingStatus}>
	    { !isActive && 
		<button
		className={styles.activateButton}
		    onClick={() => setIsActive(true)}>
		    Add New Status
		</button>
	    }

	    { isActive && 
		<form onSubmit={handleForm}>
		    <div className={styles.form}>
			<div className={styles.input}>
			    <Input
			    type="text"
			    id="shipping-state-input"
			    name="shipping-state"
			    label="New Status"
			    value={statusHandler.value}
			    setValue={statusHandler.setValue}
			    errorMessage={statusHandler.error}/>
			</div>

			<button className={`submit-button ${styles.addStatusButton}`}>
			    Add Status
			</button>
		    </div>
		</form>
	    }
	</div>
    );
}

export default AddShippingStatus;
