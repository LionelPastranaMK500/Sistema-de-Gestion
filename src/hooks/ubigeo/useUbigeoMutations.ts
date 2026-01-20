import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ubigeoService } from "@/services/api/ubigeo.service";
import { UbigeoCreateDto, UbigeoDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useUbigeoMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUbigeo = () => {
    queryClient.invalidateQueries({ queryKey: ["ubigeo"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: UbigeoCreateDto) => ubigeoService.create(dto),
      onSuccess: () => {
        notifySuccess("Ubigeo registrado correctamente");
        invalidateUbigeo();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al registrar el ubigeo";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: UbigeoDto) => ubigeoService.update(dto),
      onSuccess: () => {
        notifySuccess("Ubigeo actualizado correctamente");
        invalidateUbigeo();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar el ubigeo";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => ubigeoService.delete(id),
      onSuccess: () => {
        notifySuccess("Ubigeo eliminado correctamente");
        invalidateUbigeo();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar el ubigeo";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
