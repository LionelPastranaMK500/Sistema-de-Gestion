import api from './api';

export const guiasService = {
    getAll: () => api.get('/api/v1/guia-remision'),

    create: (guiaData) => api.post('/api/v1/guia-remision', guiaData),

    getById: (id) => api.get(`/api/v1/guia-remision/${id}`),

    update: (guiaData) => api.put('/api/v1/guia-remision', guiaData),

    delete: (id) => api.delete(`/api/v1/guia-remision/${id}`),

    getDetailed: (id) => api.get(`/api/v1/guia-remision/search/detailed/${id}`),

    searchPaginated: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/api/v1/guia-remision/search/page${query ? `?${query}` : ''}`);
    },
};