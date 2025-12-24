import apiClient from "@/config/api";
import {
  ApiResponse,
  ApiPaginatedResponse,
  PaginationOptions,
  DEFAULT_PAGINATION,
} from "@/types/api";
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
  getById: async (id: number): Promise<ApiResponse<GuiaRemisionDto>> => {
    const { data } = await apiClient.get<ApiResponse<GuiaRemisionDto>>(
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

  // ===========================================================================
  // MÉTODOS DE BÚSQUEDA
  // ===========================================================================

  // GET /api/v1/guia-remision/search/detailed/{id}
  getDetailedById: async (
    id: number
  ): Promise<ApiResponse<GuiaRemisionDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<GuiaRemisionDetailDto>>(
      `${GUIA_URL}/search/detailed/${id}`
    );
    return data;
  },

  // GET /api/v1/guia-remision/search/page
  searchPage: async (
    filters: {
      usuarioId: number;
      sucursalId: number;
      clienteId?: number;
    },
    options: PaginationOptions = {}
  ): Promise<ApiPaginatedResponse<GuiaRemisionDto>> => {
    const params = { ...DEFAULT_PAGINATION, ...options };

    const { data } = await apiClient.get<ApiPaginatedResponse<GuiaRemisionDto>>(
      `${GUIA_URL}/search/page`,
      {
        params: {
          ...filters,
          page: params.page,
          size: params.size,
          sort: params.sort,
        },
      }
    );
    return data;
  },
};
