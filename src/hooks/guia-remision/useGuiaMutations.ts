import { useMutation, useQueryClient } from "@tanstack/react-query";
import { guiasService } from "@/services/api/guias.service";
import { GuiaRemisionCreateDto, GuiaRemisionUpdateDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useGuiaMutations = () => {
  const queryClient = useQueryClient();

  const invalidateGuias = () => {
    queryClient.invalidateQueries({ queryKey: ["guias"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: GuiaRemisionCreateDto) => guiasService.create(dto),
      onSuccess: () => {
        notifySuccess("Guía de remisión generada correctamente");
        invalidateGuias();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al crear la guía de remisión";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: GuiaRemisionUpdateDto) => guiasService.update(dto),
      onSuccess: () => {
        notifySuccess("Guía de remisión actualizada");
        invalidateGuias();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar la guía";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => guiasService.delete(id),
      onSuccess: () => {
        notifySuccess("Guía eliminada correctamente");
        invalidateGuias();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar la guía";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
