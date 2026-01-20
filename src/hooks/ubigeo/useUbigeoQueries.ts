import { useQuery } from "@tanstack/react-query";
import { ubigeoService } from "@/services/api/ubigeo.service";
import { UbigeoDto } from "@/types/models";

export const useUbigeoQueries = () => {
  // Listar todos los ubigeos configurados
  const useListAll = () =>
    useQuery<UbigeoDto[]>({
      queryKey: ["ubigeo", "list"],
      queryFn: async () => {
        const response = await ubigeoService.listAll();
        return response.data;
      },
    });

  // Obtener ubigeo específico por ID
  const useGetById = (id: number) =>
    useQuery<UbigeoDto>({
      queryKey: ["ubigeo", "detail", id],
      queryFn: async () => {
        const response = await ubigeoService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  return {
    useListAll,
    useGetById,
  };
};
