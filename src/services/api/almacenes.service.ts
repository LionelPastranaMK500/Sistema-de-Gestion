import api from "../api";
import { Almacen, Producto } from "@/services/generadorData";

export const almacenesService = {
  getAll: () => api.get<Almacen[]>("/api/v1/almacen"),

  create: (almacenData: Omit<Almacen, "id"> | Almacen) =>
    api.post<Almacen>("/api/v1/almacen", almacenData),

  search: (query: string) =>
    api.get<Almacen[]>(`/api/v1/almacen/search?q=${query}`),

  getProductos: (id: string | number) =>
    api.get<Producto[]>(`/api/v1/almacen/${id}/productos`),

  getProductosByNombre: (nombre: string) =>
    api.get<Producto[]>(`/api/v1/almacen/nombre/${nombre}/productos`),

  buscarProductos: (query: string) =>
    api.get<Producto[]>(`/api/v1/almacen/productos/buscar?q=${query}`),
};
