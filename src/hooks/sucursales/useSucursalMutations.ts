import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sucursalesService } from "@/services/api/sucursales.service";
import { SucursalCreateDto, SucursalUpdateDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useSucursalMutations = () => {
  const queryClient = useQueryClient();

  const invalidateSucursales = () => {
    queryClient.invalidateQueries({ queryKey: ["sucursales"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: SucursalCreateDto) => sucursalesService.create(dto),
      onSuccess: () => {
        notifySuccess("Sucursal creada correctamente");
        invalidateSucursales();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al crear la sucursal";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: SucursalUpdateDto) => sucursalesService.update(dto),
      onSuccess: () => {
        notifySuccess("Sucursal actualizada correctamente");
        invalidateSucursales();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar la sucursal";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => sucursalesService.delete(id),
      onSuccess: () => {
        notifySuccess("Sucursal eliminada correctamente");
        invalidateSucursales();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar la sucursal";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
