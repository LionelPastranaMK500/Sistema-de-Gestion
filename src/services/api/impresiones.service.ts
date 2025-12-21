import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  ImpresionDto,
  ImpresionCreateDto,
  ImpresionUpdateDto,
  FormatoImpresion,
} from "@/types/models";

const IMPRESION_URL = "/api/v1/impresiones";

export const impresionesService = {
  // --- CRUD BÁSICO ---

  // GET /api/v1/impresiones
  listAll: async (): Promise<ApiResponse<ImpresionDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ImpresionDto[]>>(
      IMPRESION_URL
    );
    return data;
  },

  // GET /api/v1/impresiones/{id}
  getById: async (id: number): Promise<ApiResponse<ImpresionDto>> => {
    const { data } = await apiClient.get<ApiResponse<ImpresionDto>>(
      `${IMPRESION_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/impresiones
  create: async (
    dto: ImpresionCreateDto
  ): Promise<ApiResponse<ImpresionDto>> => {
    const { data } = await apiClient.post<ApiResponse<ImpresionDto>>(
      IMPRESION_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/impresiones
  update: async (
    dto: ImpresionUpdateDto
  ): Promise<ApiResponse<ImpresionDto>> => {
    const { data } = await apiClient.put<ApiResponse<ImpresionDto>>(
      IMPRESION_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/impresiones/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${IMPRESION_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/impresiones/search/formato?formato=...
  findByFormatoPage: async (
    formato: FormatoImpresion,
    params?: { page?: number; size?: number }
  ): Promise<ApiResponse<any>> => {
    // Retorna Page<ImpresionDto>
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${IMPRESION_URL}/search/formato`,
      { params: { formato, ...params } }
    );
    return data;
  },

  // GET /api/v1/impresiones/search/formato/list?formato=...
  findByFormatoList: async (
    formato: FormatoImpresion
  ): Promise<ApiResponse<ImpresionDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ImpresionDto[]>>(
      `${IMPRESION_URL}/search/formato/list`,
      { params: { formato } }
    );
    return data;
  },

  // GET /api/v1/impresiones/search/formato/first?formato=...
  findFirstByFormato: async (
    formato: FormatoImpresion
  ): Promise<ApiResponse<ImpresionDto>> => {
    const { data } = await apiClient.get<ApiResponse<ImpresionDto>>(
      `${IMPRESION_URL}/search/formato/first`,
      { params: { formato } }
    );
    return data;
  },

  // GET /api/v1/impresiones/search/usuario/{usuarioId}
  findByUsuarioIdPage: async (
    usuarioId: number,
    params?: { page?: number; size?: number }
  ): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${IMPRESION_URL}/search/usuario/${usuarioId}`,
      { params }
    );
    return data;
  },

  // GET /api/v1/impresiones/search/usuario/{usuarioId}/list
  findByUsuarioIdList: async (
    usuarioId: number
  ): Promise<ApiResponse<ImpresionDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ImpresionDto[]>>(
      `${IMPRESION_URL}/search/usuario/${usuarioId}/list`
    );
    return data;
  },

  // GET /api/v1/impresiones/search/usuario/{usuarioId}/first
  findFirstByUsuarioId: async (
    usuarioId: number
  ): Promise<ApiResponse<ImpresionDto>> => {
    const { data } = await apiClient.get<ApiResponse<ImpresionDto>>(
      `${IMPRESION_URL}/search/usuario/${usuarioId}/first`
    );
    return data;
  },

  // GET /api/v1/impresiones/search/usuario/nombre?q=...
  findByUsuarioNombrePage: async (
    nombre: string,
    params?: { page?: number; size?: number }
  ): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${IMPRESION_URL}/search/usuario/nombre`,
      { params: { q: nombre, ...params } }
    );
    return data;
  },

  // GET /api/v1/impresiones/search/usuario/nombre/list?q=...
  findByUsuarioNombreList: async (
    nombre: string
  ): Promise<ApiResponse<ImpresionDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ImpresionDto[]>>(
      `${IMPRESION_URL}/search/usuario/nombre/list`,
      { params: { q: nombre } }
    );
    return data;
  },

  // GET /api/v1/impresiones/search/usuario/nombre/first?q=...
  findFirstByUsuarioNombre: async (
    nombre: string
  ): Promise<ApiResponse<ImpresionDto>> => {
    const { data } = await apiClient.get<ApiResponse<ImpresionDto>>(
      `${IMPRESION_URL}/search/usuario/nombre/first`,
      { params: { q: nombre } }
    );
    return data;
  },
};
