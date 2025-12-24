import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { UbigeoDto, UbigeoCreateDto } from "@/types/models";

const UBIGEO_URL = "/api/v1/ubigeo";

export const ubigeoService = {
  // GET /api/v1/ubigeo
  listAll: async (): Promise<ApiResponse<UbigeoDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<UbigeoDto[]>>(UBIGEO_URL);
    return data;
  },

  // GET /api/v1/ubigeo/{id}
  getById: async (id: number): Promise<ApiResponse<UbigeoDto>> => {
    const { data } = await apiClient.get<ApiResponse<UbigeoDto>>(
      `${UBIGEO_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/ubigeo
  create: async (dto: UbigeoCreateDto): Promise<ApiResponse<UbigeoDto>> => {
    const { data } = await apiClient.post<ApiResponse<UbigeoDto>>(
      UBIGEO_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/ubigeo
  update: async (dto: UbigeoDto): Promise<ApiResponse<UbigeoDto>> => {
    const { data } = await apiClient.put<ApiResponse<UbigeoDto>>(
      UBIGEO_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/ubigeo/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${UBIGEO_URL}/${id}`
    );
    return data;
  },
};
