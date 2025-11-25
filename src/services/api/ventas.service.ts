import api from '../api';

export const ventasService = {
    emitir: (ventaData) => api.post('/api/v1/documentos/emision', ventaData),
    getById: (id) => api.get(`/api/v1/documentos/${id}`),
    getEstado: (id) => api.get(`/api/v1/documentos/${id}/estado`),
    getCdr: (id) => api.get(`/api/v1/documentos/${id}/cdr`),
    listar: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/api/v1/documentos${query ? `?${query}` : ''}`);
    },
    anular: (id, motivo) => api.post(`/api/v1/documentos/${id}/anular`, { motivo }),
};