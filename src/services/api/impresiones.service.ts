import api from "@/config/api";
import { ImpresionConfig } from "@/types/services";

export const impresionesService = {
  // CRUD Básico
  getAll: () => api.get<ImpresionConfig[]>("/api/v1/impresiones"),

  getById: (id: number) =>
    api.get<ImpresionConfig>(`/api/v1/impresiones/${id}`),

  create: (data: Partial<ImpresionConfig>) =>
    api.post<ImpresionConfig>("/api/v1/impresiones", data),

  update: (data: Partial<ImpresionConfig>) =>
    api.put<ImpresionConfig>("/api/v1/impresiones", data),

  delete: (id: number) => api.delete<void>(`/api/v1/impresiones/${id}`),

  // Búsquedas por Formato
  findByFormatoPage: (formato: string, params: any = {}) =>
    api.get<any>(
      `/api/v1/impresiones/search/formato?formato=${formato}&${new URLSearchParams(
        params
      ).toString()}`
    ),

  findByFormatoList: (formato: string) =>
    api.get<ImpresionConfig[]>(
      `/api/v1/impresiones/search/formato/list?formato=${formato}`
    ),

  findFirstByFormato: (formato: string) =>
    api.get<ImpresionConfig>(
      `/api/v1/impresiones/search/formato/first?formato=${formato}`
    ),

  // Búsquedas por ID Usuario
  findByUsuarioIdPage: (usuarioId: number, params: any = {}) =>
    api.get<any>(
      `/api/v1/impresiones/search/usuario/${usuarioId}?${new URLSearchParams(
        params
      ).toString()}`
    ),

  findByUsuarioIdList: (usuarioId: number) =>
    api.get<ImpresionConfig[]>(
      `/api/v1/impresiones/search/usuario/${usuarioId}/list`
    ),

  findFirstByUsuarioId: (usuarioId: number) =>
    api.get<ImpresionConfig>(
      `/api/v1/impresiones/search/usuario/${usuarioId}/first`
    ),

  // Búsquedas por Nombre Usuario
  findByUsuarioNombrePage: (nombre: string, params: any = {}) =>
    api.get<any>(
      `/api/v1/impresiones/search/usuario/nombre?q=${nombre}&${new URLSearchParams(
        params
      ).toString()}`
    ),

  findByUsuarioNombreList: (nombre: string) =>
    api.get<ImpresionConfig[]>(
      `/api/v1/impresiones/search/usuario/nombre/list?q=${nombre}`
    ),

  findFirstByUsuarioNombre: (nombre: string) =>
    api.get<ImpresionConfig>(
      `/api/v1/impresiones/search/usuario/nombre/first?q=${nombre}`
    ),
};
