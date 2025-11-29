import api from "../api";
import { VentaGenerada } from "@/types/services";
import { CdrResponse, EstadoResponse } from "@/types/services/ventas";

export const documentosService = {
  emitir: (documentoData: Partial<VentaGenerada>) =>
    api.post<VentaGenerada>("/api/v1/documentos/emision", documentoData),

  getById: (id: string | number) =>
    api.get<VentaGenerada>(`/api/v1/documentos/${id}`),

  getEstado: (id: string | number) =>
    api.get<EstadoResponse>(`/api/v1/documentos/${id}/estado`),

  getCdr: (id: string | number) =>
    api.get<CdrResponse>(`/api/v1/documentos/${id}/cdr`),
};
