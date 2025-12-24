import apiClient from "@/config/api";
import {
  ApiResponse,
  ApiPaginatedResponse,
  PaginationOptions,
  DEFAULT_PAGINATION,
} from "@/types/api";
import {
  AlmacenDto,
  AlmacenCreateDto,
  AlmacenConProductosDto,
} from "@/types/models";

const ALMACEN_URL = "/api/v1/almacen";

export const almacenesService = {
  // GET /api/v1/almacen
  listAll: async (): Promise<ApiResponse<AlmacenDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<AlmacenDto[]>>(
      ALMACEN_URL
    );
    return data;
  },

  // GET /api/v1/almacen/{id}
  getById: async (id: number): Promise<ApiResponse<AlmacenDto>> => {
    const { data } = await apiClient.get<ApiResponse<AlmacenDto>>(
      `${ALMACEN_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/almacen
  create: async (dto: AlmacenCreateDto): Promise<ApiResponse<AlmacenDto>> => {
    const { data } = await apiClient.post<ApiResponse<AlmacenDto>>(
      ALMACEN_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/almacen
  update: async (dto: AlmacenDto): Promise<ApiResponse<AlmacenDto>> => {
    const { data } = await apiClient.put<ApiResponse<AlmacenDto>>(
      ALMACEN_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/almacen/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${ALMACEN_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/almacen/search?q={query}&page={page}&size={size}&sort={sort}
  search: async (
    query: string,
    options: PaginationOptions = {}
  ): Promise<ApiPaginatedResponse<AlmacenDto>> => {
    const params = { ...DEFAULT_PAGINATION, ...options };
    const { data } = await apiClient.get<ApiPaginatedResponse<AlmacenDto>>(
      `${ALMACEN_URL}/search`,
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

  // GET /api/v1/almacen/{id}/productos
  obtenerAlmacenConProductos: async (
    id: number
  ): Promise<ApiResponse<AlmacenConProductosDto>> => {
    const { data } = await apiClient.get<ApiResponse<AlmacenConProductosDto>>(
      `${ALMACEN_URL}/${id}/productos`
    );
    return data;
  },

  // GET /api/v1/almacen/nombre/{nombre}/productos
  obtenerAlmacenConProductosByNombre: async (
    nombre: string
  ): Promise<ApiResponse<AlmacenConProductosDto>> => {
    const { data } = await apiClient.get<ApiResponse<AlmacenConProductosDto>>(
      `${ALMACEN_URL}/nombre/${nombre}/productos`
    );
    return data;
  },

  // GET /api/v1/almacen/productos/buscar?q={query}
  obtenerAlmacenesConProductosByNombre: async (
    query: string
  ): Promise<ApiResponse<AlmacenConProductosDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<AlmacenConProductosDto[]>>(
      `${ALMACEN_URL}/productos/buscar`,
      {
        params: { q: query },
      }
    );
    return data;
  },
};
