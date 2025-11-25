import { useState, useMemo, useEffect } from 'react';

/**
 * Hook para paginación de datos
 * @param {Array} items - Items a paginar
 * @param {number} itemsPerPage - Items por página (default: 10)
 * @returns {Object} - currentPage, totalPages, paginatedItems, nextPage, prevPage, goToPage, hasNext, hasPrev
 */
export const usePagination = (items, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    useEffect(() => {
        setCurrentPage(1);
    }, [items.length]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    }, [items, currentPage, itemsPerPage]);

    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToPage = (page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    return {
        currentPage,
        totalPages,
        paginatedItems,
        nextPage,
        prevPage,
        goToPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
};
