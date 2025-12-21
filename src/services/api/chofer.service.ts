import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { ChoferDto, ChoferCreateDto, ChoferUpdateDto } from "@/types/models";

const CHOFER_URL = "/api/v1/chofer";

export const choferService = {
  // GET /api/v1/chofer
  listAll: async (): Promise<ApiResponse<ChoferDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ChoferDto[]>>(CHOFER_URL);
    return data;
  },

  // GET /api/v1/chofer/{id}
  getById: async (id: number): Promise<ApiResponse<ChoferDto>> => {
    const { data } = await apiClient.get<ApiResponse<ChoferDto>>(
      `${CHOFER_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/chofer
  create: async (dto: ChoferCreateDto): Promise<ApiResponse<ChoferDto>> => {
    const { data } = await apiClient.post<ApiResponse<ChoferDto>>(
      CHOFER_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/chofer
  update: async (dto: ChoferUpdateDto): Promise<ApiResponse<ChoferDto>> => {
    const { data } = await apiClient.put<ApiResponse<ChoferDto>>(
      CHOFER_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/chofer/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${CHOFER_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/chofer/search/dni/{dni}
  getByDni: async (dni: string): Promise<ApiResponse<ChoferDto>> => {
    const { data } = await apiClient.get<ApiResponse<ChoferDto>>(
      `${CHOFER_URL}/search/dni/${dni}`
    );
    return data;
  },

  // GET /api/v1/chofer/search/page?nombre=...&dni=...
  searchPage: async (params: {
    nombre?: string;
    dni?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${CHOFER_URL}/search/page`,
      {
        params,
      }
    );
    return data;
  },

  // GET /api/v1/chofer/search/list?nombre=...&dni=...
  listByNombreOrDni: async (params: {
    nombre?: string;
    dni?: string;
  }): Promise<ApiResponse<ChoferDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ChoferDto[]>>(
      `${CHOFER_URL}/search/list`,
      {
        params,
      }
    );
    return data;
  },
};
