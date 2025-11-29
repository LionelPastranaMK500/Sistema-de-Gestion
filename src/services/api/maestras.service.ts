import api from "../api";
import { Serie, Direccion, TipoDocNota } from "@/types/services";

const createCrudService = <T>(basePath: string) => ({
  getAll: () => api.get<T[]>(basePath),
  create: (data: Partial<T>) => api.post<T>(basePath, data),
  getById: (id: string | number) => api.get<T>(`${basePath}/${id}`),
  update: (id: string | number, data: Partial<T>) =>
    api.put<T>(`${basePath}/${id}`, data),
  delete: (id: string | number) => api.delete<void>(`${basePath}/${id}`),
});

export const seriesService = {
  ...createCrudService<Serie>("/api/v1/series"),
  buscar: (nombre: string) =>
    api.get<Serie[]>(`/api/v1/series/buscar?nombre=${nombre}`),

  getByComprobante: (id: string | number) =>
    api.get<Serie[]>(`/api/v1/series/comprobante/${id}`),
};

export const direccionesService = {
  ...createCrudService<Direccion>("/api/v1/direcciones"),
  buscarAdicional: (txt: string) =>
    api.get<Direccion[]>(`/api/v1/direcciones/buscar/adicional/${txt}`),

  buscarDescripcion: (txt: string) =>
    api.get<Direccion[]>(`/api/v1/direcciones/buscar/descripcion/${txt}`),
};

export const tipoDocNotaService = {
  ...createCrudService<TipoDocNota>("/api/v1/tip-doc-nota"),
  getDetail: (id: string | number) =>
    api.get<any>(`/api/v1/tip-doc-nota/${id}/detail`),
};

export const afecigvService = createCrudService<any>("/api/v1/afecigv");
export const afeciscService = createCrudService<any>("/api/v1/afecisc");
export const monedaService = createCrudService<any>("/api/v1/moneda");
export const tipClienteService = createCrudService<any>("/api/v1/tipcliente");
export const tipDocService = createCrudService<any>("/api/v1/tipdoc");
export const tipoEnviosService = createCrudService<any>("/api/v1/tipoenvios");
export const ubigeoService = createCrudService<any>("/api/v1/ubigeo");
export const unimedService = createCrudService<any>("/api/v1/unimed");
export const avUsuarioService = createCrudService<any>("/api/v1/avusuario");
