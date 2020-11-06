import React, { useRef } from "react";

import styles from "./QuantitySelector.module.scss";

interface QuantitySelectorProps {
    quantity: number,
    setQuantity: React.Dispatch<number>,
    inStock: number
}

function QuantitySelector({ quantity, setQuantity, inStock }: QuantitySelectorProps) {
    const quantityInput = useRef<HTMLInputElement>();

    const setInputValue = (value: number) => {
	quantityInput.current.value = value.toString();
    }

    const handleSetQuantity = (quantity: number) => {
	if(quantity > inStock) {
	    setQuantity(inStock);
	    setInputValue(inStock);
	} else if(quantity < 1) {
	    setQuantity(1);
	    setInputValue(1);
	} else {
	    setQuantity(quantity);
	    setInputValue(quantity);
	}
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
	const { value } = e.target;
	const quantity = parseInt(value);

	if(!isNaN(quantity)) {
	    handleSetQuantity(quantity);
	}
    }

    return (
	<div className={styles.quantityContainer}>
	    <div className={styles.quantitySelector}>
		<button className={styles.button} onClick={() => handleSetQuantity(quantity - 1)}>-</button>

		<input
		type="number"
		ref={quantityInput}
		className={styles.quantity}
		onChange={handleInput}
		defaultValue={quantity}/>

		<button className={styles.button} onClick={() => handleSetQuantity(quantity + 1)}>+</button>
	    </div>

	    <span className={styles.available}>Available: { inStock }</span>
	</div>
    );
}

export default QuantitySelector;
