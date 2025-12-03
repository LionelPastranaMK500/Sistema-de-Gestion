import api from "@/config/api";
import { Cliente } from "@/types/services";

export const clientesService = {
  // GET /
  getAll: (
    params: { q?: string; page?: number; size?: number; sort?: string } = {}
  ) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get<any>(`/api/v1/clientes${query ? `?${query}` : ""}`);
  },

  // GET /reporte
  getReporte: (
    params: { q?: string; page?: number; size?: number; sort?: string } = {}
  ) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get<any>(`/api/v1/clientes/reporte${query ? `?${query}` : ""}`);
  },

  // GET /{id}
  getById: (id: number) => api.get<Cliente>(`/api/v1/clientes/${id}`),

  // POST /
  create: (data: Partial<Cliente>) =>
    api.post<Cliente>("/api/v1/clientes", data),

  // PUT /{id}
  update: (id: number, data: Partial<Cliente>) =>
    api.put<Cliente>(`/api/v1/clientes/${id}`, data),

  // DELETE /{id}
  delete: (id: number) => api.delete<void>(`/api/v1/clientes/${id}`),

  // GET /consulta?numero=...
  consultarDocumento: (numero: string) =>
    api.get<any>(`/api/v1/clientes/consulta?numero=${numero}`),
};
