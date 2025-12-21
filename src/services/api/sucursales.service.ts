import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  SucursalDto,
  SucursalCreateDto,
  SucursalUpdateDto,
  SucursalDetailDto,
  SucursalComprobanteConfigCommandDto,
  UsuarioSummaryDto,
} from "@/types/models";

const SUCURSAL_URL = "/api/v1/sucursal";

export const sucursalesService = {
  // GET /api/v1/sucursal
  listAll: async (): Promise<ApiResponse<SucursalDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<SucursalDto[]>>(
      SUCURSAL_URL
    );
    return data;
  },

  // GET /api/v1/sucursal/{id}
  getById: async (id: number): Promise<ApiResponse<SucursalDto>> => {
    const { data } = await apiClient.get<ApiResponse<SucursalDto>>(
      `${SUCURSAL_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/sucursal
  create: async (dto: SucursalCreateDto): Promise<ApiResponse<SucursalDto>> => {
    const { data } = await apiClient.post<ApiResponse<SucursalDto>>(
      SUCURSAL_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/sucursal
  update: async (dto: SucursalUpdateDto): Promise<ApiResponse<SucursalDto>> => {
    const { data } = await apiClient.put<ApiResponse<SucursalDto>>(
      SUCURSAL_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/sucursal/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${SUCURSAL_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/sucursal/{id}/detail
  getDetail: async (id: number): Promise<ApiResponse<SucursalDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<SucursalDetailDto>>(
      `${SUCURSAL_URL}/${id}/detail`
    );
    return data;
  },

  // GET /api/v1/sucursal/{id}/usuarios
  getUsuarios: async (
    id: number
  ): Promise<ApiResponse<UsuarioSummaryDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<UsuarioSummaryDto[]>>(
      `${SUCURSAL_URL}/${id}/usuarios`
    );
    return data;
  },

  // POST /api/v1/sucursal/{sucursalId}/asignar-usuario/{usuarioId}
  asignarUsuario: async (
    sucursalId: number,
    usuarioId: number
  ): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.post<ApiResponse<void>>(
      `${SUCURSAL_URL}/${sucursalId}/asignar-usuario/${usuarioId}`
    );
    return data;
  },

  // POST /api/v1/sucursal/{sucursalId}/remover-usuario/{usuarioId}
  removerUsuario: async (
    sucursalId: number,
    usuarioId: number
  ): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.post<ApiResponse<void>>(
      `${SUCURSAL_URL}/${sucursalId}/remover-usuario/${usuarioId}`
    );
    return data;
  },

  // PUT /api/v1/sucursal/comprobante/config
  updateConfigComprobante: async (
    dto: SucursalComprobanteConfigCommandDto
  ): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.put<ApiResponse<any>>(
      `${SUCURSAL_URL}/comprobante/config`,
      dto
    );
    return data;
  },
};
