import { useQuery } from "@tanstack/react-query";
import { afectacionIgvService } from "@/services/api/afectacionIgv.service";

export const useAfectacionIgvQueries = () => {
  const useListAll = () =>
    useQuery({
      queryKey: ["afectacion-igv", "list"],
      queryFn: () => afectacionIgvService.listAll(),
      select: (response) => response.data,
    });

  const useGetById = (id: number) =>
    useQuery({
      queryKey: ["afectacion-igv", "detail", id],
      queryFn: () => afectacionIgvService.getById(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  return {
    useListAll,
    useGetById,
  };
};
