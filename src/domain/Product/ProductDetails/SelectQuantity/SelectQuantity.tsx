import React, { useState } from "react";

import styles from "./SelectQuantity.module.scss";

export interface SelectQuantityProps {
    quantity: number,
    setQuantity: React.Dispatch<number>
    inStock: number
}

function SelectQuantity({ quantity, setQuantity, inStock }: SelectQuantityProps) {
    const [isActive, setIsActive] = useState(false);

    const getOptions = () => {
	const options: JSX.Element[] = [];
	const optionsLength = inStock > 30 ? 30 : inStock;

	for(let quantityOption = 1; quantityOption <= optionsLength; quantityOption++) {
	    const optionClass = quantityOption === quantity ? styles.active : "";

	    options.push(
		<button
		className={`${styles.option} ${optionClass}`}
		onClick={() => setQuantity(quantityOption)}
		key={quantityOption}>
		    {quantityOption} {quantityOption > 1 ? "products" : "product"}
		</button>
	    );
	}

	return options;
    }

    const selectOptionsClass = isActive ? "" : styles.hidden;

    return (
	<div className={styles.quantityContainer} onClick={() => setIsActive(!isActive)}>
	    <span className={styles.label}>Quantity: </span>
	    <div className={styles.select}>
		<span className={styles.quantity}>{quantity}</span>
		<i className="fas fa-chevron-down" aria-hidden="true"></i>
	    </div>
	    <span className={styles.inStock}>({inStock} available)</span>

	    <div className={`${styles.selectOptions} ${selectOptionsClass}`}>
		{getOptions()}
	    </div>
	</div>
    );
}

export default SelectQuantity;
