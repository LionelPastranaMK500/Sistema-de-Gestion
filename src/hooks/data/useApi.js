import { useState, useCallback } from 'react';

export const useApi = (apiFunction, options = {}) => {
    const { immediate = false, onSuccess, onError } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiFunction(...args);
            setData(result);
            onSuccess?.(result);
            return result;
        } catch (err) {
            setError(err);
            onError?.(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction, onSuccess, onError]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset };
};