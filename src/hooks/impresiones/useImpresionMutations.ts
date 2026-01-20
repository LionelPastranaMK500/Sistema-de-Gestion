import { useMutation, useQueryClient } from "@tanstack/react-query";
import { impresionesService } from "@/services/api/impresiones.service";
import {
  ImpresionCreateDto,
  ImpresionUpdateDto,
} from "@/types/models/impresion";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useImpresionMutations = () => {
  const queryClient = useQueryClient();

  const invalidateImpresiones = () => {
    queryClient.invalidateQueries({ queryKey: ["impresiones"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: ImpresionCreateDto) => impresionesService.create(dto),
      onSuccess: () => {
        notifySuccess("Configuración de impresión creada");
        invalidateImpresiones();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al crear configuración de impresión";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: ImpresionUpdateDto) => impresionesService.update(dto),
      onSuccess: () => {
        notifySuccess("Configuración de impresión actualizada");
        invalidateImpresiones();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar configuración";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => impresionesService.delete(id),
      onSuccess: () => {
        notifySuccess("Configuración eliminada correctamente");
        invalidateImpresiones();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar configuración";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
