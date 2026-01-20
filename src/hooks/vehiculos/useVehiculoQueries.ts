import { useQuery } from "@tanstack/react-query";
import { vehiculosService } from "@/services/api/vehiculos.service";
import { VehiculoDto } from "@/types/models/vehiculo";

export const useVehiculoQueries = () => {
  // Listar todos los vehículos
  const useListAll = () =>
    useQuery<VehiculoDto[]>({
      queryKey: ["vehiculos", "list"],
      queryFn: async () => {
        const response = await vehiculosService.listAll();
        return response.data;
      },
    });

  // Obtener vehículo por ID
  const useGetById = (id: number) =>
    useQuery<VehiculoDto>({
      queryKey: ["vehiculos", "detail", id],
      queryFn: async () => {
        const response = await vehiculosService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  // Buscar vehículo por placa (Ideal para autocompletado en Guías)
  const useGetByPlaca = (placa: string) =>
    useQuery<VehiculoDto>({
      queryKey: ["vehiculos", "placa", placa],
      queryFn: async () => {
        const response = await vehiculosService.getByPlaca(placa);
        return response.data;
      },
      enabled: placa.length >= 3, // Evitamos búsquedas con pocos caracteres
      retry: false,
    });

  return {
    useListAll,
    useGetById,
    useGetByPlaca,
  };
};
