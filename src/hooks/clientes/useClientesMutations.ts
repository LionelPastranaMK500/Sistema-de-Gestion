import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesService } from "@/services/api/clientes.service";
import { ClienteCreateDto, ClienteUpdateDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useClientesMutations = () => {
  const queryClient = useQueryClient();

  const invalidateClientes = () => {
    queryClient.invalidateQueries({ queryKey: ["clientes"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: ClienteCreateDto) => clientesService.create(dto),
      onSuccess: () => {
        notifySuccess("Cliente registrado exitosamente");
        invalidateClientes();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al registrar cliente";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: ({ id, dto }: { id: number; dto: ClienteUpdateDto }) =>
        clientesService.update(id, dto),
      onSuccess: () => {
        notifySuccess("Datos del cliente actualizados");
        invalidateClientes();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar cliente";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => clientesService.delete(id),
      onSuccess: () => {
        notifySuccess("Cliente eliminado correctamente");
        invalidateClientes();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar cliente";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
