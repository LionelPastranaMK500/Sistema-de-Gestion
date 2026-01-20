import { useQuery } from "@tanstack/react-query";
import { guiasService } from "@/services/api/guias.service";
import { PaginationOptions } from "@/types/api";
import { GuiaRemisionDto, GuiaRemisionDetailDto } from "@/types/models";

export const useGuiaQueries = () => {
  // Listar todas las guías (versión simple)
  const useListAll = () =>
    useQuery<GuiaRemisionDto[]>({
      queryKey: ["guias", "list"],
      queryFn: async () => {
        const response = await guiasService.listAll();
        return response.data;
      },
    });

  // Obtener detalle básico por ID
  const useGetById = (id: number) =>
    useQuery<GuiaRemisionDto>({
      queryKey: ["guias", "simple", id],
      queryFn: async () => {
        const response = await guiasService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  // Obtener detalle completo (con productos, transportistas, etc.)
  const useGetDetailedById = (id: number) =>
    useQuery<GuiaRemisionDetailDto>({
      queryKey: ["guias", "detailed", id],
      queryFn: async () => {
        const response = await guiasService.getDetailedById(id);
        return response.data;
      },
      enabled: !!id,
    });

  // Búsqueda paginada con filtros obligatorios de negocio
  const useSearchPage = (
    filters: {
      usuarioId: number;
      sucursalId: number;
      clienteId?: number;
    },
    options: PaginationOptions = {},
  ) =>
    useQuery({
      queryKey: ["guias", "page", filters, options],
      queryFn: () => guiasService.searchPage(filters, options),
      enabled: !!filters.usuarioId && !!filters.sucursalId,
    });

  return {
    useListAll,
    useGetById,
    useGetDetailedById,
    useSearchPage,
  };
};
