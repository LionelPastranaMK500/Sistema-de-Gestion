import api from "../api";
import { Cliente } from "@/services/generadorData";

export const clientesService = {
  getAll: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get<Cliente[]>(`/api/v1/clientes${query ? `?${query}` : ""}`);
  },

  create: (clienteData: Cliente) =>
    api.post<Cliente>("/api/v1/clientes", clienteData),

  getById: (id: string | number) => api.get<Cliente>(`/api/v1/clientes/${id}`),

  update: (id: string | number, clienteData: Partial<Cliente>) =>
    api.put<Cliente>(`/api/v1/clientes/${id}`, clienteData),

  delete: (id: string | number) => api.delete<void>(`/api/v1/clientes/${id}`),

  consultarDocumento: (numero: string) =>
    api.get<Cliente>(`/api/v1/clientes/consulta?numero=${numero}`),
};
