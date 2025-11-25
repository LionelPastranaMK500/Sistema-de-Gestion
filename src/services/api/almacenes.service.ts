import api from './api';

export const almacenesService = {
    getAll: () => api.get('/api/v1/almacen'),

    create: (almacenData) => api.post('/api/v1/almacen', almacenData),

    search: (query) => api.get(`/api/v1/almacen/search?q=${query}`),

    getProductos: (id) => api.get(`/api/v1/almacen/${id}/productos`),

    getProductosByNombre: (nombre) => api.get(`/api/v1/almacen/nombre/${nombre}/productos`),

    buscarProductos: (query) => api.get(`/api/v1/almacen/productos/buscar?q=${query}`),
};