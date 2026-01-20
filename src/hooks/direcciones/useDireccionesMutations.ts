import { useMutation, useQueryClient } from "@tanstack/react-query";
import { direccionesService } from "@/services/api/direcciones.service";
import { DireccionCreateDto, DireccionDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useDireccionesMutations = () => {
  const queryClient = useQueryClient();

  const invalidateDirecciones = () => {
    queryClient.invalidateQueries({ queryKey: ["direcciones"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: DireccionCreateDto) => direccionesService.create(dto),
      onSuccess: () => {
        notifySuccess("Dirección registrada correctamente");
        invalidateDirecciones();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al registrar la dirección";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: DireccionDto) => direccionesService.update(dto),
      onSuccess: () => {
        notifySuccess("Dirección actualizada correctamente");
        invalidateDirecciones();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar la dirección";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => direccionesService.delete(id),
      onSuccess: () => {
        notifySuccess("Dirección eliminada correctamente");
        invalidateDirecciones();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar la dirección";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
