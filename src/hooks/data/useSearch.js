import { useState, useMemo } from 'react';

/**
 * Hook para búsqueda y filtrado de datos
 * @param {Array} items - Items a buscar
 * @param {Array|Function} searchFields - Campos o función de búsqueda
 * @returns {Object} - searchQuery, filteredItems, handleSearch, setSearchQuery
 */
export const useSearch = (items, searchFields) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery) return items;

        const query = searchQuery.toLowerCase().trim();

        return items.filter(item => {
            if (typeof searchFields === 'function') {
                return searchFields(item, query);
            }

            return searchFields.some(field =>
                (item[field] || '').toString().toLowerCase().includes(query)
            );
        });
    }, [items, searchQuery, searchFields]);

    const handleSearch = (e) => {
        const value = e.target?.value ?? e.value ?? e;
        setSearchQuery(value);
    };

    return {
        searchQuery,
        setSearchQuery,
        filteredItems,
        handleSearch
    };
};
