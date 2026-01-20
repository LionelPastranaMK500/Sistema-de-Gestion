import { useQuery } from "@tanstack/react-query";
import { seriesService } from "@/services/api/series.service";
import { SerieDto } from "@/types/models";

export const useSeriesQueries = () => {
  // Listar todas las series configuradas
  const useListAll = () =>
    useQuery<SerieDto[]>({
      queryKey: ["series", "list"],
      queryFn: async () => {
        const response = await seriesService.listAll();
        return response.data;
      },
    });

  // Obtener serie por ID
  const useGetById = (id: number) =>
    useQuery<SerieDto>({
      queryKey: ["series", "detail", id],
      queryFn: async () => {
        const response = await seriesService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  // Buscar series por el ID del tipo de comprobante (Fundamental para Ventas)
  const useByComprobante = (comprobanteId: number) =>
    useQuery<SerieDto[]>({
      queryKey: ["series", "comprobante", comprobanteId],
      queryFn: async () => {
        const response =
          await seriesService.buscarPorComprobante(comprobanteId);
        return response.data;
      },
      enabled: !!comprobanteId,
    });

  // Búsqueda por texto (ej: filtrar mientras escriben F001)
  const useBuscarPorSerie = (serie: string) =>
    useQuery<SerieDto[]>({
      queryKey: ["series", "search", serie],
      queryFn: async () => {
        const response = await seriesService.buscarPorSerie(serie);
        return response.data;
      },
      enabled: serie.length > 0,
    });

  return {
    useListAll,
    useGetById,
    useByComprobante,
    useBuscarPorSerie,
  };
};
