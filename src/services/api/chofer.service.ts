import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { ChoferDto, ChoferCreateDto, ChoferUpdateDto } from "@/types/models";

const CHOFER_URL = "/api/v1/chofer";

export const choferService = {
  // CRUD Estándar (Coinciden perfecto)
  listAll: async () =>
    (await apiClient.get<ApiResponse<ChoferDto[]>>(CHOFER_URL)).data,
  getById: async (id: number) =>
    (await apiClient.get<ApiResponse<ChoferDto>>(`${CHOFER_URL}/${id}`)).data,
  create: async (dto: ChoferCreateDto) =>
    (await apiClient.post<ApiResponse<ChoferDto>>(CHOFER_URL, dto)).data,
  update: async (dto: ChoferUpdateDto) =>
    (await apiClient.put<ApiResponse<ChoferDto>>(CHOFER_URL, dto)).data,
  delete: async (id: number) =>
    (await apiClient.delete<ApiResponse<void>>(`${CHOFER_URL}/${id}`)).data,

  // GET /api/v1/chofer/search/dni/{dni}
  getByDni: async (dni: string): Promise<ApiResponse<ChoferDto>> => {
    const { data } = await apiClient.get<ApiResponse<ChoferDto>>(
      `${CHOFER_URL}/search/dni/${dni}`
    );
    return data;
  },

  // GET /api/v1/chofer/search/page
  searchPage: async (params: {
    nombre?: string;
    dni?: string;
    page?: number;
    size?: number;
  }) => {
    const { data } = await apiClient.get<ApiResponse<any>>( // O ApiResponse<Page<ChoferDto>>
      `${CHOFER_URL}/search/page`,
      { params }
    );
    return data;
  },

  // GET /api/v1/chofer/search/list
  listByNombreOrDni: async (params: { nombre?: string; dni?: string }) => {
    const { data } = await apiClient.get<ApiResponse<ChoferDto[]>>(
      `${CHOFER_URL}/search/list`,
      { params }
    );
    return data;
  },
};
