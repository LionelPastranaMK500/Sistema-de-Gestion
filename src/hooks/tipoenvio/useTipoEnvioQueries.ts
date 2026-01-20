import { useQuery } from "@tanstack/react-query";
import { tipoEnvioService } from "@/services/api/tipoEnvio.service";
import { TipoEnvioDto } from "@/types/models";

export const useTipoEnvioQueries = () => {
  // Listar todos los tipos de envío (Venta con entrega, Traslado entre almacenes, etc.)
  const useListAll = () =>
    useQuery<TipoEnvioDto[]>({
      queryKey: ["tipo-envio", "list"],
      queryFn: async () => {
        const response = await tipoEnvioService.listAll();
        return response.data;
      },
    });

  // Obtener tipo de envío por ID
  const useGetById = (id: number) =>
    useQuery<TipoEnvioDto>({
      queryKey: ["tipo-envio", "detail", id],
      queryFn: async () => {
        const response = await tipoEnvioService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  return {
    useListAll,
    useGetById,
  };
};
