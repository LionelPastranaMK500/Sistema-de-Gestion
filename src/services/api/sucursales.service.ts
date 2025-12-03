import api from "@/config/api";
import { Sucursal } from "@/types/services";

export const sucursalesService = {
  // GET /
  getAll: () => api.get<Sucursal[]>("/api/v1/sucursales"),

  // GET /{id}
  getById: (id: number) => api.get<Sucursal>(`/api/v1/sucursales/${id}`),

  // POST /
  create: (data: Partial<Sucursal>) =>
    api.post<Sucursal>("/api/v1/sucursales", data),

  // PUT / (DTO en body)
  update: (data: Partial<Sucursal>) =>
    api.put<Sucursal>("/api/v1/sucursales", data),

  // DELETE /{id}
  delete: (id: number) => api.delete<void>(`/api/v1/sucursales/${id}`),

  // GET /{id}/detalle
  getDetalle: (id: number) =>
    api.get<Sucursal>(`/api/v1/sucursales/${id}/detalle`),
};
