import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoDocNotaService } from "@/services/api/tipoDocNota.service";
import { TipoDocNotaCreateDto, TipoDocNotaUpdateDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useTipoDocNotaMutations = () => {
  const queryClient = useQueryClient();

  const invalidateTipoDocNota = () => {
    queryClient.invalidateQueries({ queryKey: ["tipo-doc-nota"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: TipoDocNotaCreateDto) => tipoDocNotaService.create(dto),
      onSuccess: () => {
        notifySuccess("Tipo de nota registrado correctamente");
        invalidateTipoDocNota();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al registrar el tipo de nota";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: TipoDocNotaUpdateDto) => tipoDocNotaService.update(dto),
      onSuccess: () => {
        notifySuccess("Tipo de nota actualizado correctamente");
        invalidateTipoDocNota();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al actualizar el tipo de nota";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => tipoDocNotaService.delete(id),
      onSuccess: () => {
        notifySuccess("Tipo de nota eliminado correctamente");
        invalidateTipoDocNota();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar el tipo de nota";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
