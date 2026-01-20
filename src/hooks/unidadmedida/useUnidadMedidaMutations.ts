import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unidadMedidaService } from "@/services/api/unidadMedida.service";
import { UnidadMedidaCreateDto, UnidadMedidaDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useUnidadMedidaMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUnidades = () => {
    queryClient.invalidateQueries({ queryKey: ["unidad-medida"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: UnidadMedidaCreateDto) =>
        unidadMedidaService.create(dto),
      onSuccess: () => {
        notifySuccess("Unidad de medida registrada correctamente");
        invalidateUnidades();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al registrar la unidad de medida";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: UnidadMedidaDto) => unidadMedidaService.update(dto),
      onSuccess: () => {
        notifySuccess("Unidad de medida actualizada correctamente");
        invalidateUnidades();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al actualizar la unidad de medida";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => unidadMedidaService.delete(id),
      onSuccess: () => {
        notifySuccess("Unidad de medida eliminada correctamente");
        invalidateUnidades();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al eliminar la unidad de medida";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
