import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  DocumentoDto,
  DocumentoDetailDto,
  DocumentoCreateDto,
  DocumentoEmissionResponse,
  DocumentoCdrResponse,
} from "@/types/models";
import { EstadoDocumento } from "@/types/models/comunes";

const DOC_URL = "/api/v1/documento";

export const documentosService = {
  // GET /api/v1/documento
  listAll: async (): Promise<ApiResponse<DocumentoDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<DocumentoDto[]>>(DOC_URL);
    return data;
  },

  // GET /api/v1/documento/{id}
  getById: async (id: number): Promise<ApiResponse<DocumentoDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<DocumentoDetailDto>>(
      `${DOC_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/documento (Crea el documento pero NO lo envía a SUNAT automáticamente, usualmente)
  create: async (
    dto: DocumentoCreateDto
  ): Promise<ApiResponse<DocumentoDto>> => {
    const { data } = await apiClient.post<ApiResponse<DocumentoDto>>(
      DOC_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/documento/{id} (Borrado lógico o físico si es borrador)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${DOC_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/documento/emitir/{id}
  emitir: async (
    id: number
  ): Promise<ApiResponse<DocumentoEmissionResponse>> => {
    const { data } = await apiClient.post<
      ApiResponse<DocumentoEmissionResponse>
    >(`${DOC_URL}/emitir/${id}`);
    return data;
  },

  // POST /api/v1/documento/anular/{id}
  anular: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.post<ApiResponse<void>>(
      `${DOC_URL}/anular/${id}`
    );
    return data;
  },

  // GET /api/v1/documento/cdr/{id}
  consultarCdr: async (
    id: number
  ): Promise<ApiResponse<DocumentoCdrResponse>> => {
    const { data } = await apiClient.get<ApiResponse<DocumentoCdrResponse>>(
      `${DOC_URL}/cdr/${id}`
    );
    return data;
  },

  // GET /api/v1/documento/buscar/estado/{estado}
  buscarPorEstado: async (
    estado: EstadoDocumento
  ): Promise<ApiResponse<DocumentoDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<DocumentoDto[]>>(
      `${DOC_URL}/buscar/estado/${estado}`
    );
    return data;
  },

  // GET /api/v1/documento/buscar/fecha?inicio=...&fin=...
  buscarPorRangoFecha: async (
    inicio: string,
    fin: string
  ): Promise<ApiResponse<DocumentoDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<DocumentoDto[]>>(
      `${DOC_URL}/buscar/fecha`,
      { params: { inicio, fin } }
    );
    return data;
  },

  // GET /api/v1/documento/imprimir/{id}
  imprimir: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`${DOC_URL}/imprimir/${id}`, {
      responseType: "blob",
    });
    return response.data;
  },
};
