import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiculosService } from "@/services/api/vehiculos.service";
import { VehiculoCreateDto, VehiculoUpdateDto } from "@/types/models/vehiculo";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useVehiculoMutations = () => {
  const queryClient = useQueryClient();

  const invalidateVehiculos = () => {
    queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: VehiculoCreateDto) => vehiculosService.create(dto),
      onSuccess: () => {
        notifySuccess("Vehículo registrado correctamente");
        invalidateVehiculos();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al registrar vehículo";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: VehiculoUpdateDto) => vehiculosService.update(dto),
      onSuccess: () => {
        notifySuccess("Datos del vehículo actualizados");
        invalidateVehiculos();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar vehículo";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => vehiculosService.delete(id),
      onSuccess: () => {
        notifySuccess("Vehículo eliminado correctamente");
        invalidateVehiculos();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar vehículo";
        notifyError(msg);
      },
    });

  // Mutación para creación masiva (Batch)
  const useCreateBatch = () =>
    useMutation({
      mutationFn: (dtos: VehiculoCreateDto[]) =>
        vehiculosService.createBatch(dtos),
      onSuccess: (data) => {
        notifySuccess(`${data.data.length} vehículos registrados masivamente`);
        invalidateVehiculos();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error en el registro masivo";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
    useCreateBatch,
  };
};
