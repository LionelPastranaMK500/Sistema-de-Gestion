import api from "../api";
import { Producto } from "@/services/generadorData";

export const productosService = {
  getAll: () => api.get<Producto[]>("/api/v1/producto"),

  create: (productoData: Producto) =>
    api.post<Producto>("/api/v1/producto", productoData),

  getById: (id: string | number) => api.get<Producto>(`/api/v1/producto/${id}`),

  getDetail: (id: string | number) =>
    api.get<Producto>(`/api/v1/producto/${id}/detail`),

  update: (productoData: Producto) =>
    api.put<Producto>("/api/v1/producto", productoData),

  delete: (id: string | number) => api.delete<void>(`/api/v1/producto/${id}`),

  // Asumimos que summary retorna algo específico, si no, any
  getSummary: () => api.get<any>("/api/v1/producto/summary"),
};
