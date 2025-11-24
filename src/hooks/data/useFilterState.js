import { useState } from 'react';

/**
 * Hook para manejar estado de filtros
 * @param {Object} initialFilters - Filtros iniciales
 * @returns {Object} - filters, updateFilter, resetFilters, setFilters
 */
export const useFilterState = (initialFilters = {}) => {
    const [filters, setFilters] = useState(initialFilters);

    const updateFilter = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters
    };
};
