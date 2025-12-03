import api from "@/config/api";
import { Serie } from "@/types/services";

export const seriesService = {
  // GET /
  getAll: () => api.get<Serie[]>("/api/v1/series"),

  // GET /{id}
  getById: (id: number) => api.get<Serie>(`/api/v1/series/${id}`),

  // POST /
  create: (data: Partial<Serie>) => api.post<Serie>("/api/v1/series", data),

  // PUT / (El backend recibe el ID dentro del DTO)
  update: (data: Partial<Serie>) => api.put<Serie>("/api/v1/series", data),

  // DELETE /{id}
  delete: (id: number) => api.delete<void>(`/api/v1/series/${id}`),

  // GET /buscar?serie=...
  buscarPorSerie: (serie: string) =>
    api.get<Serie[]>(`/api/v1/series/buscar?serie=${serie}`),

  // GET /comprobante/{comprobanteId}
  buscarPorComprobante: (comprobanteId: number) =>
    api.get<Serie[]>(`/api/v1/series/comprobante/${comprobanteId}`),
};
