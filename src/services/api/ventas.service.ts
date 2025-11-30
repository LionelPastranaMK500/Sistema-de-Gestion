import apiClient from "@/config/api";
import { ApiPaginatedResponse, ApiResponse, SearchParams } from "@/types/api";
import { Venta, VentaPayload } from "@/types/models";

const BASE_URL = "/ventas";

export const ventasService = {
  getAll: async (
    params?: SearchParams
  ): Promise<ApiPaginatedResponse<Venta>> => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Venta>>(
      BASE_URL,
      {
        params,
      }
    );
    return data;
  },

  // OBTENER POR ID
  getById: async (id: number): Promise<Venta> => {
    const { data: response } = await apiClient.get<ApiResponse<Venta>>(
      `${BASE_URL}/${id}`
    );
    return response.data;
  },

  // CREAR
  create: async (payload: VentaPayload): Promise<Venta> => {
    const { data: response } = await apiClient.post<ApiResponse<Venta>>(
      BASE_URL,
      payload
    );
    return response.data;
  },

  // ANULAR
  anular: async (id: number, motivo: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>(`${BASE_URL}/${id}/anular`, {
      motivo,
    });
  },
};
