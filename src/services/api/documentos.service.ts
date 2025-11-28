import api from "../api";
import { VentaGenerada } from "@/services/generadorData";

interface CdrResponse {
  cdrBase64: string;
  numero: string;
  estado: string;
}

interface EstadoResponse {
  estado: string;
  motivo?: string;
}

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
