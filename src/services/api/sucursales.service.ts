import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  SucursalDto,
  SucursalCreateDto,
  SucursalUpdateDto,
  SucursalDetailDto,
} from "@/types/models";

const SUCURSAL_URL = "/api/v1/sucursales";

export const sucursalesService = {
  // GET /api/v1/sucursales
  listAll: async (): Promise<ApiResponse<SucursalDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<SucursalDto[]>>(
      SUCURSAL_URL
    );
    return data;
  },

  // GET /api/v1/sucursales/{id}
  getById: async (id: number): Promise<ApiResponse<SucursalDto>> => {
    const { data } = await apiClient.get<ApiResponse<SucursalDto>>(
      `${SUCURSAL_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/sucursales
  create: async (dto: SucursalCreateDto): Promise<ApiResponse<SucursalDto>> => {
    const { data } = await apiClient.post<ApiResponse<SucursalDto>>(
      SUCURSAL_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/sucursales
  update: async (dto: SucursalUpdateDto): Promise<ApiResponse<SucursalDto>> => {
    const { data } = await apiClient.put<ApiResponse<SucursalDto>>(
      SUCURSAL_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/sucursales/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${SUCURSAL_URL}/${id}`
    );
    return data;
  },

  // ===========================================================================
  // MÉTODOS ESPECÍFICOS
  // ===========================================================================

  // GET /api/v1/sucursales/{id}/detalle
  getDetail: async (id: number): Promise<ApiResponse<SucursalDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<SucursalDetailDto>>(
      `${SUCURSAL_URL}/${id}/detalle`
    );
    return data;
  },
};
