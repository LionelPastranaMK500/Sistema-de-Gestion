import { useMutation, useQueryClient } from "@tanstack/react-query";
import { choferService } from "@/services/api/chofer.service";
import { ChoferCreateDto, ChoferUpdateDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useChoferMutations = () => {
  const queryClient = useQueryClient();

  const invalidateChoferes = () => {
    queryClient.invalidateQueries({ queryKey: ["choferes"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: ChoferCreateDto) => choferService.create(dto),
      onSuccess: () => {
        notifySuccess("Chofer registrado correctamente");
        invalidateChoferes();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al registrar el chofer";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: ChoferUpdateDto) => choferService.update(dto),
      onSuccess: () => {
        notifySuccess("Datos del chofer actualizados");
        invalidateChoferes();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar el chofer";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => choferService.delete(id),
      onSuccess: () => {
        notifySuccess("Chofer eliminado correctamente");
        invalidateChoferes();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar el chofer";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
