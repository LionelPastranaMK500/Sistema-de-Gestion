import api from "@/config/api";
import { VentaGenerada } from "@/types/services";
import { CdrResponse, EstadoResponse } from "@/types/services/ventas";

export const documentosService = {
  // POST /emision
  emitir: (payload: any) =>
    api.post<VentaGenerada>("/api/v1/documentos/emision", payload),

  // GET /{id}
  getById: (id: number) => api.get<VentaGenerada>(`/api/v1/documentos/${id}`),

  // GET /page/sucursal/{sucursalId}
  listarPorSucursal: (
    sucursalId: number,
    params: {
      usuarioId?: number;
      fecha?: string;
      q?: string;
      page?: number;
      size?: number;
      sort?: string;
    } = {}
  ) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get<any>(
      `/api/v1/documentos/page/sucursal/${sucursalId}${
        query ? `?${query}` : ""
      }`
    );
  },

  // GET /{id}/estado
  obtenerEstado: (id: number) =>
    api.get<EstadoResponse>(`/api/v1/documentos/${id}/estado`),

  // GET /{id}/cdr
  obtenerCdr: (id: number) =>
    api.get<CdrResponse>(`/api/v1/documentos/${id}/cdr`),
};
