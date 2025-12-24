import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { TipoClienteDto, TipoClienteCreateDto } from "@/types/models";

const TIPOCLIENTE_URL = "/api/v1/tipcliente";

export const tipoClienteService = {
  // GET /api/v1/tipcliente
  listAll: async (): Promise<ApiResponse<TipoClienteDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<TipoClienteDto[]>>(
      TIPOCLIENTE_URL
    );
    return data;
  },

  // GET /api/v1/tipcliente/{id}
  getById: async (id: number): Promise<ApiResponse<TipoClienteDto>> => {
    const { data } = await apiClient.get<ApiResponse<TipoClienteDto>>(
      `${TIPOCLIENTE_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/tipcliente
  create: async (
    dto: TipoClienteCreateDto
  ): Promise<ApiResponse<TipoClienteDto>> => {
    const { data } = await apiClient.post<ApiResponse<TipoClienteDto>>(
      TIPOCLIENTE_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/tipcliente
  update: async (dto: TipoClienteDto): Promise<ApiResponse<TipoClienteDto>> => {
    const { data } = await apiClient.put<ApiResponse<TipoClienteDto>>(
      TIPOCLIENTE_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/tipcliente/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${TIPOCLIENTE_URL}/${id}`
    );
    return data;
  },
};
