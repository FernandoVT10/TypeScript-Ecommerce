import React, { useState } from "react";

export interface InputHadnlingResponse<T> {
    value: T,
    error: string
    setValue: (newValue: T) => void,
    setError: React.Dispatch<string>
}

function useInputHandling<T>(inititalState: T | (() => T)): InputHadnlingResponse<T> {
    const [value, setValue] = useState(inititalState);
    const [error, setError] = useState("");

    const handleSetValue = (newValue: T) => {
	setError("");
	setValue(newValue);
    }

    return { value, error, setValue: handleSetValue, setError };
}

export default useInputHandling;
