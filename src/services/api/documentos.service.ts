import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  DocumentoDto,
  DocumentoDetailDto,
  DocumentoCreateDto,
  DocumentoEmissionResponse,
  DocumentoCdrResponse,
} from "@/types/models";

// URL corregida a PLURAL (requerido por Backend)
const DOC_URL = "/api/v1/documentos";

export const documentosService = {
  // ADAPTADOR: listAll -> Backend: /page/sucursal/{id}
  // Tu frontend llama a listAll() sin argumentos.
  // Problema: El backend EXIGE sucursalId.
  // Solución temporal: Hardcodear sucursal 1 o pedirla.
  listAll: async (
    sucursalId: number = 1
  ): Promise<ApiResponse<DocumentoDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<any>>( // data.data es Page<DocumentoDto>
      `${DOC_URL}/page/sucursal/${sucursalId}`
    );

    // Mapeo manual para que tu UI vieja no se rompa
    const listaAdaptada = data.data.content.map((d: any) => ({
      ...d,
      id: d.documentoID,
      serie: d.serSummaryDto?.serie,
      clienteNombre: d.cliente?.razonSocial,
      tipoDocumento: d.tipDocumento?.descripcion,
      totalVenta: d.total,
    }));

    return { ...data, data: listaAdaptada };
  },

  // GET /api/v1/documentos/{id}
  getById: async (id: number): Promise<ApiResponse<DocumentoDetailDto>> => {
    // El backend devuelve el objeto directo, no ApiResponse.
    // Lo envolvemos artificialmente para que tu UI no falle.
    const { data } = await apiClient.get<any>(`${DOC_URL}/${id}`);

    const detalleAdaptado = {
      ...data,
      id: data.documentoID,
      detalles: data.detallesDto,
      cliente: data.clienteSummaryDto,
      moneda: data.monedaDto,
      // ... mapear resto de campos necesarios
    };

    return { success: true, message: "OK", data: detalleAdaptado };
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
