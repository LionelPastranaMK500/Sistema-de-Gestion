import api from "@/config/api";

export const monedasService = {
  // GET /
  getAll: () => api.get<any[]>("/api/v1/moneda"),

  // GET /{id}
  getById: (id: number) => api.get<any>(`/api/v1/moneda/${id}`),

  // POST /
  create: (data: any) => api.post<any>("/api/v1/moneda", data),

  // PUT /
  update: (data: any) => api.put<any>("/api/v1/moneda", data),

  // DELETE /{id}
  delete: (id: number) => api.delete<void>(`/api/v1/moneda/${id}`),
};
