import { useQuery } from "@tanstack/react-query";
import { almacenesService } from "@/services/api/almacenes.service";
import { PaginationOptions } from "@/types/api";

export const useAlmacenesQueries = () => {
  const useListAll = () =>
    useQuery({
      queryKey: ["almacenes", "list"],
      queryFn: () => almacenesService.listAll(),
      select: (response) => response.data,
    });

  const useGetById = (id: number) =>
    useQuery({
      queryKey: ["almacenes", "detail", id],
      queryFn: () => almacenesService.getById(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  const useSearch = (query: string, options: PaginationOptions = {}) =>
    useQuery({
      queryKey: ["almacenes", "search", query, options],
      queryFn: () => almacenesService.search(query, options),
      enabled: query.length > 0,
    });

  const useAlmacenConProductos = (id: number) =>
    useQuery({
      queryKey: ["almacenes", "productos", id],
      queryFn: () => almacenesService.obtenerAlmacenConProductos(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  return {
    useListAll,
    useGetById,
    useSearch,
    useAlmacenConProductos,
  };
};
