import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Checkbox from "@/components/Formulary/Checkbox";

import styles from "./SortBy.module.scss";

const SortBy = () => {
    const [isActive, setIsActive] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [completedCheckbox, setCompletedCheckbox] = useState(true);
    const [shippingCheckbox, setShippingCheckbox] = useState(true);

    const router = useRouter();

    useEffect(() => {
	const { orderId, only } = router.query;

	if(orderId) {
	    setInputValue(orderId.toString());
	}

	switch(only) {
	    case "SHIPPING":
		setCompletedCheckbox(false);
		break;
	    case "COMPLETED":
		setShippingCheckbox(false);
		break;
	}
    }, [router.query]);

    const handleForm = (e: React.FormEvent) => {
	e.preventDefault();

	const query = {}

	if(inputValue.length) {
	    Object.assign(query, {
		orderId: inputValue
	    });
	}

	if(shippingCheckbox && !completedCheckbox) {
	    Object.assign(query, {
		only: "SHIPPING"
	    });
	} else if(completedCheckbox && !shippingCheckbox) {
	    Object.assign(query, {
		only: "COMPLETED"
	    });
	}

	setIsActive(false);

	router.push({
	    pathname: router.pathname,
	    query
	});
    }

    const sortByContainerClass = isActive ? styles.active : "";

    return (
	<div className={`${sortByContainerClass} ${styles.sortBy}`}>
	    <button className={styles.toggleButton} onClick={() => setIsActive(!isActive)}>
		Sort By
		<i className="fas fa-sort-amount-down-alt" aria-hidden="true"></i>
	    </button>

	    <div className={styles.filters}>
		<form onSubmit={handleForm}>
		    <input
		    type="text"
		    placeholder="Enter an ID"
		    maxLength={24}
		    className={styles.input}
		    value={inputValue}
		    onChange={({ target: { value } }) => setInputValue(value)}
		    data-testid="sortBy-search-input"/>

		    <div className={styles.statusFilter}>
			<p className={styles.filterLabel}>Order Status</p>

			<Checkbox
			id="completed-checkbox"
			name="completed-checkbox"
			checked={completedCheckbox}
			setChecked={() => setCompletedCheckbox(!completedCheckbox)}>
			    <span className={styles.checkboxText}>Completed</span>
			</Checkbox>

			<Checkbox
			id="shipping-checkbox"
			name="shipping-checkbox"
			checked={shippingCheckbox}
			setChecked={() => setShippingCheckbox(!shippingCheckbox)}>
			    <span className={styles.checkboxText}>Shipping</span>
			</Checkbox>
		    </div>

		    <button className={styles.submitButton}>Apply Filters</button>
		</form>
	    </div>
	</div>
    );
}

export default SortBy;
