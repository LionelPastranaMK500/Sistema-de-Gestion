import api from './api';

const createCrudService = (basePath) => ({
    getAll: () => api.get(basePath),
    create: (data) => api.post(basePath, data),
    getById: (id) => api.get(`${basePath}/${id}`),
    update: (id, data) => api.put(`${basePath}/${id}`, data),
    delete: (id) => api.delete(`${basePath}/${id}`),
});

export const seriesService = {
    ...createCrudService('/api/v1/series'),
    buscar: (nombre) => api.get(`/api/v1/series/buscar?nombre=${nombre}`),
    getByComprobante: (id) => api.get(`/api/v1/series/comprobante/${id}`),
};

export const direccionesService = {
    ...createCrudService('/api/v1/direcciones'),
    buscarAdicional: (txt) => api.get(`/api/v1/direcciones/buscar/adicional/${txt}`),
    buscarDescripcion: (txt) => api.get(`/api/v1/direcciones/buscar/descripcion/${txt}`),
};

export const tipoDocNotaService = {
    ...createCrudService('/api/v1/tip-doc-nota'),
    getDetail: (id) => api.get(`/api/v1/tip-doc-nota/${id}/detail`),
};

export const afecigvService = createCrudService('/api/v1/afecigv');
export const afeciscService = createCrudService('/api/v1/afecisc');
export const monedaService = createCrudService('/api/v1/moneda');
export const tipClienteService = createCrudService('/api/v1/tipcliente');
export const tipDocService = createCrudService('/api/v1/tipdoc');
export const tipoEnviosService = createCrudService('/api/v1/tipoenvios');
export const ubigeoService = createCrudService('/api/v1/ubigeo');
export const unimedService = createCrudService('/api/v1/unimed');
export const avUsuarioService = createCrudService('/api/v1/avusuario');