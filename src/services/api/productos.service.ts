import api from "@/config/api";
import { Producto } from "@/types/services";

export const productosService = {
  // GET /api/v1/producto
  getAll: () => api.get<Producto[]>("/api/v1/producto"),

  // GET /api/v1/producto/reporte?q=... (Búsqueda paginada)
  search: (params: { q?: string; page?: number; size?: number } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return api.get<any>(`/api/v1/producto/reporte${query ? `?${query}` : ""}`);
  },

  // GET /api/v1/producto/{id}/detail
  getDetail: (id: number) => api.get<Producto>(`/api/v1/producto/${id}/detail`),
};
