import { useState, useEffect } from "react";
import { OnSaveCallback } from "@/types/hooks";

export const useModalInput = (
  visible: boolean,
  initialValue: string,
  onSave: OnSaveCallback
) => {
  const [inputValue, setInputValue] = useState(initialValue || "");

  useEffect(() => {
    if (visible) {
      setInputValue(initialValue || "");
    }
  }, [visible, initialValue]);

  const handleSave = () => {
    if (onSave) {
      onSave(inputValue);
    }
  };

  return {
    inputValue,
    setInputValue,
    handleSave,
  };
};
