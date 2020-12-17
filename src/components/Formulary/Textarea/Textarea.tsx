import React from "react";

import styles from "./Textarea.module.scss";

interface TextareaProps {
    id: string,
    name: string,
    label: string,
    value: string,
    maxLength?: number,
    setValue: React.Dispatch<string>
    errorMessage?: string
}

function Teztarea({
    id,
    name,
    label,
    value,
    maxLength = 1000,
    setValue,
    errorMessage = ""
}: TextareaProps) {
    const inputGroupClass = errorMessage.length > 0 ? styles.error : "";

    return (
        <div className={`${styles.textareaContainer} ${inputGroupClass}`}>
	    <textarea
	    id={id}
	    name={name}
	    className={styles.textarea}
            value={value}
	    maxLength={maxLength}
	    onChange={({ target: { value } }) => setValue(value)}
	    required></textarea>

	    <label htmlFor={id} className={styles.label}>
		{ label }
	    </label>

	    <span className={styles.characteresCount}>
		{ value.length }/{ maxLength }
	    </span>

            { errorMessage.length > 0 &&
                <p className={styles.errorMessage}>{ errorMessage }</p>
            }
        </div>
    );
}

export default Teztarea;
