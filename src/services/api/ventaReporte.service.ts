import apiClient from "@/config/api";
import {
  ApiResponse,
  ApiPaginatedResponse,
  PaginationOptions,
  DEFAULT_PAGINATION,
} from "@/types/api";
import { VentaReporteFilterDto, VentaReporteDto } from "@/types/models/";

const REPORTE_URL = "/api/v1/reportes/ventas";

export const ventaReporteService = {
  // POST /api/v1/reportes/ventas/paginado
  obtenerReportePaginado: async (
    filtros: VentaReporteFilterDto,
    options: PaginationOptions = {}
  ): Promise<ApiPaginatedResponse<VentaReporteDto>> => {
    const params = { ...DEFAULT_PAGINATION, ...options };

    const { data } = await apiClient.post<
      ApiPaginatedResponse<VentaReporteDto>
    >(`${REPORTE_URL}/paginado`, filtros, {
      params: {
        page: params.page,
        size: params.size,
        sort: params.sort,
      },
    });
    return data;
  },

  // POST /api/v1/reportes/ventas/completo
  obtenerReporteCompleto: async (
    filtros: VentaReporteFilterDto
  ): Promise<ApiResponse<VentaReporteDto[]>> => {
    const { data } = await apiClient.post<ApiResponse<VentaReporteDto[]>>(
      `${REPORTE_URL}/completo`,
      filtros
    );
    return data;
  },
};
