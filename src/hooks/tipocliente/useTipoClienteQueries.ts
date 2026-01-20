import { useQuery } from "@tanstack/react-query";
import { tipoClienteService } from "@/services/api/tipoCliente.service";
import { TipoClienteDto } from "@/types/models";

export const useTipoClienteQueries = () => {
  // Listar todos los tipos de cliente configurados
  const useListAll = () =>
    useQuery<TipoClienteDto[]>({
      queryKey: ["tipo-cliente", "list"],
      queryFn: async () => {
        const response = await tipoClienteService.listAll();
        return response.data;
      },
    });

  // Obtener tipo de cliente por ID
  const useGetById = (id: number) =>
    useQuery<TipoClienteDto>({
      queryKey: ["tipo-cliente", "detail", id],
      queryFn: async () => {
        const response = await tipoClienteService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  return {
    useListAll,
    useGetById,
  };
};
