import api from './api';

export const productosService = {
    getAll: () => api.get('/api/v1/producto'),

    create: (productoData) => api.post('/api/v1/producto', productoData),

    getById: (id) => api.get(`/api/v1/producto/${id}`),

    getDetail: (id) => api.get(`/api/v1/producto/${id}/detail`),

    update: (productoData) => api.put('/api/v1/producto', productoData),

    delete: (id) => api.delete(`/api/v1/producto/${id}`),

    getSummary: () => api.get('/api/v1/producto/summary'),
};