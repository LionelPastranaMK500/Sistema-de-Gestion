import api from "../api";

export interface Chofer {
  id?: string | number;
  dni: string;
  nombre: string;
  licencia: string;
  [key: string]: any;
}

export interface Vehiculo {
  id?: string | number;
  placa: string;
  marca?: string;
  modelo?: string;
  [key: string]: any;
}

export const choferesService = {
  getAll: () => api.get<Chofer[]>("/api/v1/chofer"),

  create: (choferData: Chofer) =>
    api.post<Chofer>("/api/v1/chofer", choferData),

  getByDni: (dni: string) =>
    api.get<Chofer>(`/api/v1/chofer/search/dni/${dni}`),

  searchPaginated: (params: Record<string, string | number> = {}) => {
    const query = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return api.get<{ data: Chofer[]; total: number }>(
      `/api/v1/chofer/search/page${query ? `?${query}` : ""}`
    );
  },

  searchList: (params: Record<string, string | number> = {}) => {
    const query = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return api.get<Chofer[]>(
      `/api/v1/chofer/search/list${query ? `?${query}` : ""}`
    );
  },
};

export const vehiculosService = {
  getAll: () => api.get<Vehiculo[]>("/api/v1/vehiculo"),

  create: (vehiculoData: Vehiculo) =>
    api.post<Vehiculo>("/api/v1/vehiculo", vehiculoData),

  createBatch: (vehiculos: Vehiculo[]) =>
    api.post<Vehiculo[]>("/api/v1/vehiculo/batch", vehiculos),

  getByPlaca: (placa: string) =>
    api.get<Vehiculo>(`/api/v1/vehiculo/search/placa/${placa}`),
};
