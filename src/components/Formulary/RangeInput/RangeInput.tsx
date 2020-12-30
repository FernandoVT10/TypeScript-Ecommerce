import React, { useEffect, useRef } from "react";

import styles from "./RangeInput.module.scss";

interface RangeInputProps {
    min: number,
    max: number,
    value: number,
    setValue: React.Dispatch<number>
}

const RangeInput = ({ min, max, value, setValue }: RangeInputProps) => {
    const style = useRef<HTMLStyleElement>(null);

    const setBackgroundSize = (size: number) => {
	style.current.innerText = `.${styles.input}::-webkit-slider-runnable-track {
	    background-size: ${size}% 100% !important;
	}`;
    }

    useEffect(() => {
	style.current = document.createElement("style");
	document.body.appendChild(style.current);

	setBackgroundSize((value - min) / (max - min) * 100);
    }, []);

    const handleChange = (newValue: number) => {
	setBackgroundSize((newValue - min) / (max - min) * 100);
	setValue(newValue);
    }

    return (
	<div className={styles.rangeInput}>
	    <input
	    type="range"
	    className={styles.input}
	    data-testid="range-input"
	    min={min}
	    max={max}
	    value={value}
	    onChange={({ target: { value } }) => handleChange(parseInt(value))}/>

	    <span className={styles.rangeValue}>{ value } / { max }</span>
	</div>
    );
}

export default RangeInput;
