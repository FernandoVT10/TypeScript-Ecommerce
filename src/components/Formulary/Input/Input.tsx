import React from "react";

import styles from "./Input.module.scss";

interface InputProps {
    type: string,
    id: string,
    name: string,
    label: string,
    value: string,
    maxLength?: number,
    setValue: React.Dispatch<string>
    errorMessage?: string
}

function Input({
    type,
    id,
    name,
    label,
    value,
    maxLength = 1000,
    setValue,
    errorMessage = ""
}: InputProps) {
    const inputGroupClass = errorMessage.length > 0 ? styles.error : "";

    return (
        <div className={`${styles.inputGroup} ${inputGroupClass}`}>
            <input
            type={type}
            id={id}
            name={name}
            className={styles.input}
            value={value}
	    maxLength={maxLength}
            onChange={({ target: { value } }) => setValue(value)}
            autoComplete={name}
            required/>

            <label htmlFor={id} className={styles.label}>
                { label }
            </label>

            { errorMessage.length > 0 &&
                <p className={styles.errorMessage}>{ errorMessage }</p>
            }
        </div>
    );
}

export default Input;
