import React from "react";

import styles from "./Checkbox.module.scss";

interface CheckboxProps {
    children: JSX.Element,
    id: string,
    name: string,
    checked: boolean,
    setChecked: React.Dispatch<boolean>,
    errorMessage?: string
}

function Checkbox({
    children,
    id,
    name,
    checked,
    setChecked,
    errorMessage = ""
}: CheckboxProps) {
    const checkboxContainerClass = errorMessage.length > 0 ? styles.error : "";

    return (
	<div className={`${styles.checkboxContainer} ${checkboxContainerClass}`}>
	    <input
	    type="checkbox"
	    className={styles.inputCheckbox}
	    id={id}
	    name={name}
	    checked={checked}
	    onChange={({ target: { checked } }) => setChecked(checked)}/>

	    <label htmlFor={id} className={styles.label}>
		<span className={styles.checkbox}></span>

		<span className={styles.checkboxText}>
		    { children }
		</span>
	    </label>

	    { errorMessage.length > 0 &&
		<p className={styles.errorMessage}>{ errorMessage }</p>
	    }
	</div>
    );
}

export default Checkbox;
