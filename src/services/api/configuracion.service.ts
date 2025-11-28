import api from "../api";
import { Usuario, Sucursal, ImpresionConfig } from "@/services/generadorData";

interface EmpresaConfig {
  ruc: string;
  razonSocial: string;
  direccion: string;
  [key: string]: any;
}

export const usuariosService = {
  getAll: () => api.get<Usuario[]>("/api/v1/usuarios"),

  create: (usuarioData: Usuario) =>
    api.post<Usuario>("/api/v1/usuarios", usuarioData),

  getStatus: (id: string | number) =>
    api.get<{ status: string }>(`/api/v1/usuarios/${id}/status`),

  getSummary: (id: string | number) =>
    api.get<any>(`/api/v1/usuarios/${id}/summary`),
};

export const configuracionEmpresaService = {
  getMe: () => api.get<EmpresaConfig>("/api/v1/configuracion-empresa/me"),

  getByUsuario: (id: string | number) =>
    api.get<EmpresaConfig>(`/api/v1/configuracion-empresa/usuario/${id}`),

  getAll: () => api.get<EmpresaConfig[]>("/api/v1/configuracion-empresa"),
};

export const sucursalesService = {
  getAll: () => api.get<Sucursal[]>("/api/v1/sucursales"),

  getDetalle: (id: string | number) =>
    api.get<Sucursal>(`/api/v1/sucursales/${id}/detalle`),
};

export const impresionesService = {
  getAll: () => api.get<ImpresionConfig[]>("/api/v1/impresiones"),

  searchByFormato: (formato: string) =>
    api.get<ImpresionConfig>(
      `/api/v1/impresiones/search/formato?formato=${formato}`
    ),

  searchByUsuario: (id: string | number) =>
    api.get<ImpresionConfig>(`/api/v1/impresiones/search/usuario/${id}`),
};
