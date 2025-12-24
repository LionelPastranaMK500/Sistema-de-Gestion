import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { TipoEnvioDto, TipoEnvioCreateDto } from "@/types/models";

const TIPO_ENVIO_URL = "/api/v1/tipoenvios";

export const tipoEnvioService = {
  // GET /api/v1/tipoenvios
  listAll: async (): Promise<ApiResponse<TipoEnvioDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<TipoEnvioDto[]>>(
      TIPO_ENVIO_URL
    );
    return data;
  },

  // GET /api/v1/tipoenvios/{id}
  getById: async (id: number): Promise<ApiResponse<TipoEnvioDto>> => {
    const { data } = await apiClient.get<ApiResponse<TipoEnvioDto>>(
      `${TIPO_ENVIO_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/tipoenvios
  create: async (
    dto: TipoEnvioCreateDto
  ): Promise<ApiResponse<TipoEnvioDto>> => {
    const { data } = await apiClient.post<ApiResponse<TipoEnvioDto>>(
      TIPO_ENVIO_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/tipoenvios
  update: async (dto: TipoEnvioDto): Promise<ApiResponse<TipoEnvioDto>> => {
    const { data } = await apiClient.put<ApiResponse<TipoEnvioDto>>(
      TIPO_ENVIO_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/tipoenvios/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${TIPO_ENVIO_URL}/${id}`
    );
    return data;
  },
};
