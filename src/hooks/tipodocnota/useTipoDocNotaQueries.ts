import { useQuery } from "@tanstack/react-query";
import { tipoDocNotaService } from "@/services/api/tipoDocNota.service";
import { TipoDocNotaDto, TipoDocNotaDetailDto } from "@/types/models";

export const useTipoDocNotaQueries = () => {
  // Listar todos los tipos de notas configurados
  const useListAll = () =>
    useQuery<TipoDocNotaDto[]>({
      queryKey: ["tipo-doc-nota", "list"],
      queryFn: async () => {
        const response = await tipoDocNotaService.listAll();
        return response.data;
      },
    });

  // Obtener tipo de nota por ID (Simple)
  const useGetById = (id: number) =>
    useQuery<TipoDocNotaDto>({
      queryKey: ["tipo-doc-nota", "simple", id],
      queryFn: async () => {
        const response = await tipoDocNotaService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  // Obtener detalle completo (con la información del TipoDocumento padre)
  const useGetDetailById = (id: number) =>
    useQuery<TipoDocNotaDetailDto>({
      queryKey: ["tipo-doc-nota", "detail", id],
      queryFn: async () => {
        const response = await tipoDocNotaService.getDetailById(id);
        return response.data;
      },
      enabled: !!id,
    });

  return {
    useListAll,
    useGetById,
    useGetDetailById,
  };
};
