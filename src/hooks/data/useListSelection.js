import { useState, useCallback } from 'react';

/**
 * Hook para manejar selección y gestión de items en listas
 * Útil para casos como: agregar vendedores, asignar permisos, seleccionar categorías, etc.
 * 
 * @param {Array} initialItems - Items iniciales en la lista
 * @param {Object} options - Opciones de configuración
 * @param {Function} options.onDuplicate - Callback cuando se intenta agregar un duplicado
 * @param {Function} options.onEmptySelection - Callback cuando se intenta agregar sin selección
 * @returns {Object} - selectedItems, selectedItem, addItem, removeItem, setSelectedItem, setSelectedItems
 */
export const useListSelection = (initialItems = [], options = {}) => {
    const [selectedItems, setSelectedItems] = useState(initialItems);
    const [selectedItem, setSelectedItem] = useState(null);

    const { onDuplicate, onEmptySelection } = options;

    const addItem = useCallback((item = selectedItem) => {
        if (!item) {
            onEmptySelection?.();
            return false;
        }

        if (selectedItems.includes(item)) {
            onDuplicate?.(item);
            return false;
        }

        setSelectedItems(prev => [...prev, item]);
        setSelectedItem(null);
        return true;
    }, [selectedItem, selectedItems, onDuplicate, onEmptySelection]);

    const removeItem = useCallback((item) => {
        setSelectedItems(prev => prev.filter(i => i !== item));
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedItem(null);
    }, []);

    const resetItems = useCallback(() => {
        setSelectedItems(initialItems);
        setSelectedItem(null);
    }, [initialItems]);

    return {
        selectedItems,
        selectedItem,
        addItem,
        removeItem,
        setSelectedItem,
        setSelectedItems,
        clearSelection,
        resetItems
    };
};
