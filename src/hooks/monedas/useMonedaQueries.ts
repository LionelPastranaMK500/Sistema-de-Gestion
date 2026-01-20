import { useQuery } from "@tanstack/react-query";
import { monedasService } from "@/services/api/monedas.service";
import { MonedaDto } from "@/types/models";

export const useMonedaQueries = () => {
  // Listar todas las monedas
  const useListAll = () =>
    useQuery<MonedaDto[]>({
      queryKey: ["monedas", "list"],
      queryFn: async () => {
        const response = await monedasService.listAll();
        return response.data;
      },
    });

  // Obtener moneda por ID
  const useGetById = (id: number) =>
    useQuery<MonedaDto>({
      queryKey: ["monedas", "detail", id],
      queryFn: async () => {
        const response = await monedasService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  return {
    useListAll,
    useGetById,
  };
};
