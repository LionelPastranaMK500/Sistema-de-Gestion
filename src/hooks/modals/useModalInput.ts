import { useState, useEffect } from 'react';

export const useModalInput = (visible, initialValue, onSave) => {
    const [inputValue, setInputValue] = useState(initialValue || '');
    useEffect(() => {
        if (visible) {
            setInputValue(initialValue || '');
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
        handleSave
    };
};
