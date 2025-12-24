import apiClient from "@/config/api";
import {
  ApiResponse,
  ApiPaginatedResponse,
  PaginationOptions,
  DEFAULT_PAGINATION,
} from "@/types/api";
import {
  ProductoDto,
  ProductoDetailDto,
  ProductoCreateDto,
  ProductoUpdateDto,
  ProductoSummaryDto,
} from "@/types/models";

const PRODUCTO_URL = "/api/v1/producto";

export const productosService = {
  // ===========================================================================
  // CRUD BÁSICO
  // ===========================================================================

  // GET /api/v1/producto
  listAll: async (): Promise<ApiResponse<ProductoDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ProductoDto[]>>(
      PRODUCTO_URL
    );
    return data;
  },

  // GET /api/v1/producto/{id}
  getById: async (id: number): Promise<ApiResponse<ProductoDto>> => {
    const { data } = await apiClient.get<ApiResponse<ProductoDto>>(
      `${PRODUCTO_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/producto
  create: async (dto: ProductoCreateDto): Promise<ApiResponse<ProductoDto>> => {
    const { data } = await apiClient.post<ApiResponse<ProductoDto>>(
      PRODUCTO_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/producto
  // Update sin ID en URL, el ID viaja dentro del DTO
  update: async (dto: ProductoUpdateDto): Promise<ApiResponse<ProductoDto>> => {
    const { data } = await apiClient.put<ApiResponse<ProductoDto>>(
      PRODUCTO_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/producto/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${PRODUCTO_URL}/${id}`
    );
    return data;
  },

  // ===========================================================================
  // REPORTES Y VISTAS ESPECÍFICAS
  // ===========================================================================

  // GET /api/v1/producto/reporte?q={q}&page={page}&size={size}&sort={sort}
  getReporte: async (
    // Filtro opcional
    filters: { q?: string } = {},
    options: PaginationOptions = {}
  ): Promise<ApiPaginatedResponse<ProductoDto>> => {
    const params = { ...DEFAULT_PAGINATION, ...options };

    const { data } = await apiClient.get<ApiPaginatedResponse<ProductoDto>>(
      `${PRODUCTO_URL}/reporte`,
      {
        params: {
          q: filters.q,
          page: params.page,
          size: params.size,
          sort: params.sort,
        },
      }
    );
    return data;
  },

  // GET /api/v1/producto/{id}/detail
  getDetail: async (id: number): Promise<ApiResponse<ProductoDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<ProductoDetailDto>>(
      `${PRODUCTO_URL}/${id}/detail`
    );
    return data;
  },

  // GET /api/v1/producto/summary
  listSummary: async (): Promise<ApiResponse<ProductoSummaryDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ProductoSummaryDto[]>>(
      `${PRODUCTO_URL}/summary`
    );
    return data;
  },
};
