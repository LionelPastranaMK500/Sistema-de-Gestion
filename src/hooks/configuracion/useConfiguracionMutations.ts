import { useMutation, useQueryClient } from "@tanstack/react-query";
import { configuracionService } from "@/services/api/configuracion.service";
import {
  ConfiguracionEmpresaCreateDto,
  ConfiguracionEmpresaUpdateDto,
} from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useConfiguracionMutations = () => {
  const queryClient = useQueryClient();

  const invalidateConfig = () => {
    queryClient.invalidateQueries({ queryKey: ["configuracion"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: ConfiguracionEmpresaCreateDto) =>
        configuracionService.create(dto),
      onSuccess: () => {
        notifySuccess("Configuración de empresa guardada");
        invalidateConfig();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al crear configuración";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: ConfiguracionEmpresaUpdateDto) =>
        configuracionService.update(dto),
      onSuccess: () => {
        notifySuccess("Configuración actualizada correctamente");
        invalidateConfig();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar configuración";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => configuracionService.delete(id),
      onSuccess: () => {
        notifySuccess("Configuración eliminada");
        invalidateConfig();
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
