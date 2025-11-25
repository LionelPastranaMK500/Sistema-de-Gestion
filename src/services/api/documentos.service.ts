import api from './api';

export const documentosService = {
    emitir: (documentoData) => api.post('/api/v1/documentos/emision', documentoData),

    getById: (id) => api.get(`/api/v1/documentos/${id}`),

    getEstado: (id) => api.get(`/api/v1/documentos/${id}/estado`),

    getCdr: (id) => api.get(`/api/v1/documentos/${id}/cdr`),
};