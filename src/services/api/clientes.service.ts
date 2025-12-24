import apiClient from "@/config/api";
import {
  ApiResponse,
  ApiPaginatedResponse,
  DEFAULT_PAGINATION,
  PaginationOptions,
} from "@/types/api";
import {
  ClienteDto,
  ClienteCreateDto,
  ClienteUpdateDto,
  ClienteDetailDto,
  ClienteLookupResult,
} from "@/types/models";

const CLIENTES_URL = "/api/v1/clientes";

export const clientesService = {
  // GET /api/v1/clientes
  getAll: async (
    query: string = "",
    options: PaginationOptions = {}
  ): Promise<ApiPaginatedResponse<ClienteDto>> => {
    const params = { ...DEFAULT_PAGINATION, ...options };

    const { data } = await apiClient.get<ApiPaginatedResponse<ClienteDto>>(
      CLIENTES_URL,
      {
        params: {
          q: query,
          page: params.page,
          size: params.size,
          sort: params.sort,
        },
      }
    );
    return data;
  },

  // GET /api/v1/clientes/reporte
  getReporte: async (
    query: string = "",
    options: PaginationOptions = {}
  ): Promise<ApiPaginatedResponse<ClienteDto>> => {
    const params = { ...DEFAULT_PAGINATION, ...options };

    const { data } = await apiClient.get<ApiPaginatedResponse<ClienteDto>>(
      `${CLIENTES_URL}/reporte`,
      {
        params: {
          q: query,
          page: params.page,
          size: params.size,
          sort: params.sort,
        },
      }
    );
    return data;
  },

  // GET /api/v1/clientes/{id}
  getById: async (id: number): Promise<ApiResponse<ClienteDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<ClienteDetailDto>>(
      `${CLIENTES_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/clientes
  create: async (dto: ClienteCreateDto): Promise<ApiResponse<ClienteDto>> => {
    const { data } = await apiClient.post<ApiResponse<ClienteDto>>(
      CLIENTES_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/clientes/{id}
  update: async (
    id: number,
    dto: ClienteUpdateDto
  ): Promise<ApiResponse<ClienteDto>> => {
    const { data } = await apiClient.put<ApiResponse<ClienteDto>>(
      `${CLIENTES_URL}/${id}`,
      dto
    );
    return data;
  },

  // DELETE /api/v1/clientes/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${CLIENTES_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/clientes/consulta
  consultarRuc: async (numero: string): Promise<ClienteLookupResult> => {
    const { data } = await apiClient.get<ClienteLookupResult>(
      `${CLIENTES_URL}/consulta`,
      {
        params: { numero },
      }
    );
    return data;
  },
};
