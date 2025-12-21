import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { MonedaDto, MonedaCreateDto } from "@/types/models";

const MONEDA_URL = "/api/v1/moneda";

export const monedasService = {
  // GET /api/v1/moneda
  listAll: async (): Promise<ApiResponse<MonedaDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<MonedaDto[]>>(MONEDA_URL);
    return data;
  },

  // GET /api/v1/moneda/{id}
  getById: async (id: number): Promise<ApiResponse<MonedaDto>> => {
    const { data } = await apiClient.get<ApiResponse<MonedaDto>>(
      `${MONEDA_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/moneda
  create: async (dto: MonedaCreateDto): Promise<ApiResponse<MonedaDto>> => {
    const { data } = await apiClient.post<ApiResponse<MonedaDto>>(
      MONEDA_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/moneda
  update: async (dto: MonedaDto): Promise<ApiResponse<MonedaDto>> => {
    const { data } = await apiClient.put<ApiResponse<MonedaDto>>(
      MONEDA_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/moneda/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${MONEDA_URL}/${id}`
    );
    return data;
  },
};
