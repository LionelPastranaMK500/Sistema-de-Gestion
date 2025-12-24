import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { TipoDocumentoDto, TipoDocumentoCreateDto } from "@/types/models";

const TIPODOC_URL = "/api/v1/tipdoc";

export const tipoDocumentoService = {
  // GET /api/v1/tipdoc
  listAll: async (): Promise<ApiResponse<TipoDocumentoDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<TipoDocumentoDto[]>>(
      TIPODOC_URL
    );
    return data;
  },

  // GET /api/v1/tipdoc/{id}
  getById: async (id: number): Promise<ApiResponse<TipoDocumentoDto>> => {
    const { data } = await apiClient.get<ApiResponse<TipoDocumentoDto>>(
      `${TIPODOC_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/tipdoc
  create: async (
    dto: TipoDocumentoCreateDto
  ): Promise<ApiResponse<TipoDocumentoDto>> => {
    const { data } = await apiClient.post<ApiResponse<TipoDocumentoDto>>(
      TIPODOC_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/tipdoc
  update: async (
    dto: TipoDocumentoDto
  ): Promise<ApiResponse<TipoDocumentoDto>> => {
    const { data } = await apiClient.put<ApiResponse<TipoDocumentoDto>>(
      TIPODOC_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/tipdoc/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${TIPODOC_URL}/${id}`
    );
    return data;
  },
};
