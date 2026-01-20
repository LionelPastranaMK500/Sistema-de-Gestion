import { useMutation, useQueryClient } from "@tanstack/react-query";
import { almacenesService } from "@/services/api/almacenes.service";
import { AlmacenCreateDto, AlmacenDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useAlmacenesMutations = () => {
  const queryClient = useQueryClient();

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: ["almacenes"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: AlmacenCreateDto) => almacenesService.create(dto),
      onSuccess: () => {
        notifySuccess("Almacén creado correctamente");
        invalidateLists();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al crear el almacén";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: AlmacenDto) => almacenesService.update(dto),
      onSuccess: () => {
        notifySuccess("Almacén actualizado correctamente");
        invalidateLists();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar el almacén";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => almacenesService.delete(id),
      onSuccess: () => {
        notifySuccess("Almacén eliminado correctamente");
        invalidateLists();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar el almacén";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
