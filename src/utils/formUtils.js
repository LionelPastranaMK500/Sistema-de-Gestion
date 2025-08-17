import { useState } from "react";

export function useFormHandler(initialValues, validate, onSubmit) {
    const [values, setValues] = useState(initialValues);
    const [err, setErr] = useState({});

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setValues((prev) => ({
            ...prev, [name]: type === "checkbox" ? checked : value,
        }));
        setErr((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const validationErrors = validate(values);
        setErr(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            await onSubmit(values);
        }
    };

    return { values, err, handleChange, handleSubmit };
}