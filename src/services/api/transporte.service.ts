import api from './api';

export const choferesService = {
    getAll: () => api.get('/api/v1/chofer'),

    create: (choferData) => api.post('/api/v1/chofer', choferData),

    getByDni: (dni) => api.get(`/api/v1/chofer/search/dni/${dni}`),

    searchPaginated: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/api/v1/chofer/search/page${query ? `?${query}` : ''}`);
    },

    searchList: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/api/v1/chofer/search/list${query ? `?${query}` : ''}`);
    },
};

export const vehiculosService = {
    getAll: () => api.get('/api/v1/vehiculo'),

    create: (vehiculoData) => api.post('/api/v1/vehiculo', vehiculoData),

    createBatch: (vehiculos) => api.post('/api/v1/vehiculo/batch', vehiculos),

    getByPlaca: (placa) => api.get(`/api/v1/vehiculo/search/placa/${placa}`),
};