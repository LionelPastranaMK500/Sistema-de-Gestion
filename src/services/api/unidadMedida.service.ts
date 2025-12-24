import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { UnidadMedidaDto, UnidadMedidaCreateDto } from "@/types/models";

const UNIMED_URL = "/api/v1/unimed";

export const unidadMedidaService = {
  // GET /api/v1/unimed
  listAll: async (): Promise<ApiResponse<UnidadMedidaDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<UnidadMedidaDto[]>>(
      UNIMED_URL
    );
    return data;
  },

  // GET /api/v1/unimed/{id}
  getById: async (id: number): Promise<ApiResponse<UnidadMedidaDto>> => {
    const { data } = await apiClient.get<ApiResponse<UnidadMedidaDto>>(
      `${UNIMED_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/unimed
  create: async (
    dto: UnidadMedidaCreateDto
  ): Promise<ApiResponse<UnidadMedidaDto>> => {
    const { data } = await apiClient.post<ApiResponse<UnidadMedidaDto>>(
      UNIMED_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/unimed
  update: async (
    dto: UnidadMedidaDto
  ): Promise<ApiResponse<UnidadMedidaDto>> => {
    const { data } = await apiClient.put<ApiResponse<UnidadMedidaDto>>(
      UNIMED_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/unimed/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${UNIMED_URL}/${id}`
    );
    return data;
  },
};
