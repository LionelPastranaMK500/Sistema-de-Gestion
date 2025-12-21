import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { SerieDto, SerieCreateDto } from "@/types/models";

const SERIE_URL = "/api/v1/series";

export const seriesService = {
  // GET /api/v1/series
  listAll: async (): Promise<ApiResponse<SerieDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<SerieDto[]>>(SERIE_URL);
    return data;
  },

  // GET /api/v1/series/{id}
  getById: async (id: number): Promise<ApiResponse<SerieDto>> => {
    const { data } = await apiClient.get<ApiResponse<SerieDto>>(
      `${SERIE_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/series
  create: async (dto: SerieCreateDto): Promise<ApiResponse<SerieDto>> => {
    const { data } = await apiClient.post<ApiResponse<SerieDto>>(
      SERIE_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/series
  update: async (dto: SerieDto): Promise<ApiResponse<SerieDto>> => {
    const { data } = await apiClient.put<ApiResponse<SerieDto>>(SERIE_URL, dto);
    return data;
  },

  // DELETE /api/v1/series/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${SERIE_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/series/buscar?serie={serie}
  buscarPorSerie: async (serie: string): Promise<ApiResponse<SerieDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<SerieDto[]>>(
      `${SERIE_URL}/buscar`,
      { params: { serie } }
    );
    return data;
  },

  // GET /api/v1/series/comprobante/{comprobanteId}
  buscarPorComprobante: async (
    comprobanteId: number
  ): Promise<ApiResponse<SerieDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<SerieDto[]>>(
      `${SERIE_URL}/comprobante/${comprobanteId}`
    );
    return data;
  },
};
