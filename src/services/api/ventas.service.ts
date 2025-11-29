import api from "../api";
import { VentaGenerada } from "@/types/services";
import { CdrResponse, EstadoResponse } from "@/types/services/ventas";

export const ventasService = {
  emitir: (ventaData: Partial<VentaGenerada>) =>
    api.post<VentaGenerada>("/api/v1/documentos/emision", ventaData),

  getById: (id: string | number) =>
    api.get<VentaGenerada>(`/api/v1/documentos/${id}`),

  getEstado: (id: string | number) =>
    api.get<EstadoResponse>(`/api/v1/documentos/${id}/estado`),

  getCdr: (id: string | number) =>
    api.get<CdrResponse>(`/api/v1/documentos/${id}/cdr`),

  listar: (params: Record<string, string | number> = {}) => {
    const query = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return api.get<VentaGenerada[]>(
      `/api/v1/documentos${query ? `?${query}` : ""}`
    );
  },

  anular: (id: string | number, motivo: string) =>
    api.post<{ success: boolean }>(`/api/v1/documentos/${id}/anular`, {
      motivo,
    }),
};
