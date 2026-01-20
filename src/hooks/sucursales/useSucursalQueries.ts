import { useQuery } from "@tanstack/react-query";
import { sucursalesService } from "@/services/api/sucursales.service";
import { SucursalDto, SucursalDetailDto } from "@/types/models";

export const useSucursalQueries = () => {
  // Listar todas las sucursales
  const useListAll = () =>
    useQuery<SucursalDto[]>({
      queryKey: ["sucursales", "list"],
      queryFn: async () => {
        const response = await sucursalesService.listAll();
        return response.data;
      },
    });

  // Obtener sucursal por ID (Simple)
  const useGetById = (id: number) =>
    useQuery<SucursalDto>({
      queryKey: ["sucursales", "simple", id],
      queryFn: async () => {
        const response = await sucursalesService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  // Obtener detalle completo (incluye configOptions para formularios)
  const useGetDetail = (id: number) =>
    useQuery<SucursalDetailDto>({
      queryKey: ["sucursales", "detail", id],
      queryFn: async () => {
        const response = await sucursalesService.getDetail(id);
        return response.data;
      },
      enabled: !!id,
    });

  return {
    useListAll,
    useGetById,
    useGetDetail,
  };
};
