import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  TipoDocNotaDto,
  TipoDocNotaCreateDto,
  TipoDocNotaUpdateDto,
  TipoDocNotaDetailDto,
} from "@/types/models"; // Ajusta la ruta si es necesario

const URL = "/api/v1/tip-doc-nota";

export const tipoDocNotaService = {
  // GET /api/v1/tip-doc-nota
  listAll: async (): Promise<ApiResponse<TipoDocNotaDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<TipoDocNotaDto[]>>(URL);
    return data;
  },

  // GET /api/v1/tip-doc-nota/{id}
  getById: async (id: number): Promise<ApiResponse<TipoDocNotaDto>> => {
    const { data } = await apiClient.get<ApiResponse<TipoDocNotaDto>>(
      `${URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/tip-doc-nota/{id}/detail (Nuevo endpoint específico de este controller)
  getDetailById: async (
    id: number
  ): Promise<ApiResponse<TipoDocNotaDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<TipoDocNotaDetailDto>>(
      `${URL}/${id}/detail`
    );
    return data;
  },

  // POST /api/v1/tip-doc-nota
  create: async (
    dto: TipoDocNotaCreateDto
  ): Promise<ApiResponse<TipoDocNotaDto>> => {
    const { data } = await apiClient.post<ApiResponse<TipoDocNotaDto>>(
      URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/tip-doc-nota
  update: async (
    dto: TipoDocNotaUpdateDto
  ): Promise<ApiResponse<TipoDocNotaDto>> => {
    const { data } = await apiClient.put<ApiResponse<TipoDocNotaDto>>(URL, dto);
    return data;
  },

  // DELETE /api/v1/tip-doc-nota/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`${URL}/${id}`);
    return data;
  },
};
