import { useState } from "react";

export const useFormInput = (initialValues = {}) => {
    const [formData, setFormData] = useState(initialValues);

    const handleChange = (e, fieldName) => {
        const field = fieldName || e.target.name;
        const value = e.target?.value ?? e.value;

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData(initialValues);
    };

    return {
        formData,
        setFormData,
        handleChange,
        resetForm
    };
};