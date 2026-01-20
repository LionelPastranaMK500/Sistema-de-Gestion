import { useQuery } from "@tanstack/react-query";
import { unidadMedidaService } from "@/services/api/unidadMedida.service";
import { UnidadMedidaDto } from "@/types/models";

export const useUnidadMedidaQueries = () => {
  // Listar todas las unidades de medida
  const useListAll = () =>
    useQuery<UnidadMedidaDto[]>({
      queryKey: ["unidad-medida", "list"],
      queryFn: async () => {
        const response = await unidadMedidaService.listAll();
        return response.data;
      },
    });

  // Obtener unidad de medida por ID
  const useGetById = (id: number) =>
    useQuery<UnidadMedidaDto>({
      queryKey: ["unidad-medida", "detail", id],
      queryFn: async () => {
        const response = await unidadMedidaService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  return {
    useListAll,
    useGetById,
  };
};
