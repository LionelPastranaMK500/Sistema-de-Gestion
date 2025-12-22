import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  ClienteDto,
  ClienteDetailDto,
  ClienteCreateDto,
  ClienteUpdateDto,
  ClienteLookupResult,
} from "@/types/models";

const CLIENTE_URL = "/api/v1/clientes";

export const clientesService = {
  // GET /api/v1/clientes
  // Devuelve Page<ClienteDto>
  listAll: async (params?: any): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.get<ApiResponse<any>>(CLIENTE_URL, {
      params,
    });
    return data;
  },

  // GET /api/v1/clientes/reporte
  getReporte: async (params?: any): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${CLIENTE_URL}/reporte`,
      { params }
    );
    return data;
  },

  // GET /api/v1/clientes/{id}
  getById: async (id: number): Promise<ApiResponse<ClienteDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<ClienteDetailDto>>(
      `${CLIENTE_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/clientes
  create: async (dto: ClienteCreateDto): Promise<ApiResponse<ClienteDto>> => {
    const { data } = await apiClient.post<ApiResponse<ClienteDto>>(
      CLIENTE_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/clientes/{id}
  update: async (dto: ClienteUpdateDto): Promise<ApiResponse<ClienteDto>> => {
    const { data } = await apiClient.put<ApiResponse<ClienteDto>>(
      `${CLIENTE_URL}/${dto.id}`,
      dto
    );
    return data;
  },

  // DELETE /api/v1/clientes/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${CLIENTE_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/clientes/consulta?numero={numero}
  consultar: async (numero: string): Promise<ClienteLookupResult> => {
    const { data } = await apiClient.get<ClienteLookupResult>(
      `${CLIENTE_URL}/consulta`,
      { params: { numero } }
    );
    return data;
  },
};
