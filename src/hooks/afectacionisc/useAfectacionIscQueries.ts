import { useQuery } from "@tanstack/react-query";
import { afectacionIscService } from "@/services/api/afectacionIsc.service";

export const useAfectacionIscQueries = () => {
  const useListAll = () =>
    useQuery({
      queryKey: ["afectacion-isc", "list"],
      queryFn: () => afectacionIscService.listAll(),
      select: (response) => response.data,
    });

  const useGetById = (id: number) =>
    useQuery({
      queryKey: ["afectacion-isc", "detail", id],
      queryFn: () => afectacionIscService.getById(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  return {
    useListAll,
    useGetById,
  };
};
