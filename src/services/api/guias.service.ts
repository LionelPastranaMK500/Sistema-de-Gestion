import api from "../api";
import { GuiaRemision } from "@/types/services";

export const guiasService = {
  getAll: () => api.get<GuiaRemision[]>("/api/v1/guia-remision"),

  create: (guiaData: Partial<GuiaRemision>) =>
    api.post<GuiaRemision>("/api/v1/guia-remision", guiaData),

  getById: (id: string | number) =>
    api.get<GuiaRemision>(`/api/v1/guia-remision/${id}`),

  update: (guiaData: Partial<GuiaRemision>) =>
    api.put<GuiaRemision>("/api/v1/guia-remision", guiaData),

  delete: (id: string | number) =>
    api.delete<void>(`/api/v1/guia-remision/${id}`),

  getDetailed: (id: string | number) =>
    api.get<GuiaRemision>(`/api/v1/guia-remision/search/detailed/${id}`),

  searchPaginated: (params: Record<string, string | number> = {}) => {
    const query = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return api.get<{ data: GuiaRemision[]; total: number }>(
      `/api/v1/guia-remision/search/page${query ? `?${query}` : ""}`
    );
  },
};
