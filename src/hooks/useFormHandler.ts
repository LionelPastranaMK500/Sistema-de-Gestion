import { useState, ChangeEvent, FormEvent } from "react";

type FormErrors = Record<string, string | undefined>;

export function useFormHandler<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => FormErrors | null | undefined,
  onSubmit?: (values: T) => Promise<void> | void
) {
  const [values, setValues] = useState<T>(initialValues);
  const [err, setErr] = useState<FormErrors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErr((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate ? validate(values) || {} : {};
    setErr(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErr({});
  };

  return { values, setValues, err, handleChange, handleSubmit, resetForm };
}
