import apiClient from "@/config/api";
import {
  ApiPaginatedResponse,
  DEFAULT_PAGINATION,
  PaginationOptions,
} from "@/types/api";
import {
  DocumentoDto,
  DocumentoDetailDto,
  DocumentoCreateDto,
  DocumentoEmissionResponse,
  DocumentoCdrResponse,
  DocumentoEstadoResponse,
} from "@/types/models";

const DOC_URL = "/api/v1/documentos";

export const documentosService = {
  // POST /api/v1/documentos/emision
  emitir: async (
    dto: DocumentoCreateDto
  ): Promise<DocumentoEmissionResponse> => {
    const { data } = await apiClient.post<DocumentoEmissionResponse>(
      `${DOC_URL}/emision`,
      dto
    );
    return data;
  },

  // GET /api/v1/documentos/{id}
  getById: async (id: number): Promise<DocumentoDetailDto> => {
    const { data } = await apiClient.get<DocumentoDetailDto>(
      `${DOC_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/documentos/page/sucursal/{sucursalId}
  listarPorSucursal: async (
    sucursalId: number,
    filters: {
      usuarioId?: number;
      fecha?: string;
      q?: string;
    } = {},
    options: PaginationOptions = {}
  ): Promise<ApiPaginatedResponse<DocumentoDto>> => {
    const params = { ...DEFAULT_PAGINATION, ...options };
    const { data } = await apiClient.get<ApiPaginatedResponse<DocumentoDto>>(
      `${DOC_URL}/page/sucursal/${sucursalId}`,
      {
        params: {
          ...filters,
          page: params.page,
          size: params.size,
          sort: params.sort,
        },
      }
    );
    return data;
  },

  // GET /api/v1/documentos/{id}/estado
  obtenerEstado: async (id: number): Promise<DocumentoEstadoResponse> => {
    const { data } = await apiClient.get<DocumentoEstadoResponse>(
      `${DOC_URL}/${id}/estado`
    );
    return data;
  },

  // GET /api/v1/documentos/{id}/cdr
  obtenerCdr: async (id: number): Promise<DocumentoCdrResponse> => {
    const { data } = await apiClient.get<DocumentoCdrResponse>(
      `${DOC_URL}/${id}/cdr`
    );
    return data;
  },
};
