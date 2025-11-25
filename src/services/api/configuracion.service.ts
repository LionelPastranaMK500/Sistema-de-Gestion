import api from './api';

export const usuariosService = {
    getAll: () => api.get('/api/v1/usuarios'),

    create: (usuarioData) => api.post('/api/v1/usuarios', usuarioData),

    getStatus: (id) => api.get(`/api/v1/usuarios/${id}/status`),

    getSummary: (id) => api.get(`/api/v1/usuarios/${id}/summary`),
};

export const configuracionEmpresaService = {
    getMe: () => api.get('/api/v1/configuracion-empresa/me'),

    getByUsuario: (id) => api.get(`/api/v1/configuracion-empresa/usuario/${id}`),

    getAll: () => api.get('/api/v1/configuracion-empresa'),
};

export const sucursalesService = {
    getAll: () => api.get('/api/v1/sucursales'),

    getDetalle: (id) => api.get(`/api/v1/sucursales/${id}/detalle`),
};

export const impresionesService = {
    getAll: () => api.get('/api/v1/impresiones'),

    searchByFormato: (formato) => api.get(`/api/v1/impresiones/search/formato?formato=${formato}`),

    searchByUsuario: (id) => api.get(`/api/v1/impresiones/search/usuario/${id}`),
};