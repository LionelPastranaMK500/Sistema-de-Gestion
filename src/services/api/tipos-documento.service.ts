import api from "@/config/api";

export const tiposDocumentoService = {
  // GET /
  getAll: () => api.get<any[]>("/api/v1/tipdoc"),

  // GET /{id}
  getById: (id: number) => api.get<any>(`/api/v1/tipdoc/${id}`),

  // POST /
  create: (data: any) => api.post<any>("/api/v1/tipdoc", data),

  // PUT /
  update: (data: any) => api.put<any>("/api/v1/tipdoc", data),

  // DELETE /{id}
  delete: (id: number) => api.delete<void>(`/api/v1/tipdoc/${id}`),
};
