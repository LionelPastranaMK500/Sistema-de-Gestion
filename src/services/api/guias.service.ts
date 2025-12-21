import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  GuiaRemisionDto,
  GuiaRemisionDetailDto,
  GuiaRemisionCreateDto,
  GuiaRemisionUpdateDto,
} from "@/types/models";

const GUIA_URL = "/api/v1/guia-remision";

export const guiasService = {
  // GET /api/v1/guia-remision
  listAll: async (): Promise<ApiResponse<GuiaRemisionDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<GuiaRemisionDto[]>>(
      GUIA_URL
    );
    return data;
  },

  // GET /api/v1/guia-remision/{id}
  getById: async (id: number): Promise<ApiResponse<GuiaRemisionDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<GuiaRemisionDetailDto>>(
      `${GUIA_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/guia-remision
  create: async (
    dto: GuiaRemisionCreateDto
  ): Promise<ApiResponse<GuiaRemisionDto>> => {
    const { data } = await apiClient.post<ApiResponse<GuiaRemisionDto>>(
      GUIA_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/guia-remision
  update: async (
    dto: GuiaRemisionUpdateDto
  ): Promise<ApiResponse<GuiaRemisionDto>> => {
    const { data } = await apiClient.put<ApiResponse<GuiaRemisionDto>>(
      GUIA_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/guia-remision/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${GUIA_URL}/${id}`
    );
    return data;
  },

  // --- ACCIONES ESPECÍFICAS DE GUÍA ---

  // POST /api/v1/guia-remision/emitir/{id}
  emitir: async (id: number): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.post<ApiResponse<any>>(
      `${GUIA_URL}/emitir/${id}`
    );
    return data;
  },

  // GET /api/v1/guia-remision/imprimir/{id}
  imprimir: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`${GUIA_URL}/imprimir/${id}`, {
      responseType: "blob",
    });
    return response.data;
  },

  // GET /api/v1/guia-remision/buscar?serie=...&numero=...
  buscar: async (params: {
    serie?: string;
    numero?: string;
    cliente?: string;
  }): Promise<ApiResponse<GuiaRemisionDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<GuiaRemisionDto[]>>(
      `${GUIA_URL}/buscar`,
      { params }
    );
    return data;
  },
};
