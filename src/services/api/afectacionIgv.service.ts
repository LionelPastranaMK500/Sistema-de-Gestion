import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { AfectacionIGVDto, AfectacionIGVCreateDto } from "@/types/models";

const AFECIGV_URL = "/api/v1/afecigv";

export const afectacionIgvService = {
  // GET /api/v1/afecigv
  listAll: async (): Promise<ApiResponse<AfectacionIGVDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<AfectacionIGVDto[]>>(
      AFECIGV_URL
    );
    return data;
  },

  // GET /api/v1/afecigv/{id}
  getById: async (id: number): Promise<ApiResponse<AfectacionIGVDto>> => {
    const { data } = await apiClient.get<ApiResponse<AfectacionIGVDto>>(
      `${AFECIGV_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/afecigv
  create: async (
    dto: AfectacionIGVCreateDto
  ): Promise<ApiResponse<AfectacionIGVDto>> => {
    const { data } = await apiClient.post<ApiResponse<AfectacionIGVDto>>(
      AFECIGV_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/afecigv
  update: async (
    dto: AfectacionIGVDto
  ): Promise<ApiResponse<AfectacionIGVDto>> => {
    const { data } = await apiClient.put<ApiResponse<AfectacionIGVDto>>(
      AFECIGV_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/afecigv/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${AFECIGV_URL}/${id}`
    );
    return data;
  },
};
