import { useState, useCallback } from 'react';

/**
 * Hook para manejar arrays dinámicos (agregar, eliminar, actualizar items)
 * @param {Array} initialItems - Items iniciales
 * @param {Function} generateId - Función para generar IDs únicos (default: Date.now)
 * @returns {Object} - items, addItem, removeItem, updateItem, setItems, resetItems
 */
export const useDynamicList = (initialItems = [], generateId = () => Date.now()) => {
    const [items, setItems] = useState(initialItems);

    const addItem = useCallback((newItem = {}) => {
        setItems(prev => [...prev, { ...newItem, tempId: generateId() }]);
    }, [generateId]);

    const removeItem = useCallback((id) => {
        setItems(prev => prev.filter(item => item.tempId !== id));
    }, []);

    const updateItem = useCallback((id, field, value) => {
        setItems(prev => prev.map(item =>
            item.tempId === id ? { ...item, [field]: value } : item
        ));
    }, []);

    const resetItems = useCallback(() => {
        setItems(initialItems);
    }, [initialItems]);

    return {
        items,
        setItems,
        addItem,
        removeItem,
        updateItem,
        resetItems
    };
};