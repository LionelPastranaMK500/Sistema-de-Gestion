import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoClienteService } from "@/services/api/tipoCliente.service";
import { TipoClienteCreateDto, TipoClienteDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useTipoClienteMutations = () => {
  const queryClient = useQueryClient();

  const invalidateTipoCliente = () => {
    queryClient.invalidateQueries({ queryKey: ["tipo-cliente"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: TipoClienteCreateDto) => tipoClienteService.create(dto),
      onSuccess: () => {
        notifySuccess("Tipo de cliente registrado correctamente");
        invalidateTipoCliente();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al registrar el tipo de cliente";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: TipoClienteDto) => tipoClienteService.update(dto),
      onSuccess: () => {
        notifySuccess("Tipo de cliente actualizado correctamente");
        invalidateTipoCliente();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al actualizar el tipo de cliente";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => tipoClienteService.delete(id),
      onSuccess: () => {
        notifySuccess("Tipo de cliente eliminado correctamente");
        invalidateTipoCliente();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al eliminar el tipo de cliente";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
