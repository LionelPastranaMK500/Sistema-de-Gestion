import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { AfectacionISCDto, AfectacionISCCreateDto } from "@/types/models";

const AFECISC_URL = "/api/v1/afecisc";

export const afectacionIscService = {
  // GET /api/v1/afecisc
  listAll: async (): Promise<ApiResponse<AfectacionISCDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<AfectacionISCDto[]>>(
      AFECISC_URL
    );
    return data;
  },

  // GET /api/v1/afecisc/{id}
  getById: async (id: number): Promise<ApiResponse<AfectacionISCDto>> => {
    const { data } = await apiClient.get<ApiResponse<AfectacionISCDto>>(
      `${AFECISC_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/afecisc
  create: async (
    dto: AfectacionISCCreateDto
  ): Promise<ApiResponse<AfectacionISCDto>> => {
    const { data } = await apiClient.post<ApiResponse<AfectacionISCDto>>(
      AFECISC_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/afecisc
  update: async (
    dto: AfectacionISCDto
  ): Promise<ApiResponse<AfectacionISCDto>> => {
    const { data } = await apiClient.put<ApiResponse<AfectacionISCDto>>(
      AFECISC_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/afecisc/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${AFECISC_URL}/${id}`
    );
    return data;
  },
};
