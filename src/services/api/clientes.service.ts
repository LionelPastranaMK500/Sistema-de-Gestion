import api from './api';

export const clientesService = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/api/v1/clientes${query ? `?${query}` : ''}`);
    },

    create: (clienteData) => api.post('/api/v1/clientes', clienteData),

    getById: (id) => api.get(`/api/v1/clientes/${id}`),

    update: (id, clienteData) => api.put(`/api/v1/clientes/${id}`, clienteData),

    delete: (id) => api.delete(`/api/v1/clientes/${id}`),

    consultarDocumento: (numero) => api.get(`/api/v1/clientes/consulta?numero=${numero}`),
};