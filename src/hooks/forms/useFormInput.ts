import { useState } from "react";

export const useFormInput = <T extends Record<string, any>>(
  initialValues: T
) => {
  const [formData, setFormData] = useState<T>(initialValues);

  const handleChange = (e: any, fieldName?: string) => {
    const field = fieldName || e.target?.name;

    const value = e.target?.value ?? e.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialValues);
  };

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
  };
};
