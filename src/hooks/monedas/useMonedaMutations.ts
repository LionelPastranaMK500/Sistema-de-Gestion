import { useMutation, useQueryClient } from "@tanstack/react-query";
import { monedasService } from "@/services/api/monedas.service";
import { MonedaCreateDto, MonedaDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useMonedaMutations = () => {
  const queryClient = useQueryClient();

  const invalidateMonedas = () => {
    queryClient.invalidateQueries({ queryKey: ["monedas"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: MonedaCreateDto) => monedasService.create(dto),
      onSuccess: () => {
        notifySuccess("Moneda registrada correctamente");
        invalidateMonedas();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al registrar la moneda";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: MonedaDto) => monedasService.update(dto),
      onSuccess: () => {
        notifySuccess("Moneda actualizada correctamente");
        invalidateMonedas();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar la moneda";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => monedasService.delete(id),
      onSuccess: () => {
        notifySuccess("Moneda eliminada correctamente");
        invalidateMonedas();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar la moneda";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
