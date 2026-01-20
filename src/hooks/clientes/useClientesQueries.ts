import { useQuery } from "@tanstack/react-query";
import { clientesService } from "@/services/api/clientes.service";
import { PaginationOptions } from "@/types/api";

export const useClientesQueries = () => {
  // Obtener lista general con paginación y búsqueda
  const useGetAll = (query: string = "", options: PaginationOptions = {}) =>
    useQuery({
      queryKey: ["clientes", "list", query, options],
      queryFn: () => clientesService.getAll(query, options),
    });

  // Obtener reporte de clientes (usado en módulos de gestión)
  const useGetReporte = (query: string = "", options: PaginationOptions = {}) =>
    useQuery({
      queryKey: ["clientes", "reporte", query, options],
      queryFn: () => clientesService.getReporte(query, options),
    });

  // Obtener detalle completo de un cliente
  const useGetById = (id: number) =>
    useQuery({
      queryKey: ["clientes", "detail", id],
      queryFn: () => clientesService.getById(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  // Consulta externa de RUC/DNI (Lookup)
  // Se activa automáticamente cuando el número tiene longitud válida
  const useConsultarRuc = (numero: string) =>
    useQuery({
      queryKey: ["clientes", "consulta", numero],
      queryFn: () => clientesService.consultarRuc(numero),
      enabled: numero.length === 8 || numero.length === 11,
      retry: false,
      staleTime: 1000 * 60 * 10, // Cacheamos el resultado de consulta por 10 min
    });

  return {
    useGetAll,
    useGetReporte,
    useGetById,
    useConsultarRuc,
  };
};
