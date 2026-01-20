import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoEnvioService } from "@/services/api/tipoEnvio.service";
import { TipoEnvioCreateDto, TipoEnvioDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useTipoEnvioMutations = () => {
  const queryClient = useQueryClient();

  const invalidateTipoEnvio = () => {
    queryClient.invalidateQueries({ queryKey: ["tipo-envio"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: TipoEnvioCreateDto) => tipoEnvioService.create(dto),
      onSuccess: () => {
        notifySuccess("Tipo de envío registrado correctamente");
        invalidateTipoEnvio();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al registrar el tipo de envío";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: TipoEnvioDto) => tipoEnvioService.update(dto),
      onSuccess: () => {
        notifySuccess("Tipo de envío actualizado correctamente");
        invalidateTipoEnvio();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al actualizar el tipo de envío";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => tipoEnvioService.delete(id),
      onSuccess: () => {
        notifySuccess("Tipo de envío eliminado correctamente");
        invalidateTipoEnvio();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al eliminar el tipo de envío";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
