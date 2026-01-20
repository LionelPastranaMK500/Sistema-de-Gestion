import { useQuery } from "@tanstack/react-query";
import { choferService } from "@/services/api/chofer.service";
import { PaginationOptions } from "@/types/api";

export const useChoferQueries = () => {
  const useListAll = () =>
    useQuery({
      queryKey: ["choferes", "list"],
      queryFn: () => choferService.listAll(),
      select: (response) => response.data,
    });

  const useGetById = (id: number) =>
    useQuery({
      queryKey: ["choferes", "detail", id],
      queryFn: () => choferService.getById(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  const useGetByDni = (dni: string) =>
    useQuery({
      queryKey: ["choferes", "search", "dni", dni],
      queryFn: () => choferService.getByDni(dni),
      enabled: dni.length > 0,
      select: (response) => response.data,
    });

  const useSearchPage = (
    filters: { nombre?: string; dni?: string },
    options: PaginationOptions = {},
  ) =>
    useQuery({
      queryKey: ["choferes", "page", filters, options],
      queryFn: () => choferService.searchPage(filters, options),
    });

  const useListByNombreOrDni = (params: { nombre?: string; dni?: string }) =>
    useQuery({
      queryKey: ["choferes", "list-filtered", params],
      queryFn: () => choferService.listByNombreOrDni(params),
      enabled: !!params.nombre || !!params.dni,
      select: (response) => response.data,
    });

  return {
    useListAll,
    useGetById,
    useGetByDni,
    useSearchPage,
    useListByNombreOrDni,
  };
};
