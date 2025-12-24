import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  VehiculoDto,
  VehiculoCreateDto,
  VehiculoUpdateDto,
} from "@/types/models";

const VEHICULO_URL = "/api/v1/vehiculo";

export const vehiculosService = {
  // GET /api/v1/vehiculo
  listAll: async (): Promise<ApiResponse<VehiculoDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<VehiculoDto[]>>(
      VEHICULO_URL
    );
    return data;
  },

  // GET /api/v1/vehiculo/{id}
  getById: async (id: number): Promise<ApiResponse<VehiculoDto>> => {
    const { data } = await apiClient.get<ApiResponse<VehiculoDto>>(
      `${VEHICULO_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/vehiculo
  create: async (dto: VehiculoCreateDto): Promise<ApiResponse<VehiculoDto>> => {
    const { data } = await apiClient.post<ApiResponse<VehiculoDto>>(
      VEHICULO_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/vehiculo
  update: async (dto: VehiculoUpdateDto): Promise<ApiResponse<VehiculoDto>> => {
    const { data } = await apiClient.put<ApiResponse<VehiculoDto>>(
      VEHICULO_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/vehiculo/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${VEHICULO_URL}/${id}`
    );
    return data;
  },

  // ===========================================================================
  // MÉTODOS ESPECÍFICOS DE VEHÍCULO
  // ===========================================================================

  // POST /api/v1/vehiculo/batch
  createBatch: async (
    dtos: VehiculoCreateDto[]
  ): Promise<ApiResponse<VehiculoDto[]>> => {
    const { data } = await apiClient.post<ApiResponse<VehiculoDto[]>>(
      `${VEHICULO_URL}/batch`,
      dtos
    );
    return data;
  },

  // GET /api/v1/vehiculo/search/placa/{placa}
  getByPlaca: async (placa: string): Promise<ApiResponse<VehiculoDto>> => {
    const { data } = await apiClient.get<ApiResponse<VehiculoDto>>(
      `${VEHICULO_URL}/search/placa/${placa}`
    );
    return data;
  },
};
